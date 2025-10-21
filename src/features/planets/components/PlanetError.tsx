import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PlanetError() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-md rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
          <svg
            className="h-6 w-6 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-destructive">
          Erro ao carregar planeta
        </h2>
        <p className="mb-6 text-muted-foreground">
          Não foi possível carregar os detalhes do planeta. Por favor, tente
          novamente.
        </p>
        <Link href="/items">
          <Button variant="outline" className="w-full">
            Voltar para lista
          </Button>
        </Link>
      </div>
    </div>
  );
}
