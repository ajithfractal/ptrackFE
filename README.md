# ptrackFE

React frontend for [ptrackBE](../ptrackBE) (Spring Boot API).

## Stack

- React + TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Sonner (toasts)
- Zustand
- React Hook Form + Zod
- Dnd Kit
- Tailwind CSS

## Environment

Copy `.env.example` to `.env`:

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend base URL (e.g. `http://localhost:8080`) |
| `VITE_API_TOKEN` | Optional JWT — attached by `services/api.ts` when set |

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

App: http://localhost:5173  
API (backend): http://localhost:8080

## Project structure

```
src/
├── app/          # App shell, providers
├── components/   # Shared UI (common/, layout/)
├── hooks/        # React Query hooks
├── lib/          # Utilities
├── pages/        # Route pages
├── services/     # API layer (axios)
└── types/        # Shared TypeScript types
```
