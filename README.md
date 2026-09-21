# Front Enjoy

Русскоязычная платформа для изучения фронтенда. Трек React: текстовые уроки (коротко / подробно / лучшие практики) и мини-квизы. Можно читать без аккаунта; вход — чтобы найти ментора или принимать учеников.

## Структура

- `frontend/` — Vite + React (FSD)
- `backend/` — NestJS API (аккаунты, менторство, облачный прогресс)
- `frontend/content/` — уроки и квизы

## Запуск

```bash
pnpm install
docker compose -f backend/docker-compose.yml up -d
pnpm --filter @front-enjoy/backend prisma:migrate
pnpm --filter @front-enjoy/backend dev
pnpm dev
```

Фронт: `http://localhost:5173`, API: `http://localhost:3001`. Пример env: `frontend/.env.example`, `backend/.env.example`.

Сборка фронта: `pnpm build`. Проверка: `pnpm lint`.

## Деплой на Netlify

Build command: `pnpm build`, publish directory: `frontend/dist`. `netlify.toml` задаёт SPA-редирект. API нужен отдельный хост.

Опора на [документацию React](https://react.dev/learn) (CC BY 4.0), тексты — оригинальные.
