import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit: 20 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Anfragen. Bitte warte eine Minute.' },
});

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env['AI_INTEGRATIONS_GROQ_API_KEY'];
    if (!apiKey) throw new Error('AI_INTEGRATIONS_GROQ_API_KEY is not set');
    client = new OpenAI({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }
  return client;
}

const SYSTEM_PROMPT = `Du bist ein persönlicher KI-Trainingscoach in der Findus App.
Du analysierst Fitness- und Gesundheitsdaten (Garmin, WHOOP, Intervals.icu) und gibst
konkrete, wissenschaftlich fundierte Trainingsempfehlungen. Antworte immer auf Deutsch,
präzise und motivierend. Beziehe dich auf die Metriken des Athleten wenn möglich.`;

router.post('/', limiter, async (req: Request, res: Response) => {
  const { prompt } = req.body as { prompt?: string };

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'prompt is required' });
    return;
  }

  try {
    const groq = getClient();
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 8192,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    });
    const content = completion.choices[0]?.message?.content ?? '';
    res.json({ content });
  } catch (error) {
    req.log.error({ error }, 'Chat route error');
    res.status(500).json({ error: 'KI-Service vorübergehend nicht verfügbar.' });
  }
});

export default router;
