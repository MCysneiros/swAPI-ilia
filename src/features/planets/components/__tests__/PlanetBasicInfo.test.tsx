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

    expect(screen.getByText('Informações Básicas')).toBeInTheDocument();
    expect(screen.getByText('23 horas')).toBeInTheDocument();
    expect(screen.getByText('304 dias')).toBeInTheDocument();
    expect(screen.getByText('10465 km')).toBeInTheDocument();
  });

  it('should format population with locale', () => {
    render(<PlanetBasicInfo {...mockProps} />);

    expect(screen.getByText('200.000')).toBeInTheDocument();
  });

  it('should handle unknown population', () => {
    render(<PlanetBasicInfo {...mockProps} population="unknown" />);

    expect(screen.getByText('Desconhecida')).toBeInTheDocument();
  });

  it('should display all field labels', () => {
    render(<PlanetBasicInfo {...mockProps} />);

    expect(screen.getByText('Período de Rotação')).toBeInTheDocument();
    expect(screen.getByText('Período Orbital')).toBeInTheDocument();
    expect(screen.getByText('Diâmetro')).toBeInTheDocument();
    expect(screen.getByText('População')).toBeInTheDocument();
  });
});
