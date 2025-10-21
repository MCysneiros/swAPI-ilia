import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlanetResidents } from '../PlanetResidents';

// Mock the useResidents hook
vi.mock('../../hooks/useResidents', () => ({
  useResidents: vi.fn(),
}));

import { useResidents } from '../../hooks/useResidents';

describe('PlanetResidents', () => {
  it('should render empty state when no residents', () => {
    vi.mocked(useResidents).mockReturnValue({
      data: [],
      isLoading: false,
    } as never);

    render(<PlanetResidents residents={[]} />);

    expect(screen.getByText('Nativos')).toBeInTheDocument();
    expect(
      screen.getByText('Este planeta não possui nativos conhecidos.')
    ).toBeInTheDocument();
  });

  it('should show loading state', () => {
    vi.mocked(useResidents).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as never);

    const { container } = render(<PlanetResidents residents={['url1']} />);

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render residents count when data is loaded', () => {
    vi.mocked(useResidents).mockReturnValue({
      data: [
        {
          name: 'Luke Skywalker',
          hair_color: 'blond',
          eye_color: 'blue',
          gender: 'male',
          species: [],
          vehicles: [],
        },
      ],
      isLoading: false,
    } as never);

    render(<PlanetResidents residents={['url1']} />);

    expect(screen.getByText('Nativos (1)')).toBeInTheDocument();
  });
});
