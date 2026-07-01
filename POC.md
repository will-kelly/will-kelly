# willkelly.com — Proof of Concept

A fast, dependency-free personal/consulting site for **Will Kelly** — technical
content strategist focused on AI enablement and content operations.

## What this is

A single-page marketing site that turns the README bio into a real landing page,
built around Will's signature positioning: **"Sell the diagnostic, not the solution."**

The centerpiece is a working **AI & documentation readiness diagnostic** — six
questions, an instant weighted score, and tier-specific guidance — so the site
*demonstrates* the philosophy instead of just describing it. No email wall.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Full landing page markup (hero, three core areas, diagnostic, products, proof, contact) |
| `styles.css` | Design system + responsive layout, no framework |
| `app.js` | Mobile nav + the interactive readiness diagnostic |
| `README.md` | Will's existing account bio (unchanged) |

## Sections

1. **Hero** — positioning line, dual CTA, track-record stats
2. **What I build** — the three core areas
3. **Live diagnostic** — the interactive scorecard (the differentiator)
4. **Products** — ContentOps / Gumroad / Notion catalog
5. **Philosophy** — pull quote
6. **Proof** — Docker, GDIT, CDW, independent
7. **Contact** — email, LinkedIn, newsletter, Medium

## Run it

It's static — just open `index.html`, or serve locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Zero build step. Works as-is on GitHub Pages, Netlify, Vercel, or Cloudflare Pages.
Point the `willkelly.com` domain at whichever host you prefer.

## Notes / next steps

- Diagnostic uses a demonstration scoring model; wire it to the production
  maturity rubric and (optionally) capture leads on the results step.
- Swap the CTA `mailto:` for a scheduling link (Cal.com / Calendly).
- Add real Gumroad / Notion Marketplace product links when live.
