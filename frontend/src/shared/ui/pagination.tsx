import { Button } from "@/shared/ui/button";

type PaginationProps = {
  page: number;
  pages: number;
  onPage: (page: number) => void;
};

export function Pagination({ page, pages, onPage }: PaginationProps) {
  if (pages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Страницы"
      className="mt-8 flex items-center justify-center gap-2"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        Назад
      </Button>
      <p className="text-muted-foreground min-w-20 text-center text-sm">
        {page} из {pages}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
      >
        Вперёд
      </Button>
    </nav>
  );
}
