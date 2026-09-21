# Backend

NestJS API: аккаунты, профили, менторство, облачный прогресс.

```bash
docker compose -f backend/docker-compose.yml up -d
cp backend/.env.example backend/.env
pnpm --filter @front-enjoy/backend prisma:migrate
pnpm --filter @front-enjoy/backend dev
```

API: `http://localhost:3001`. Фронт: `VITE_API_URL`.
