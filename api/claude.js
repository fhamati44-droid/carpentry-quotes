export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI_NOT_CONFIGURED',
      message: 'GROQ_API_KEY is not configured in Vercel'
    });
  }

  const incoming = req.body || {};
  const requestedModel = incoming.model || '';
  const isVision = JSON.stringify(incoming.messages || []).includes('image_url');
  const preferredModel = isVision ? 'qwen/qwen3.6-27b' : (requestedModel || 'openai/gpt-oss-20b');

  async function callGroq(model) {
    const body = { ...incoming, model, stream: false };
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });
    const data = await response.json().catch(() => ({}));
    return { response, data };
  }

  try {
    let { response, data } = await callGroq(preferredModel);

    // Vision fallback: keep image analysis working if a vision model is temporarily unavailable.
    if (isVision && !response.ok && preferredModel !== 'qwen/qwen3.8-27b') {
      const fallback = await callGroq('qwen/qwen3.8-27b');
      response = fallback.response;
      data = fallback.data;
    }

    if (!response.ok) {
      const providerMessage = data?.error?.message || data?.message || 'Groq request failed';
      return res.status(response.status || 502).json({
        error: 'AI_PROVIDER_ERROR',
        message: providerMessage,
        provider_status: response.status,
        provider: 'groq'
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({
      error: 'AI_NETWORK_ERROR',
      message: 'Failed to reach Groq API',
      details: String(err)
    });
  }
}
