import { type Course, PLATFORM_AUTHOR_ID, PLATFORM_INSTRUCTOR } from "./types";

export const COURSES: Course[] = [
  {
    slug: "react-s-nulya",
    title: "React с нуля: собираем меню кафе",
    subtitle:
      "Компоненты, JSX, пропсы и состояние на одном сквозном проекте — без воды и копипаста из документации.",
    description: [
      "Курс для тех, кто уже пишет HTML и чуть-чуть JavaScript и хочет собрать первый настоящий интерфейс на React. Мы ведём одно кафе «Зёрнышко»: шапка, меню, карточка напитка, бар заказа.",
      "Каждый модуль заканчивается домашним заданием в репозитории с тестами. Проверяется не «похожесть на скриншот», а поведение: клик добавляет позицию, список не ломает ключи, состояние не мутируется.",
    ],
    tech: "react",
    publisher: "platform",
    authorId: PLATFORM_AUTHOR_ID,
    grade: "junior",
    priceRub: 4990,
    rating: 4.8,
    ratingCount: 1284,
    students: 6420,
    hours: 12.5,
    updatedAt: "2026-09-01",
    language: "Русский",
    badge: "bestseller",
    learnings: [
      "Собирать интерфейс из функций-компонентов, а не из копий HTML",
      "Передавать данные пропсами и не путать их с состоянием",
      "Рисовать списки с устойчивыми key",
      "Поднимать общее состояние заказа наверх",
    ],
    requirements: [
      "Базовый JavaScript: функции, массивы, объекты",
      "Умение открыть проект в VS Code и запустить Vite",
    ],
    includes: [
      "12,5 часов практики",
      "9 лекций",
      "Домашние задания с автотестами",
      "Доступ к обновлениям курса",
    ],
    instructor: PLATFORM_INSTRUCTOR,
    sections: [
      {
        title: "Старт и сборка",
        lectures: [
          {
            title: "Как устроен курс и репозиторий",
            minutes: 8,
            preview: true,
          },
          { title: "Vite, React 19 и первая страница", minutes: 14 },
          { title: "Домашнее задание: поднять проект", minutes: 6 },
        ],
      },
      {
        title: "Компоненты и JSX",
        lectures: [
          { title: "Header, Menu, DrinkCard", minutes: 18, preview: true },
          { title: "JSX: скобки, className, фрагмент", minutes: 16 },
          { title: "Практика: карточка латте", minutes: 22 },
        ],
      },
      {
        title: "Состояние заказа",
        lectures: [
          { title: "useState без магии", minutes: 20 },
          { title: "Не мутировать массив заказа", minutes: 15 },
          { title: "Домашнее задание: кнопка «В заказ»", minutes: 12 },
        ],
      },
    ],
    reviews: [
      {
        name: "Илья",
        rating: 5,
        date: "2026-08-12",
        text: "Наконец курс, где не пересказывают react.dev, а собирают одно приложение. Тесты в домашке сразу ловят глупые ошибки с key.",
      },
      {
        name: "Света",
        rating: 5,
        date: "2026-07-03",
        text: "После модуля про состояние перестала пушить в массив. Стоило денег только из‑за этого.",
      },
    ],
  },
  {
    slug: "javascript-stazher",
    title: "JavaScript для стажёра",
    subtitle:
      "Типы, функции, массивы и DOM — тот минимум, без которого React только путает.",
    description: [
      "Бесплатный курс перед React. Пишем утилиты для того же кафе: форматирование цены, фильтр меню, счётчик позиций.",
      "Домашки проверяются тестами. Цель — уверенно читать чужой JS и не бояться колбэков.",
    ],
    tech: "javascript",
    publisher: "platform",
    authorId: PLATFORM_AUTHOR_ID,
    grade: "intern",
    priceRub: 0,
    rating: 4.6,
    ratingCount: 890,
    students: 12100,
    hours: 8,
    updatedAt: "2026-06-18",
    language: "Русский",
    learnings: [
      "Отличать примитивы от объектов",
      "Писать чистые функции без побочных эффектов «на всякий случай»",
      "Проходить массив меню через map/filter/reduce",
      "Вешать обработчики, не плодя утечки",
    ],
    requirements: [
      "Любой редактор и браузер",
      "Желание решать задачи, а не только смотреть",
    ],
    includes: [
      "8 часов практики",
      "5 лекций",
      "Домашние задания с автотестами",
    ],
    instructor: PLATFORM_INSTRUCTOR,
    sections: [
      {
        title: "Язык без фреймворка",
        lectures: [
          { title: "Что должен уметь стажёр", minutes: 10, preview: true },
          { title: "Функции и область видимости", minutes: 22 },
          { title: "Массивы меню", minutes: 18 },
        ],
      },
      {
        title: "DOM и события",
        lectures: [
          { title: "Кнопка «В заказ» на чистом JS", minutes: 20 },
          { title: "Домашнее задание: фильтр по цене", minutes: 15 },
        ],
      },
    ],
    reviews: [
      {
        name: "Артём",
        rating: 5,
        date: "2026-05-21",
        text: "Бесплатно и по делу. После фильтра массивов React уже не казался магией.",
      },
      {
        name: "Катя",
        rating: 4,
        date: "2026-04-02",
        text: "Хотелось чуть больше про асинхронность, но как разгон перед джуном — отлично.",
      },
    ],
  },
  {
    slug: "react-sostoyanie",
    title: "Состояние и эффекты в React",
    subtitle:
      "Снимки, апдейтеры, подъём состояния и аккуратный useEffect — для тех, кто уже собрал первые экраны.",
    description: [
      "Middle-курс: заказ в кафе обрастает поиском, подсказками и синхронизацией заголовка вкладки. Разбираем, когда эффект нужен, а когда достаточно вычисления.",
      "Домашки ловят гонки, лишние подписки и копирование пропсов в state.",
    ],
    tech: "react",
    publisher: "platform",
    authorId: PLATFORM_AUTHOR_ID,
    grade: "middle",
    priceRub: 6990,
    rating: 4.7,
    ratingCount: 540,
    students: 2100,
    hours: 10,
    updatedAt: "2026-08-20",
    language: "Русский",
    learnings: [
      "Видеть state как снимок, а не как ячейку памяти",
      "Писать апдейтеры, когда новое зависит от старого",
      "Отличать производные данные от второго useState",
      "Синхронизировать внешние системы эффектом, а не «на всякий случай»",
    ],
    requirements: ["Курс «React с нуля» или опыт с компонентами и useState"],
    includes: [
      "10 часов практики",
      "5 лекций",
      "Домашние задания с автотестами",
      "Разборы типичных багов ревью",
    ],
    instructor: PLATFORM_INSTRUCTOR,
    sections: [
      {
        title: "Снимок и апдейтер",
        lectures: [
          {
            title: "Почему два setCount не дают +2",
            minutes: 16,
            preview: true,
          },
          { title: "Заказ: immutable add/remove", minutes: 24 },
        ],
      },
      {
        title: "Эффекты",
        lectures: [
          { title: "Заголовок вкладки и document.title", minutes: 14 },
          { title: "Подписка, которую надо снять", minutes: 18 },
          { title: "Домашнее задание: поиск с задержкой", minutes: 20 },
        ],
      },
    ],
    reviews: [
      {
        name: "Никита",
        rating: 5,
        date: "2026-08-28",
        text: "После этого перестал писать useEffect на каждый чих. Ревью на работе стало спокойнее.",
      },
    ],
  },
  {
    slug: "typescript-dlya-react",
    title: "TypeScript для React",
    subtitle:
      "Пропсы, события и дженерики так, чтобы компилятор помогал, а не орал на весь файл.",
    description: [
      "Берём знакомое меню кафе и закрываем его типами. Никакого «as any, потом разберёмся».",
      "Домашки падают, если пропсы карточки разъехались с данными.",
    ],
    tech: "typescript",
    publisher: "author",
    authorId: "denis-strogiy",
    grade: "middle",
    priceRub: 5490,
    rating: 4.5,
    ratingCount: 312,
    students: 1480,
    hours: 7.5,
    updatedAt: "2026-07-11",
    language: "Русский",
    learnings: [
      "Описывать пропсы без копипасты интерфейсов на каждый чих",
      "Типизировать обработчики и формы",
      "Сужать union по виду напитка",
      "Читать ошибки tsc, а не отключать строгий режим",
    ],
    requirements: ["React на уровне компонентов и пропсов", "Базовый JS"],
    includes: [
      "7,5 часов практики",
      "4 лекции",
      "Домашние задания с автотестами",
    ],
    instructor: {
      name: "Денис Строгий",
      role: "Lead, TypeScript",
      bio: "Наводит порядок в типах продуктовых команд. Курс — выжимка внутренних гайдов, без академического лишнего.",
      courses: 2,
      students: 1480,
      rating: 4.5,
    },
    sections: [
      {
        title: "Контракт карточки",
        lectures: [
          { title: "Props DrinkCard", minutes: 15, preview: true },
          { title: "Дети и слоты", minutes: 12 },
        ],
      },
      {
        title: "События и формы",
        lectures: [
          { title: "ChangeEvent без боли", minutes: 18 },
          { title: "Домашнее задание: тип заказа", minutes: 20 },
        ],
      },
    ],
    reviews: [
      {
        name: "Оля",
        rating: 4,
        date: "2026-07-30",
        text: "Коротко и по коду. Хотелось ещё модуль про дженерики хуков — жду обновление.",
      },
    ],
  },
  {
    slug: "javascript-async",
    title: "Асинхронность в JavaScript",
    subtitle:
      "Промисы, async/await и гонки на примере «меню с сервера», без магии фреймворка.",
    description: [
      "Учимся загружать меню, показывать скелетон и не применять устаревший ответ, если гость уже сменил фильтр.",
      "Тесты эмулируют задержку сети. Списать «на setTimeout в голове» не выйдет.",
    ],
    tech: "javascript",
    publisher: "platform",
    authorId: PLATFORM_AUTHOR_ID,
    grade: "junior",
    priceRub: 3990,
    rating: 4.3,
    ratingCount: 210,
    students: 980,
    hours: 6,
    updatedAt: "2026-05-02",
    language: "Русский",
    learnings: [
      "Читать цепочку промисов вслух",
      "Писать async-функции без потерянных ошибок",
      "Отменять устаревший запрос",
      "Показывать состояние загрузки отдельно от данных",
    ],
    requirements: ["Уверенный JavaScript без фреймворка"],
    includes: [
      "6 часов практики",
      "4 лекции",
      "Домашние задания с автотестами",
    ],
    instructor: PLATFORM_INSTRUCTOR,
    sections: [
      {
        title: "Промисы",
        lectures: [
          { title: "fetch меню", minutes: 16, preview: true },
          { title: "Ошибки и повтор", minutes: 14 },
        ],
      },
      {
        title: "Гонки",
        lectures: [
          { title: "Последний ответ побеждает", minutes: 18 },
          { title: "Домашнее задание: abort", minutes: 16 },
        ],
      },
    ],
    reviews: [
      {
        name: "Вадим",
        rating: 4,
        date: "2026-05-19",
        text: "Гонки объяснили лучше, чем на трёх собесах подряд. Домашка жёсткая — это плюс.",
      },
    ],
  },
  {
    slug: "react-formy-i-dannye",
    title: "Формы и данные в React",
    subtitle:
      "Контролируемые поля, валидация и отправка заказа. Для тех, кто уже живёт в состоянии.",
    description: [
      "Собираем оформление заказа: имя, комментарий, способ связи. Без «ещё одной библиотеки форм в первый день».",
      "Новый курс: домашки завязаны на схему и сообщения об ошибках по блюру — как в нашем кабинете.",
    ],
    tech: "react",
    publisher: "author",
    authorId: "denis-strogiy",
    grade: "senior",
    priceRub: 7990,
    rating: 4.9,
    ratingCount: 86,
    students: 340,
    hours: 9,
    updatedAt: "2026-09-10",
    language: "Русский",
    badge: "new",
    learnings: [
      "Держать форму одним объектом, а не десятком useState",
      "Валидировать по потере фокуса, не оркестром на каждый символ",
      "Не давать отправить пустой заказ",
      "Отделять UI-ошибки от ошибок сети",
    ],
    requirements: ["Уверенный React: состояние, списки, события"],
    includes: [
      "9 часов практики",
      "4 лекции",
      "Домашние задания с автотестами",
      "Шаблон формы, который можно унести в проект",
    ],
    instructor: {
      name: "Денис Строгий",
      role: "Lead, TypeScript",
      bio: "Формы — место, где senior отличается от «умею useState». Курс собран из боевых ревью.",
      courses: 2,
      students: 1480,
      rating: 4.5,
    },
    sections: [
      {
        title: "Модель формы",
        lectures: [
          { title: "Один объект заказа", minutes: 14, preview: true },
          { title: "Поля и blur", minutes: 18 },
        ],
      },
      {
        title: "Отправка",
        lectures: [
          { title: "Индикатор и повтор", minutes: 16 },
          { title: "Домашнее задание: схема заказа", minutes: 22 },
        ],
      },
    ],
    reviews: [
      {
        name: "Лена",
        rating: 5,
        date: "2026-09-14",
        text: "Редко бывает, чтобы новый курс сразу был таким собранным. Домашка про блюр — в точку.",
      },
    ],
  },
];
