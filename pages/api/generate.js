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

    let systemPrompt = 'You are a creative AI writer. Expand the following idea into a comprehensive piece.';
    if (mode === 'optimize') {
      systemPrompt = 'You are an expert writing optimizer. Improve the following text for clarity, flow, and professionalism.';
    } else if (mode === 'summarize') {
      systemPrompt = 'You are an expert summarizer. Extract the key points from the following text.';
    }

    const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await apiResponse.json();
    
    if (data.error) {
      response.status(400).json({ error: data.error.message });
      return;
    }

    response.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error('API Error:', error.message);
    response.status(500).json({ error: error.message });
  }
}
