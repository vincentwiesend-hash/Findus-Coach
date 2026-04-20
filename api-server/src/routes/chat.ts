import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';
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

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    // Support multiple common env key names
    const apiKey =
      process.env['GROQ_API_KEY'] ??
      process.env['AI_INTEGRATIONS_GROQ_API_KEY'] ??
      process.env['GROQ_KEY'];
    if (!apiKey) {
      throw new Error(
        'Groq API key not set. Add GROQ_API_KEY to your .env file.',
      );
    }
    client = new Groq({ apiKey });
  }
  return client;
}

const SYSTEM_PROMPT = `Du bist ein persönlicher KI-Trainingscoach in der Findus App.
Du analysierst Fitness- und Gesundheitsdaten (Garmin, WHOOP, Intervals.icu) und gibst
konkrete, wissenschaftlich fundierte Trainingsempfehlungen. Antworte immer auf Deutsch,
präzise und motivierend. Beziehe dich auf die Metriken des Athleten wenn möglich.`;

router.post('/', limiter, async (req: Request, res: Response) => {
  const { prompt, context } = req.body as { prompt?: string; context?: string };

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'prompt is required' });
    return;
  }

  try {
    const groq = getClient();

    const userMessage = context
      ? `Kontext (aktuelle Metriken):\n${context}\n\nFrage: ${prompt}`
      : prompt;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? '';
    res.json({ content });
  } catch (error: unknown) {
    console.error('[chat route]', error);
    const message =
      error instanceof Error ? error.message : 'Unbekannter Fehler';
    res.status(500).json({
      error: 'KI-Service vorübergehend nicht verfügbar.',
      detail: process.env['NODE_ENV'] !== 'production' ? message : undefined,
    });
  }
});

export default router;
