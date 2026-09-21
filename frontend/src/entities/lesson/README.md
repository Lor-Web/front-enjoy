# entities/lesson

Реестр уроков React. JSON и MDX из `frontend/content/tracks/react/lessons/<slug>/` читаются только здесь.

- `loadLessons` — glob `lesson.json` + `short.mdx` / `detailed.mdx` / `best-practices.mdx`.
- Ключи Query: `['lessons']`, `['lesson', slug]`. Смена источника — только `queryFn`.
- Вид (коротко / подробно / лучшие практики) выбирает UI, не этот слайс.
- `readingMinutes` считается из MDX на сборке (слова + блоки кода).
