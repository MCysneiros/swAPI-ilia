import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Erro ao carregar dados',
  message = 'Ocorreu um erro ao carregar os dados. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="border-destructive">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-4 text-center text-sm text-muted-foreground">
          {message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Tentar Novamente
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
