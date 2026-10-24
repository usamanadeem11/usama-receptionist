# Usama Studio AI Receptionist — Go-Live Blueprint

## What you have now
- `knowledge-base.md` — the facts the receptionist may state
- `system-prompt.md` — the brain, ready to paste into any LLM
- In-chat demo widget — rule-based preview of the conversation flow

## What "live" needs (3 pieces)
1. **A brain (LLM)** — system-prompt.md + knowledge-base.md wired to an LLM API
   (e.g. OpenAI, Anthropic, or any provider). This replaces the demo's keyword matching.
2. **A WhatsApp number** — WhatsApp Business API via a provider (popular in India:
   Interakt, WATI, Gupshup). ~₹1,000–3,000/month depending on volume.
3. **Glue** — a small webhook server: WhatsApp message in → LLM reply out.
   Can run on any cheap VPS or serverless function.

## Suggested path (simplest first)
- **Phase 1 (this week, free):** test the demo flow with real FAQs; refine the knowledge base.
- **Phase 2:** connect the system prompt to an LLM in a web chat on usamastudio.tech.
- **Phase 3:** WhatsApp Business API via Interakt/WATI → webhook → LLM. This is the
  product you can also sell to clients (hospitals, schools, builders — your prospect list).

## What I can do next
- Build the webhook server code (Node/Python) when you're ready
- Draft the WhatsApp Business API application steps
- Create a client-facing one-pager: "AI Receptionist for your business" (lead magnet for outreach)
- Train the brain on more FAQs as they come in

## Cost honesty
- Demo: free. Web chat with LLM: pay-per-message (paise per chat). WhatsApp API:
  provider fee + Meta's per-conversation pricing. No big upfront cost.
