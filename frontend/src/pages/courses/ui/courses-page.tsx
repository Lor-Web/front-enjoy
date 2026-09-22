import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  COURSE_TECHS,
  CourseCard,
  type CourseFilters,
  type CoursePriceFilter,
  type CoursePublisher,
  type CourseRatingFilter,
  type CourseSort,
  type CourseTechId,
  filterCourses,
  formatCourses,
  useCourses,
} from "@/entities/course";
import { GRADE_OPTIONS, type Grade } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { AppShell } from "@/widgets/app-shell";
import { CourseFiltersForm, SORT_OPTIONS } from "./course-filters";

const SORTS = new Set<CourseSort>(SORT_OPTIONS.map((item) => item.value));
const PRICES = new Set<CoursePriceFilter>(["free", "paid"]);
const PUBLISHERS = new Set<CoursePublisher>(["platform", "author"]);
const RATINGS = new Set<CourseRatingFilter>(["3.5", "4", "4.5"]);
const TECHS = new Set<CourseTechId>(COURSE_TECHS.map((item) => item.id));
const GRADES = new Set<Grade>(GRADE_OPTIONS.map((item) => item.value));

function readFilters(params: URLSearchParams): CourseFilters {
  const grade = params.get("grade") ?? "";
  const tech = params.get("tech") ?? "";
  const publisher = params.get("by") ?? "";
  const price = params.get("price") ?? "";
  const rating = params.get("rating") ?? "";
  const sort = params.get("sort") ?? "popular";
  return {
    q: params.get("q") ?? "",
    grade: GRADES.has(grade as Grade) ? (grade as Grade) : "",
    tech: TECHS.has(tech as CourseTechId) ? (tech as CourseTechId) : "",
    publisher: PUBLISHERS.has(publisher as CoursePublisher)
      ? (publisher as CoursePublisher)
      : "",
    price: PRICES.has(price as CoursePriceFilter)
      ? (price as CoursePriceFilter)
      : "",
    rating: RATINGS.has(rating as CourseRatingFilter)
      ? (rating as CourseRatingFilter)
      : "",
    sort: SORTS.has(sort as CourseSort) ? (sort as CourseSort) : "popular",
  };
}

function writeFilters(
  setParams: ReturnType<typeof useSearchParams>[1],
  filters: CourseFilters,
) {
  setParams(
    (current) => {
      const next = new URLSearchParams(current);
      setOrDelete(next, "q", filters.q);
      setOrDelete(next, "grade", filters.grade);
      setOrDelete(next, "tech", filters.tech);
      setOrDelete(next, "by", filters.publisher);
      setOrDelete(next, "price", filters.price);
      setOrDelete(next, "rating", filters.rating);
      if (filters.sort === "popular") {
        next.delete("sort");
      } else {
        next.set("sort", filters.sort);
      }
      return next;
    },
    { replace: true },
  );
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

export function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readFilters(searchParams);
  const { q, grade, tech, publisher, price, rating, sort } = filters;
  const [qInput, setQInput] = useState(q);
  const { data: courses = [], isPending } = useCourses();

  useEffect(() => {
    setQInput(q);
  }, [q]);

  useEffect(() => {
    const next = qInput.trim();
    if (next === q) {
      return;
    }
    const timer = window.setTimeout(() => {
      writeFilters(setSearchParams, {
        q: next,
        grade,
        tech,
        publisher,
        price,
        rating,
        sort,
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [qInput, q, grade, tech, publisher, price, rating, sort, setSearchParams]);

  const visible = filterCourses(courses, filters);
  const hasExtraFilters = Boolean(
    filters.grade ||
      filters.tech ||
      filters.publisher ||
      filters.price ||
      filters.rating,
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-3xl sm:text-4xl">Курсы</h1>
        <p className="text-muted-foreground mb-6 text-[17px] leading-7">
          Практические текстовые программы с домашними заданиями. Документация
          остаётся справочником — курсы ведут от задачи к задаче.
        </p>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <Input
              icon={Search}
              value={qInput}
              onChange={(event) => setQInput(event.target.value)}
              placeholder="Название курса или преподаватель"
              aria-label="Поиск курсов по имени"
            />
          </div>
          <Select
            value={filters.sort}
            onValueChange={(value) => {
              writeFilters(setSearchParams, {
                ...filters,
                sort: value as CourseSort,
              });
            }}
          >
            <SelectTrigger
              className="sm:w-52"
              size="sm"
              aria-label="Сортировка"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Filter />
                Фильтры
                {hasExtraFilters ? (
                  <span className="bg-primary size-1.5 rounded-full" />
                ) : null}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto p-4">
              <SheetHeader>
                <SheetTitle>Фильтры</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <CourseFiltersForm
                  idPrefix="mobile"
                  filters={filters}
                  onChange={(next) => writeFilters(setSearchParams, next)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-10">
          <aside className="hidden w-52 shrink-0 lg:block">
            <CourseFiltersForm
              idPrefix="desktop"
              filters={filters}
              onChange={(next) => writeFilters(setSearchParams, next)}
            />
          </aside>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground mb-3 text-sm">
              {isPending ? "Загрузка…" : formatCourses(visible.length)}
            </p>
            {isPending ? null : visible.length === 0 ? (
              <p className="text-muted-foreground border-y py-10 text-sm">
                Нет курсов по этим фильтрам. Сбросьте грейд, автора или рейтинг.
              </p>
            ) : (
              <ul className="divide-y border-y">
                {visible.map((course) => (
                  <li key={course.slug}>
                    <CourseCard course={course} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
