# Front Enjoy

Русскоязычная платформа для изучения фронтенда. Трек React: текстовые уроки (коротко / подробно / лучшие практики) и мини-квизы. Пока в треке две темы — для проверки. Прогресс хранится в браузере.

## Структура

- `frontend/` — Vite + React (FSD)
- `backend/` — место под NestJS, пока заглушка
- `frontend/content/` — уроки и квизы

## Запуск

```bash
pnpm install
pnpm dev
```

Сборка: `pnpm build`. Проверка: `pnpm lint`.

## Деплой на Netlify

Build command: `pnpm build`, publish directory: `frontend/dist`. `netlify.toml` задаёт SPA-редирект.

Опора на [документацию React](https://react.dev/learn) (CC BY 4.0), тексты — оригинальные.
