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

// Mock do hook useFilms
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
  it('deve renderizar o nome do planeta', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    expect(screen.getByText('Tatooine')).toBeInTheDocument();
  });

  it('deve renderizar terreno e clima', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    expect(screen.getByText(/desert/)).toBeInTheDocument();
    expect(screen.getByText(/arid/)).toBeInTheDocument();
  });

  it('deve renderizar população', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    expect(screen.getByText('Population:')).toBeInTheDocument();
    expect(screen.getByText('200,000')).toBeInTheDocument();
  });

  it('deve renderizar população como Unknown quando desconhecida', () => {
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

  it('deve renderizar diâmetro', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    expect(screen.getByText('Diameter:')).toBeInTheDocument();
    expect(screen.getByText('10465 km')).toBeInTheDocument();
  });

  it('deve renderizar número de residentes', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    expect(screen.getByText('Residents:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('deve renderizar seção de filmes', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    expect(screen.getByText('Films:')).toBeInTheDocument();
  });

  it('deve renderizar filmes quando carregados', async () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Film 1')).toBeInTheDocument();
      expect(screen.getByText('Film 2')).toBeInTheDocument();
      expect(screen.getByText('Film 3')).toBeInTheDocument();
    });
  });

  it('deve exibir "No films" quando não há filmes', async () => {
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

  it('deve ter link para a página de detalhes', () => {
    render(<PlanetListCard planet={mockPlanet} planetId="1" />, { wrapper });

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/planets/1');
  });

  it('deve renderizar ícone de filme', () => {
    const { container } = render(
      <PlanetListCard planet={mockPlanet} planetId="1" />,
      { wrapper }
    );

    // Procura pelo SVG do ícone Film (lucide-react)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('deve aplicar classes de transição no card', () => {
    const { container } = render(
      <PlanetListCard planet={mockPlanet} planetId="1" />,
      { wrapper }
    );

    const card = container.querySelector('[class*="transition"]');
    expect(card).toBeInTheDocument();
  });
});
