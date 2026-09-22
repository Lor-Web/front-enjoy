import { formatMinutes } from "@/shared/lib/reading-time";

type EstimatedTimeProps = {
  minutes: number;
  purpose?: "reading" | "solving";
};

export function EstimatedTime({
  minutes,
  purpose = "reading",
}: EstimatedTimeProps) {
  const suffix = purpose === "solving" ? "на решение" : "на чтение и усвоение";
  return (
    <p className="text-muted-foreground mb-3 text-sm">
      В среднем {formatMinutes(minutes)} {suffix}
    </p>
  );
}
