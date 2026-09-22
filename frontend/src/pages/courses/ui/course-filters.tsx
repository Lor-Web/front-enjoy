import type { ReactNode } from "react";
import {
  COURSE_TECHS,
  type CourseFilters,
  type CoursePriceFilter,
  type CoursePublisher,
  type CourseRatingFilter,
  type CourseSort,
  type CourseTechId,
} from "@/entities/course";
import { GRADE_OPTIONS, type Grade } from "@/entities/user";

type CourseFiltersFormProps = {
  filters: CourseFilters;
  onChange: (next: CourseFilters) => void;
  idPrefix: string;
};

export function CourseFiltersForm({
  filters,
  onChange,
  idPrefix,
}: CourseFiltersFormProps) {
  return (
    <div className="space-y-6">
      <FilterBlock title="Грейд">
        <Choice
          name={`${idPrefix}-grade`}
          value={filters.grade || "all"}
          options={[
            { value: "all", label: "Все" },
            ...GRADE_OPTIONS.map((item) => ({
              value: item.value,
              label: item.label,
            })),
          ]}
          onChange={(value) =>
            onChange({
              ...filters,
              grade: value === "all" ? "" : (value as Grade),
            })
          }
        />
      </FilterBlock>
      <FilterBlock title="Технология">
        <Choice
          name={`${idPrefix}-tech`}
          value={filters.tech || "all"}
          options={[
            { value: "all", label: "Все" },
            ...COURSE_TECHS.map((item) => ({
              value: item.id,
              label: item.title,
            })),
          ]}
          onChange={(value) =>
            onChange({
              ...filters,
              tech: value === "all" ? "" : (value as CourseTechId),
            })
          }
        />
      </FilterBlock>
      <FilterBlock title="Автор">
        <Choice
          name={`${idPrefix}-publisher`}
          value={filters.publisher || "all"}
          options={[
            { value: "all", label: "Все" },
            { value: "platform", label: "Front Enjoy" },
            { value: "author", label: "Авторы" },
          ]}
          onChange={(value) =>
            onChange({
              ...filters,
              publisher: value === "all" ? "" : (value as CoursePublisher),
            })
          }
        />
      </FilterBlock>
      <FilterBlock title="Цена">
        <Choice
          name={`${idPrefix}-price`}
          value={filters.price || "all"}
          options={[
            { value: "all", label: "Любая" },
            { value: "free", label: "Бесплатно" },
            { value: "paid", label: "Платные" },
          ]}
          onChange={(value) =>
            onChange({
              ...filters,
              price: value === "all" ? "" : (value as CoursePriceFilter),
            })
          }
        />
      </FilterBlock>
      <FilterBlock title="Рейтинг">
        <Choice
          name={`${idPrefix}-rating`}
          value={filters.rating || "all"}
          options={[
            { value: "all", label: "Любой" },
            { value: "4.5", label: "От 4,5" },
            { value: "4", label: "От 4,0" },
            { value: "3.5", label: "От 3,5" },
          ]}
          onChange={(value) =>
            onChange({
              ...filters,
              rating: value === "all" ? "" : (value as CourseRatingFilter),
            })
          }
        />
      </FilterBlock>
    </div>
  );
}

export const SORT_OPTIONS: Array<{ value: CourseSort; label: string }> = [
  { value: "popular", label: "По популярности" },
  { value: "rating", label: "По рейтингу" },
  { value: "new", label: "Сначала новые" },
  { value: "price-asc", label: "Сначала дешёвые" },
  { value: "price-desc", label: "Сначала дорогие" },
];

function FilterBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{title}</legend>
      {children}
    </fieldset>
  );
}

function Choice({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        return (
          <label
            key={option.value}
            htmlFor={id}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="accent-primary size-3.5"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
