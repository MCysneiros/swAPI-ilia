import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlanetCharacteristics } from '../PlanetCharacteristics';

describe('PlanetCharacteristics', () => {
  const mockProps = {
    climate: 'arid',
    gravity: '1 standard',
    terrain: 'desert',
    surface_water: '1',
  };

  it('should render all characteristics fields', () => {
    render(<PlanetCharacteristics {...mockProps} />);

    expect(screen.getByText('Características')).toBeInTheDocument();
    expect(screen.getByText('arid')).toBeInTheDocument();
    expect(screen.getByText('1 standard')).toBeInTheDocument();
    expect(screen.getByText('desert')).toBeInTheDocument();
    expect(screen.getByText('1%')).toBeInTheDocument();
  });

  it('should handle unknown surface water', () => {
    render(<PlanetCharacteristics {...mockProps} surface_water="unknown" />);

    expect(screen.getByText('Desconhecida')).toBeInTheDocument();
  });

  it('should display all field labels', () => {
    render(<PlanetCharacteristics {...mockProps} />);

    expect(screen.getByText('Clima')).toBeInTheDocument();
    expect(screen.getByText('Gravidade')).toBeInTheDocument();
    expect(screen.getByText('Terreno')).toBeInTheDocument();
    expect(screen.getByText('Água Superficial')).toBeInTheDocument();
  });

  it('should apply capitalize class to climate and terrain', () => {
    render(<PlanetCharacteristics {...mockProps} />);

    const climateText = screen.getByText('arid');
    const terrainText = screen.getByText('desert');

    expect(climateText.className).toContain('capitalize');
    expect(terrainText.className).toContain('capitalize');
  });
});
