import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlanetListCard } from '../PlanetListCard';
import type { Planet } from '@/types';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const mockPlanet: Planet = {
  name: 'Tatooine',
  rotation_period: '23',
  orbital_period: '304',
  diameter: '10465',
  climate: 'arid',
  gravity: '1 standard',
  terrain: 'desert',
  surface_water: '1',
  population: '200000',
  residents: [
    'https://swapi.dev/api/people/1/',
    'https://swapi.dev/api/people/2/',
  ],
  films: [
    'https://swapi.dev/api/films/1/',
    'https://swapi.dev/api/films/3/',
    'https://swapi.dev/api/films/4/',
  ],
  created: '2014-12-09T13:50:49.641000Z',
  edited: '2014-12-20T20:58:18.411000Z',
  url: 'https://swapi.dev/api/planets/1/',
};

vi.mock('../../hooks/useFilms', () => ({
  useFilms: vi.fn((filmUrls: string[]) => ({
    data: filmUrls.map((url, idx) => ({
      title: `Film ${idx + 1}`,
      episode_id: idx + 1,
      director: 'Director Name',
      release_date: '1977-05-25',
      url,
    })),
    isLoading: false,
  })),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('PlanetListCard', () => {
  it('should render the planet name', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    expect(screen.getByText('Tatooine')).toBeInTheDocument();
  });

  it('should render terrain and climate', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    expect(screen.getByText(/desert/)).toBeInTheDocument();
    expect(screen.getByText(/arid/)).toBeInTheDocument();
  });

  it('should render the population', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    expect(screen.getByText('Population:')).toBeInTheDocument();
    expect(screen.getByText('200,000')).toBeInTheDocument();
  });

  it('should render population as Unknown when it is unknown', () => {
    const planetWithUnknownPopulation = {
      ...mockPlanet,
      population: 'unknown',
    };

    render(
      <PlanetListCard planet={planetWithUnknownPopulation} planetId="1" />,
      { wrapper }
    );

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('should render the diameter', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    expect(screen.getByText('Diameter:')).toBeInTheDocument();
    expect(screen.getByText('10465 km')).toBeInTheDocument();
  });

  it('should render the number of residents', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    expect(screen.getByText('Residents:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render the films section', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    expect(screen.getByText('Films:')).toBeInTheDocument();
  });

  it('should render films when they are loaded', async () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Film 1')).toBeInTheDocument();
      expect(screen.getByText('Film 2')).toBeInTheDocument();
      expect(screen.getByText('Film 3')).toBeInTheDocument();
    });
  });

  it('should show "No films" when there are none', async () => {
    const planetWithoutFilms = {
      ...mockPlanet,
      films: [],
    };

    render(<PlanetListCard planet={planetWithoutFilms} planetId="1" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText('No films')).toBeInTheDocument();
    });
  });

  it('should have a link to the details page', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/1');
  });

  it('should render the film icon', () => {
    const { container } = render(
      <PlanetListCard planet={mockPlanet} planetId="1" />,
      { wrapper }
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should apply transition classes on the card', () => {
    const { container } = render(
      <PlanetListCard planet={mockPlanet} planetId="1" />,
      { wrapper }
    );

    const card = container.querySelector('[class*="transition"]');
    expect(card).toBeInTheDocument();
  });
});
