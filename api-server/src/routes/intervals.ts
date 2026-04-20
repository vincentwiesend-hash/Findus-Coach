import { Router, Request, Response } from 'express';

const router = Router();

const BASE = 'https://intervals.icu/api/v1';
const MAX_DAYS = 365;
const MAX_LIMIT = 200;

function getAuth(req: Request): string | null {
  const key = req.headers['x-intervals-key'] as string | undefined;
  if (!key) return null;
  return 'Basic ' + Buffer.from(`API_KEY:${key}`).toString('base64');
}

function athleteId(req: Request): string | null {
  return (req.headers['x-intervals-id'] as string) || (req.query.athleteId as string) || null;
}

async function proxyGet(url: string, auth: string): Promise<{ ok: boolean; data: unknown; status: number }> {
  const res = await fetch(url, {
    headers: { Authorization: auth, Accept: 'application/json' },
  });
  const data = await res.json();
  return { ok: res.ok, data, status: res.status };
}

// GET /api/intervals/wellness?days=30
router.get('/wellness', async (req: Request, res: Response) => {
  const auth = getAuth(req);
  const id = athleteId(req);
  if (!auth || !id) { res.status(401).json({ error: 'Missing credentials' }); return; }

  const days = Math.min(parseInt((req.query.days as string) ?? '60', 10), MAX_DAYS);
  const oldest = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  const url = `${BASE}/athlete/${id}/wellness?oldest=${oldest}`;
  const { ok, data, status } = await proxyGet(url, auth);
  if (!ok) { res.status(status).json(data); return; }
  res.json(data);
});

// GET /api/intervals/activities?limit=30
router.get('/activities', async (req: Request, res: Response) => {
  const auth = getAuth(req);
  const id = athleteId(req);
  if (!auth || !id) { res.status(401).json({ error: 'Missing credentials' }); return; }

  const limit = Math.min(parseInt((req.query.limit as string) ?? '30', 10), MAX_LIMIT);
  const days = Math.min(parseInt((req.query.days as string) ?? '60', 10), MAX_DAYS);
  const oldest = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  const url = `${BASE}/athlete/${id}/activities?oldest=${oldest}&limit=${limit}`;
  const { ok, data, status } = await proxyGet(url, auth);
  if (!ok) { res.status(status).json(data); return; }
  res.json(data);
});

// GET /api/intervals/athlete
router.get('/athlete', async (req: Request, res: Response) => {
  const auth = getAuth(req);
  const id = athleteId(req);
  if (!auth || !id) { res.status(401).json({ error: 'Missing credentials' }); return; }

  const url = `${BASE}/athlete/${id}`;
  const { ok, data, status } = await proxyGet(url, auth);
  if (!ok) { res.status(status).json(data); return; }
  res.json(data);
});

// POST /api/intervals/verify - test credentials
router.post('/verify', async (req: Request, res: Response) => {
  const auth = getAuth(req);
  const id = athleteId(req);
  if (!auth || !id) { res.status(401).json({ error: 'Missing credentials' }); return; }

  const url = `${BASE}/athlete/${id}`;
  try {
    const { ok, data, status } = await proxyGet(url, auth);
    if (ok) {
      res.json({ success: true, athlete: data });
    } else {
      res.status(status).json({ success: false, error: 'Invalid credentials' });
    }
  } catch {
    res.status(500).json({ success: false, error: 'Connection failed' });
  }
});

export default router;
