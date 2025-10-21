import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PlanetHeaderProps {
  name: string;
  onDelete: () => void;
  isDeleting: boolean;
}

export function PlanetHeader({
  name,
  onDelete,
  isDeleting,
}: PlanetHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-3xl font-bold sm:text-4xl">{name}</h1>
      <div className="flex gap-2">
        <Link href="/items">
          <Button variant="outline" className="w-full sm:w-auto">
            Voltar
          </Button>
        </Link>
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={isDeleting}
          className="w-full sm:w-auto"
        >
          {isDeleting ? 'Deletando...' : 'Deletar'}
        </Button>
      </div>
    </div>
  );
}
