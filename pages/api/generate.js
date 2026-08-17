import { GoogleGenAI } from '@google/genai';
import { hydraEnabled, retrieveMemories, addMemory } from '../../lib/hydradb.js';

// Run on the Node.js runtime (GenAI SDK requires Node, not Edge)
export const runtime = 'nodejs';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt, mode, webContext } = request.body;

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

    // ---- Optional web grounding (SerpApi "Best AI Use Case" sponsor prize) ----
    // webContext is an array of { title, snippet, link } produced by /api/search.
    // When present, Scriba grounds its writing in live web facts instead of guessing.
    if (Array.isArray(webContext) && webContext.length > 0) {
      const facts = webContext
        .map((r, i) => `[${i + 1}] ${r.title}\n${r.snippet}\n(${r.link})`)
        .join('\n\n');
      systemPrompt +=
        `\n\nYou have access to the following live web search results. Use them to ground your answer in real, current facts where relevant, and cite the source number [n] inline when you use a fact. Do not invent facts beyond these sources.\n\nWEB SEARCH RESULTS:\n${facts}`;
    }

    // ---- Hack Hydra 2026: HydraDB "Memory and Context Retrieval" ----
    // Retrieve relevant past interactions so Scriba personalizes across sessions.
    // Degrades silently if HydraDB is unavailable. Surface metadata to the UI
    // so the integration is visible without inspecting server-side logs.
    const memoryMeta = {
      enabled: hydraEnabled(),
      database: process.env.HYDRADB_DATABASE || 'default-tenant',
      retrieved: [],
      stored: false,
    };
    if (memoryMeta.enabled) {
      try {
        const mems = await retrieveMemories({ query: prompt, maxResults: 5 });
        memoryMeta.retrieved = mems;
        if (mems.length > 0) {
          const memBlock = mems
            .map((m, i) => `[M${i + 1}] ${m}`)
            .join('\n');
          systemPrompt +=
            `\n\nRELEVANT MEMORY FROM PAST SESSIONS (use to personalize tone and recall the user's preferences; do not repeat verbatim):\n${memBlock}`;
        }
      } catch (memErr) {
        console.warn('[HYDRADB] retrieval skipped:', memErr.message);
      }
    }

    // ---- Primary path: OpenAI-compatible provider (agnes / any OpenAI-compatible endpoint) ----
    // Vendor-neutral: works with renhongtao's agnes relay or any OpenAI endpoint.
    // Satisfies hackathons (e.g. Pixel Forge) that only require "AI incorporated".
    const apiKey = process.env.OPENAI_API_KEY;
    const apiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

    let result = null;
    let provider = null;

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

        result = data.choices[0].message.content;
        provider = 'openai-compatible';
      } catch (oiErr) {
        console.error('[OPENAI] Error:', oiErr);
        // fall through to the optional Gemini fallback below
      }
    }

    // ---- Optional fallback: Gemini via Google GenAI SDK ----
    if (!result) {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey: geminiKey });
          const gResult = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
            contents: prompt,
            config: {
              systemInstruction: systemPrompt,
              maxOutputTokens: 1000,
              temperature: 0.7,
            },
          });

          const text = gResult.text;
          if (!text) {
            response.status(502).json({ error: 'Gemini returned an empty response.' });
            return;
          }
          result = text;
          provider = 'gemini-3.5';
        } catch (gemErr) {
          console.error('[GEMINI] Error:', gemErr);
          response.status(502).json({ error: `Gemini API error: ${gemErr.message}` });
          return;
        }
      }
    }

    if (!result) {
      response.status(500).json({
        error:
          'No AI provider configured. Set OPENAI_API_KEY (and optional OPENAI_API_BASE) or GEMINI_API_KEY.',
      });
      return;
    }

    // ---- Hack Hydra 2026: persist this interaction as memory (graceful) ----
    if (memoryMeta.enabled) {
      try {
        await addMemory({
          text: `User (${mode || 'generate'}): ${prompt}\nAssistant (${provider}): delivered a ${mode || 'generate'} result.`,
        });
        memoryMeta.stored = true;
      } catch (storeErr) {
        console.warn('[HYDRADB] memory store skipped:', storeErr.message);
      }
    }

    response.status(200).json({ result, provider, memory: memoryMeta });
  } catch (error) {
    console.error('[API] Unhandled exception:', error);
    response.status(500).json({ error: `Internal server error: ${error.message}` });
  }
}
