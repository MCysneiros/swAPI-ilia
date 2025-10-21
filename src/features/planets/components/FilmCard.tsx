import { Badge } from '@/components/ui/badge';
import type { Film } from '@/types';

interface FilmCardProps {
  film: Film;
}

export function FilmCard({ film }: FilmCardProps) {
  return (
    <div
      className="group rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
      data-testid="film-card"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3
          className="line-clamp-2 font-semibold leading-tight"
          title={film.title}
        >
          {film.title}
        </h3>
        <Badge variant="secondary" className="shrink-0">
          EP {film.episode_id}
        </Badge>
      </div>
      <div className="space-y-1">
        <p
          className="truncate text-sm text-muted-foreground"
          title={film.director}
        >
          <span className="font-medium">Diretor:</span> {film.director}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Lançamento:</span>{' '}
          {new Date(film.release_date).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
}
