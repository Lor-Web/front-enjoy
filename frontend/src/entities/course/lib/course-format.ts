import { COURSE_TECHS, type Course, type CourseFilters } from "../model/types";

export function filterCourses(courses: Course[], filters: CourseFilters) {
  const query = filters.q.trim().toLowerCase();
  const minRating = filters.rating ? Number(filters.rating) : 0;

  const filtered = courses.filter((course) => {
    if (query) {
      const haystack =
        `${course.title} ${course.subtitle} ${course.instructor.name}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    if (filters.grade && course.grade !== filters.grade) {
      return false;
    }
    if (filters.tech && course.tech !== filters.tech) {
      return false;
    }
    if (filters.publisher && course.publisher !== filters.publisher) {
      return false;
    }
    if (filters.price === "free" && course.priceRub !== 0) {
      return false;
    }
    if (filters.price === "paid" && course.priceRub === 0) {
      return false;
    }
    if (minRating && course.rating < minRating) {
      return false;
    }
    return true;
  });

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case "rating":
        return b.rating - a.rating;
      case "new":
        return b.updatedAt.localeCompare(a.updatedAt);
      case "price-asc":
        return a.priceRub - b.priceRub;
      case "price-desc":
        return b.priceRub - a.priceRub;
      default:
        return b.students - a.students;
    }
  });
}

export function lectureCount(course: Course) {
  return course.sections.reduce(
    (sum, section) => sum + section.lectures.length,
    0,
  );
}

export function sectionMinutes(lectures: { minutes: number }[]) {
  return lectures.reduce((sum, lecture) => sum + lecture.minutes, 0);
}

export function formatPrice(priceRub: number) {
  if (priceRub === 0) {
    return "Бесплатно";
  }
  return `${priceRub.toLocaleString("ru-RU")} ₽`;
}

export function formatHours(hours: number) {
  const rounded = Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
  return `${rounded} ч`;
}

export function formatStudents(count: number) {
  return `${count.toLocaleString("ru-RU")} ${plural(count, "ученик", "ученика", "учеников")}`;
}

export function formatReviews(count: number) {
  return plural(count, "оценка", "оценки", "оценок");
}

export function formatLectures(count: number) {
  return `${count} ${plural(count, "лекция", "лекции", "лекций")}`;
}

export function formatSections(count: number) {
  return `${count} ${plural(count, "раздел", "раздела", "разделов")}`;
}

export function formatCourses(count: number) {
  return `${count} ${plural(count, "курс", "курса", "курсов")}`;
}

export function courseTechTitle(id: Course["tech"]) {
  return COURSE_TECHS.find((item) => item.id === id)?.title ?? id;
}

function plural(count: number, one: string, few: string, many: string) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few;
  }
  return many;
}
