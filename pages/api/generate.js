import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, mode } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    let systemPrompt = '';
    
    switch (mode) {
      case 'optimize':
        systemPrompt = You are an expert writing optimizer. Improve the following text for clarity, flow, and professionalism. Keep the original meaning intact.;
        break;
      case 'summarize':
        systemPrompt = You are an expert summarizer. Extract the key points from the following text. Provide main ideas, supporting details, and action items in a concise format.;
        break;
      case 'generate':
      default:
        systemPrompt = You are a creative AI writer. Expand the following idea into a comprehensive, well-structured piece. Add key points, examples, and actionable insights.;
        break;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // 便宜且快速的模型
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;

    res.status(200).json({ result });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
