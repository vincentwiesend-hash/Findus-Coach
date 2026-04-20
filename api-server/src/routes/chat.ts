import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import rateLimit from 'express-rate-limit';

const router = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Anfragen. Bitte warte eine Minute.' },
});

let ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!ai) {
    const apiKey =
      process.env['GEMINI_API_KEY'] ??
      process.env['GOOGLE_API_KEY'] ??
      process.env['GOOGLE_GEMINI_API_KEY'];
    if (!apiKey) {
      throw new Error(
        'Gemini API key not set. Add GEMINI_API_KEY to your .env file. ' +
        'Free key: https://aistudio.google.com/apikey',
      );
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

const SYSTEM_PROMPT =
  'Du bist ein persönlicher KI-Trainingscoach in der Findus App. ' +
  'Du analysierst Fitness- und Gesundheitsdaten (Garmin, WHOOP, Intervals.icu) und gibst ' +
  'konkrete, wissenschaftlich fundierte Trainingsempfehlungen. Antworte immer auf Deutsch, ' +
  'präzise und motivierend. Beziehe dich auf die Metriken des Athleten wenn möglich.';

router.post('/', limiter, async (req: Request, res: Response) => {
  const { prompt, context } = req.body as { prompt?: string; context?: string };

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'prompt is required' });
    return;
  }

  try {
    const genai = getClient();

    const userMessage = context
      ? `Kontext (aktuelle Metriken):\n${context}\n\nFrage: ${prompt}`
      : prompt;

    const response = await genai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const content = response.text ?? '';
    res.json({ content });
  } catch (error: unknown) {
    console.error('[chat route]', error);
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    res.status(500).json({
      error: 'KI-Service vorübergehend nicht verfügbar.',
      detail: process.env['NODE_ENV'] !== 'production' ? message : undefined,
    });
  }
});

export default router;
