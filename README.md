# WatchNext ▶

AI-powered TV show recommendations based on your streaming services and taste.

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Anthropic API key
```bash
cp .env.example .env.local
```
Open `.env.local` and add your key:
```
ANTHROPIC_API_KEY=sk-ant-...your key here...
```

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

---

## Deploy to Vercel

1. Push to GitHub
2. Import on vercel.com
3. Add `ANTHROPIC_API_KEY` in Environment Variables
4. Deploy
