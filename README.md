# Findus Coach

Personlicher KI-Trainingscoach – verbindet Garmin, WHOOP und Intervals.icu Daten mit einem LLM-basierten Coach.

## Stack

- **API Server**: Node.js + Express 5 + TypeScript
- **Mobile**: React Native + Expo (iOS/Android/Web)
- **KI**: Groq (Llama 3.3 70B) – kostenlos
- **Training-Daten**: Intervals.icu API Proxy

## Setup

```bash
cp .env.example .env
# Trage deinen Groq API Key ein: https://console.groq.com

pnpm install
pnpm --filter @workspace/api-server dev
```

## API Endpoints

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/healthz` | Health check |
| `POST` | `/api/chat` | KI Coach (Groq Llama 3.3 70B) |
| `GET` | `/api/intervals/wellness` | Wellness-Daten (HRV, CTL, ATL) |
| `GET` | `/api/intervals/activities` | Aktivitäten |
| `GET` | `/api/intervals/athlete` | Athleten-Profil |
| `POST` | `/api/intervals/verify` | Credentials testen |

## Umgebungsvariablen

Siehe `.env.example`.

## Rate Limiting

Der `/api/chat` Endpunkt ist auf **20 Anfragen/Minute pro IP** limitiert.
