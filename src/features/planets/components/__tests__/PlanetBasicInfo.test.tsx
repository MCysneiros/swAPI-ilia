import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlanetBasicInfo } from '../PlanetBasicInfo';

describe('PlanetBasicInfo', () => {
  const mockProps = {
    rotation_period: '23',
    orbital_period: '304',
    diameter: '10465',
    population: '200000',
  };

  it('should render all basic information fields', () => {
    render(<PlanetBasicInfo {...mockProps} />);

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('23 hours')).toBeInTheDocument();
    expect(screen.getByText('304 days')).toBeInTheDocument();
    expect(screen.getByText('10465 km')).toBeInTheDocument();
  });

  it('should format population with locale', () => {
    render(<PlanetBasicInfo {...mockProps} />);

    expect(screen.getByText('200,000')).toBeInTheDocument();
  });

  it('should handle unknown population', () => {
    render(<PlanetBasicInfo {...mockProps} population="unknown" />);

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('should display all field labels', () => {
    render(<PlanetBasicInfo {...mockProps} />);

    expect(screen.getByText('Rotation Period')).toBeInTheDocument();
    expect(screen.getByText('Orbital Period')).toBeInTheDocument();
    expect(screen.getByText('Diameter')).toBeInTheDocument();
    expect(screen.getByText('Population')).toBeInTheDocument();
  });
});
