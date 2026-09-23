import type { ReactNode } from "react";
import {
  TASK_LEVELS,
  TASK_TECHS,
  type TaskFilters,
  type TaskLevelId,
  type TaskTechId,
} from "@/entities/task";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";

type TaskFiltersFormProps = {
  filters: TaskFilters;
  onChange: (next: TaskFilters) => void;
  idPrefix: string;
};

export function TaskFiltersForm({
  filters,
  onChange,
  idPrefix,
}: TaskFiltersFormProps) {
  return (
    <div className="space-y-6">
      <FilterBlock title="Технология">
        <Choice
          name={`${idPrefix}-tech`}
          value={filters.tech || "all"}
          options={[
            { value: "all", label: "Все" },
            ...TASK_TECHS.map((item) => ({
              value: item.id,
              label: item.title,
            })),
          ]}
          onChange={(value) =>
            onChange({
              ...filters,
              tech: value === "all" ? "" : (value as TaskTechId),
            })
          }
        />
      </FilterBlock>
      <FilterBlock title="Уровень">
        <Choice
          name={`${idPrefix}-level`}
          value={filters.level || "all"}
          options={[
            { value: "all", label: "Все" },
            ...TASK_LEVELS.map((item) => ({
              value: item.id,
              label: item.title,
            })),
          ]}
          onChange={(value) =>
            onChange({
              ...filters,
              level: value === "all" ? "" : (value as TaskLevelId),
            })
          }
        />
      </FilterBlock>
      <FilterBlock title="Прогресс">
        <Choice
          name={`${idPrefix}-status`}
          value={filters.status || "all"}
          options={[
            { value: "all", label: "Все" },
            { value: "open", label: "Не выполнены" },
            { value: "done", label: "Выполнены" },
          ]}
          onChange={(value) =>
            onChange({
              ...filters,
              status: value === "all" ? "" : (value as TaskFilters["status"]),
            })
          }
        />
      </FilterBlock>
    </div>
  );
}

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
