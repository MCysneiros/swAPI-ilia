import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlanetError } from '../PlanetError';

describe('PlanetError', () => {
  it('should render error message', () => {
    render(<PlanetError />);

    expect(screen.getByText('Erro ao carregar planeta')).toBeInTheDocument();
  });

  it('should render error description', () => {
    render(<PlanetError />);

    expect(
      screen.getByText(/Não foi possível carregar os detalhes do planeta/i)
    ).toBeInTheDocument();
  });

  it('should render back to list button', () => {
    render(<PlanetError />);

    const backButton = screen.getByRole('link', { name: /voltar para lista/i });
    expect(backButton).toHaveAttribute('href', '/items');
  });

  it('should render error icon', () => {
    const { container } = render(<PlanetError />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
