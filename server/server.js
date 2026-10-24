// Usama Studio — AI Receptionist webhook server (0-cost stack)
// WhatsApp Cloud API (Meta, free tier) + Google Gemini API (free tier)
// Run: npm install && node server.js   (Node 18+)

const express = require('express');
const fs = require('fs');
const path = require('path');

const {
  WHATSAPP_TOKEN,      // Meta permanent access token
  PHONE_NUMBER_ID,     // WhatsApp Cloud API phone number ID
  VERIFY_TOKEN,        // your own secret word for webhook verification
  GEMINI_API_KEY,      // Google AI Studio key (free tier)
  PORT = 3000,
} = process.env;

for (const [k, v] of Object.entries({ WHATSAPP_TOKEN, PHONE_NUMBER_ID, VERIFY_TOKEN, GEMINI_API_KEY })) {
  if (!v) { console.error(`Missing env var: ${k}`); process.exit(1); }
}

const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, '..', 'system-prompt.md'), 'utf8');
const KNOWLEDGE = fs.readFileSync(path.join(__dirname, '..', 'knowledge-base.md'), 'utf8');

// In-memory chat history per sender (resets on restart — fine for MVP)
const sessions = new Map(); // phone -> [{role, text}]
const MAX_HISTORY = 12;

const app = express();
app.use(express.json());

// 1. Webhook verification (Meta calls this once when you register the URL)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) return res.status(200).send(challenge);
  res.sendStatus(403);
});

// 2. Incoming WhatsApp messages
app.post('/webhook', async (req, res) => {
  res.sendStatus(200); // ack fast; process async
  console.log('webhook POST received');
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg || msg.type !== 'text') { console.log('webhook: no text message in payload'); return; }
    const from = msg.from;
    const text = msg.text.body.trim();
    console.log('incoming message from', from, ':', text.slice(0, 100));
    if (!text) return;

    const history = sessions.get(from) || [];
    history.push({ role: 'user', text });
    const reply = await askGemini(history);
    history.push({ role: 'model', text: reply });
    sessions.set(from, history.slice(-MAX_HISTORY));

    await sendWhatsApp(from, reply);
    console.log('reply sent to', from);
  } catch (e) { console.error('webhook error:', e.message); }
});

async function askGemini(history) {
  const contents = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.text }],
  }));
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT + '\n\nREFERENCE KNOWLEDGE:\n' + KNOWLEDGE }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 300 },
      }),
    }
  );
  const data = await r.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) { console.error('gemini error:', JSON.stringify(data).slice(0, 300)); return "Sorry, I had a hiccup — please try again in a moment."; }
  return text.trim();
}

async function sendWhatsApp(to, text) {
  const r = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WHATSAPP_TOKEN}` },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: text.slice(0, 4000) } }),
  });
  if (!r.ok) console.error('whatsapp send error:', (await r.text()).slice(0, 300));
}

app.get('/', (_req, res) => res.send('Usama Studio receptionist is running. v2-logging'));
app.listen(PORT, () => console.log(`Receptionist listening on :${PORT}`));
