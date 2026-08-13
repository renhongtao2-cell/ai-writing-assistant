import { GoogleGenAI } from '@google/genai';

// Run on the Node.js runtime (GenAI SDK requires Node, not Edge)
export const runtime = 'nodejs';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt, mode } = request.body;

    if (!prompt) {
      response.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // Scriba — a collaborative writing partner. It guides the user through the
    // writing lifecycle via three modes and adapts its voice to the chosen mode.
    let systemPrompt =
      'You are Scriba, a collaborative AI writing partner. You co-create with the user: take their rough idea and expand it into a complete, well-structured, engaging piece of writing. Ask nothing — just deliver strong draft text they can build on.';
    if (mode === 'optimize') {
      systemPrompt =
        'You are Scriba, a collaborative AI writing partner acting as a professional editor. Take the user\'s messy or repetitive text and rewrite it for clarity, flow, tone, and professionalism. Preserve meaning. Output only the polished text.';
    } else if (mode === 'summarize') {
      systemPrompt =
        'You are Scriba, a collaborative AI writing partner acting as a summarizer. Read the user\'s long text and extract the key points as a tight, scannable summary. Output only the summary.';
    }

    // ---- Primary path: OpenAI-compatible provider (agnes / any OpenAI-compatible endpoint) ----
    // Vendor-neutral: works with renhongtao's agnes relay or any OpenAI endpoint.
    // Satisfies hackathons (e.g. Pixel Forge) that only require "AI incorporated".
    const apiKey = process.env.OPENAI_API_KEY;
    const apiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

    if (apiKey) {
      try {
        console.log(`[API] Calling ${apiBase}/chat/completions with model: ${model}`);

        const apiResponse = await fetch(`${apiBase}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });

        const contentType = apiResponse.headers.get('content-type') || '';
        let data;
        if (contentType.includes('application/json')) {
          data = await apiResponse.json();
        } else {
          const text = await apiResponse.text();
          console.error('[API] Non-JSON response:', text.substring(0, 500));
          throw new Error(`Upstream API returned non-JSON response (HTTP ${apiResponse.status}).`);
        }

        if (!apiResponse.ok) {
          const errMsg = data?.error?.message || data?.error || `HTTP ${apiResponse.status}`;
          throw new Error(`AI Provider Error: ${errMsg}`);
        }

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Unexpected response format from AI provider');
        }

        response.status(200).json({ result: data.choices[0].message.content, provider: 'openai-compatible' });
        return;
      } catch (oiErr) {
        console.error('[OPENAI] Error:', oiErr);
        // fall through to the optional Gemini fallback below
      }
    }

    // ---- Optional fallback: Gemini via Google GenAI SDK ----
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const result = await ai.models.generateContent({
          model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        });

        const text = result.text;
        if (!text) {
          response.status(502).json({ error: 'Gemini returned an empty response.' });
          return;
        }
        response.status(200).json({ result: text, provider: 'gemini-3.5' });
        return;
      } catch (gemErr) {
        console.error('[GEMINI] Error:', gemErr);
        response.status(502).json({ error: `Gemini API error: ${gemErr.message}` });
        return;
      }
    }

    response.status(500).json({
      error:
        'No AI provider configured. Set OPENAI_API_KEY (and optional OPENAI_API_BASE) or GEMINI_API_KEY.',
    });
  } catch (error) {
    console.error('[API] Unhandled exception:', error);
    response.status(500).json({ error: `Internal server error: ${error.message}` });
  }
}
