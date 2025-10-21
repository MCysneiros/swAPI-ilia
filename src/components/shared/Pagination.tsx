import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  className?: string;
}
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage = currentPage < totalPages,
  hasPreviousPage = currentPage > 1,
  className,
}: PaginationProps) {
  const goToFirstPage = () => onPageChange(1);
  const goToPreviousPage = () => onPageChange(currentPage - 1);
  const goToNextPage = () => onPageChange(currentPage + 1);
  const goToLastPage = () => onPageChange(totalPages);

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={goToFirstPage}
        disabled={!hasPreviousPage}
        aria-label="Primeira página"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousPage}
        disabled={!hasPreviousPage}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 px-4">
        <span className="text-sm font-medium">
          Página {currentPage} de {totalPages}
        </span>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={goToNextPage}
        disabled={!hasNextPage}
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={goToLastPage}
        disabled={!hasNextPage}
        aria-label="Última página"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
