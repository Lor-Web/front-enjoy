import type { ReactNode } from "react";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  visibility?: ReactNode;
  children: ReactNode;
};

export function Field({
  id,
  label,
  required = false,
  error,
  hint,
  visibility,
  children,
}: FieldProps) {
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
          {required ? (
            <>
              <span className="text-destructive" aria-hidden>
                {" "}
                *
              </span>
              <span className="sr-only"> (обязательно)</span>
            </>
          ) : null}
        </label>
        {visibility}
      </div>
      {children}
      {error ? (
        <p id={messageId} className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-muted-foreground text-sm">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function fieldDescribedBy(id: string, error?: string, hint?: string) {
  if (error) {
    return `${id}-error`;
  }
  if (hint) {
    return `${id}-hint`;
  }
  return undefined;
}

export function fieldError(error?: { message?: string }) {
  return error?.message;
}
