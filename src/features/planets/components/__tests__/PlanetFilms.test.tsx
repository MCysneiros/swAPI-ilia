import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlanetFilms } from '../PlanetFilms';

// Mock the useFilms hook
vi.mock('../../hooks/useFilms', () => ({
  useFilms: vi.fn(),
}));

import { useFilms } from '../../hooks/useFilms';

describe('PlanetFilms', () => {
  it('should render empty state when no films', () => {
    vi.mocked(useFilms).mockReturnValue({
      data: [],
      isLoading: false,
    } as never);

    render(<PlanetFilms films={[]} />);

    expect(screen.getByText('Filmes')).toBeInTheDocument();
    expect(
      screen.getByText('Este planeta não aparece em nenhum filme.')
    ).toBeInTheDocument();
  });

  it('should show loading state', () => {
    vi.mocked(useFilms).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as never);

    const { container } = render(<PlanetFilms films={['url1']} />);

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render films count when data is loaded', () => {
    vi.mocked(useFilms).mockReturnValue({
      data: [
        {
          title: 'A New Hope',
          episode_id: 4,
          director: 'George Lucas',
          release_date: '1977-05-25',
          opening_crawl: '...',
        },
      ],
      isLoading: false,
    } as never);

    render(<PlanetFilms films={['url1']} />);

    expect(screen.getByText('Filmes (1)')).toBeInTheDocument();
  });

  it('should sort films by episode ID', () => {
    vi.mocked(useFilms).mockReturnValue({
      data: [
        {
          title: 'Return of the Jedi',
          episode_id: 6,
          director: 'Richard Marquand',
          release_date: '1983-05-25',
          opening_crawl: '...',
        },
        {
          title: 'A New Hope',
          episode_id: 4,
          director: 'George Lucas',
          release_date: '1977-05-25',
          opening_crawl: '...',
        },
      ],
      isLoading: false,
    } as never);

    render(<PlanetFilms films={['url1', 'url2']} />);

    const films = screen.getAllByRole('heading', { level: 3 });
    expect(films[0]).toHaveTextContent('A New Hope');
    expect(films[1]).toHaveTextContent('Return of the Jedi');
  });
});
