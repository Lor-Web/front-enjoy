import type { ReactNode } from "react";
import {
  COURSE_TECHS,
  type CourseFilters,
  type CoursePublisher,
  type CourseSort,
  type CourseTechId,
} from "@/entities/course";
import { GRADE_OPTIONS, type Grade } from "@/entities/user";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";

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
    </div>
  );
}

export const SORT_OPTIONS: Array<{ value: CourseSort; label: string }> = [
  { value: "title", label: "По названию" },
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
    <RadioGroup value={value} onValueChange={onChange} className="gap-1.5">
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        return (
          <label
            key={option.value}
            htmlFor={id}
            className="hover:bg-accent/50 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm leading-5"
          >
            <RadioGroupItem id={id} value={option.value} />
            {option.label}
          </label>
        );
      })}
    </RadioGroup>
  );
}
