import { formatMinutes } from "@/shared/lib/reading-time";

type EstimatedTimeProps = {
  minutes: number;
};

export function EstimatedTime({ minutes }: EstimatedTimeProps) {
  return (
    <p className="text-muted-foreground mb-3 text-sm">
      В среднем {formatMinutes(minutes)} на чтение и усвоение
    </p>
  );
}
