# Setup — 0-cost AI receptionist for Usama Studio

## The free stack
| Piece | Service | Cost |
|---|---|---|
| Brain | Google Gemini API (AI Studio free tier) | ₹0 — generous free quota, plenty for a receptionist |
| WhatsApp | Meta WhatsApp Cloud API (direct, no middleman) | ₹0 — 1,000 free service conversations/month |
| Hosting | Cloudflare Workers (free) or Render free tier | ₹0 |

## Steps only YOU can do (~30 min)
1. **Gemini key (free):** go to [Google AI Studio](https://aistudio.google.com) → Get API Key → create. Free tier is enough.
2. **Meta Business account:** at [business.facebook.com](https://business.facebook.com) create an account (free).
3. **WhatsApp Cloud API:** in Meta's developer dashboard, add the WhatsApp product, get a test number instantly (free) or connect your business number later. Note the **Phone Number ID** and generate a **permanent access token**.
4. **Deploy this server** free (Render.com free tier is easiest: connect repo → `npm install && node server.js`, add the 4 env vars from `.env.example`).
5. **Register the webhook** in Meta dashboard: URL = `https://your-app.onrender.com/webhook`, verify token = your `VERIFY_TOKEN`. Subscribe to `messages`.

## Then tell me
- Paste your Gemini key into the secure box I'll show you (never in chat), and I'll configure + test the brain for you.
- I can walk you through the Meta dashboard clicks step by step, or deploy the server with you.

## Limits of free
- 1,000 WhatsApp conversations/month free, then Meta charges per conversation (still cheap at this volume).
- Gemini free tier has rate limits — fine for a receptionist, not for heavy traffic.
- Render free tier sleeps when idle (first reply after sleep takes ~30s). Cloudflare Workers free has no sleep but needs a small code adaptation — I can do that when you're ready.
