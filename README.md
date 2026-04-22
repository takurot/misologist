# Misologist — Fermentation Diagnosis & Craft Knowledge Engine

Japanese README: [README.ja.md](README.ja.md)

> "Twenty years of miso craftsmanship, explained as science by Opus 4.7."

**Anthropic Hackathon 2025 — Built with Opus 4.7**

## Overview

Misologist is an AI-assisted platform for home miso makers, small breweries, and fermentation researchers. It aims to prevent irreversible once-a-year batch failures while preserving tacit craft knowledge as explicit fermentation science.

### Why Opus 4.7 matters here

| What smaller models struggle to replace | What Opus 4.7 contributes |
|---|---|
| Comparing multi-batch, multi-month fermentation logs | Long-context synthesis |
| Translating sayings like "winter brewing tastes better" into chemistry | Scientific translation of tacit craft knowledge |
| Explaining why a mold is acceptable or dangerous, step by step | Uncertainty handling with grounded rationale |

## Core Features

### Feature 1 — Emergency Fermentation Diagnosis

Upload a fermentation photo and Opus 4.7 diagnoses the batch immediately.

- **Mold identification:** Distinguishes likely white film yeast, blue mold, red yeast, and related cases
- **Urgency levels:** `GREEN`, `YELLOW`, or `RED`
- **Fermentation chemistry rationale:** Explains why the batch is or is not at risk
- **Immediate actions:** Provides concrete remediation and prevention steps
- **Cross-batch comparison:** Supports longitudinal reasoning against past batches

### Feature 2 — Batch Monitoring Agent

From the day a batch starts to the day it matures, the system monitors asynchronously in the background.

- One batch maps to one agent session
- The agent proposes today's action on a recurring basis
- Estimated completion timing is recalculated as conditions evolve

### Feature 3 — Craft Knowledge Translation

Turns workshop heuristics into the language of fermentation chemistry.

- **Translation mode:** Explains traditional rules of thumb with enzyme, amino acid, and reaction-level reasoning
- **Reverse design mode:** Works backward from a target flavor profile to recipe and maturation parameters

## Product Pivot

This project started as a one-shot photo diagnosis tool and was redesigned around three core issues.

| Original issue | Why it was weak | Current direction |
|---|---|---|
| Single-photo diagnosis only | Vision-only analysis is not enough to justify Opus 4.7 | Longitudinal reasoning across batches and time |
| A vague 0-100 fermentation score | Hard to defend the scoring logic | Explanations grounded in fermentation chemistry |
| Using managed agents for short synchronous work | Wastes the strengths of long-running async agents | Persistent batch watcher for longer workflows |

## Tech Stack

| Layer | Component | Responsibility |
|---|---|---|
| Frontend | Next.js 14 App Router | Upload flows, results UI, batch dashboard |
| AI Engine | Claude Opus 4.7 | Vision diagnosis, fermentation reasoning, knowledge translation |
| Agent Layer | Claude Managed Agents | Async batch monitoring and long-lived sessions |
| Data | Supabase (PostgreSQL) | Batch logs, diagnosis history, metadata |
| Storage | Supabase Storage | Fermentation photo storage |
| Deployment | Vercel | Serverless runtime |

## Setup

### Prerequisites

- Node.js 18+
- A Supabase account
- An Anthropic API key with Opus 4.7 access

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Initialize Supabase

Run `docs/schema.sql` in the Supabase SQL Editor.

### Install and Run

```bash
npm install
npm run dev
```

The app starts at `http://localhost:3000`.

## Data Schema

```sql
batches:        id / name / started_at / recipe_json / status
logs:           id / batch_id / captured_at / photo_url / env_json / diagnosis_json / action_json
agent_sessions: id / batch_id / agent_state / last_action_at / next_action_at
```

## License

MIT License — see [LICENSE](LICENSE)
