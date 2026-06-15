# fractal-project-tracker-web

React frontend for [fractal-project-tracker](../fhjira) (Spring Boot API).

## Stack

- React + TypeScript
- Vite
- React Router
- TanStack Query
- Native Fetch (no HTTP client library)
- Zustand
- React Hook Form + Zod
- Dnd Kit
- Tailwind CSS

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
├── components/   # Shared UI
├── features/     # Feature modules
├── hooks/        # Custom hooks
├── lib/          # Fetch client, utilities
├── pages/        # Route pages
├── routes/       # Route definitions
├── stores/       # Zustand stores
└── types/        # Shared TypeScript types
```
