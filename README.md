# scout

Personal workspace for new-grad job search: scan target companies for openings, track your application pipeline, and prep for interviews.

## Features

- **Jobs** — daily scans of career pages, filtered for new-grad roles
- **Pipeline** — kanban-style application tracking
- **Stats** — funnel and response-rate analytics
- **Companies** — enable/disable scan targets
- **Prep** — spaced-repetition flashcards, pattern-recognition drills, and topic notes

## Setup

```bash
npm install
cp .env.example .env.local   # add DATABASE_URL, auth keys, ALLOWED_EMAILS
npm run db:migrate
npm run db:seed
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run db:migrate` | Run Drizzle migrations |
| `npm run db:seed` | Seed companies and prep content |
| `npm test` | Unit tests |
| `npm run test:e2e` | Playwright smoke tests |
