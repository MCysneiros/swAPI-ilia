import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlanetError } from '../PlanetError';

describe('PlanetError', () => {
  it('should render error message', () => {
    render(<PlanetError />);

    expect(screen.getByText('Error loading planet')).toBeInTheDocument();
  });

  it('should render error description', () => {
    render(<PlanetError />);

    expect(
      screen.getByText(/Could not load planet details/i)
    ).toBeInTheDocument();
  });

  it('should render back to list button', () => {
    render(<PlanetError />);

    const backButton = screen.getByRole('link', { name: /back to list/i });
    expect(backButton).toHaveAttribute('href', '/planets');
  });

  it('should render error icon', () => {
    const { container } = render(<PlanetError />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
