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

    expect(screen.getByText('Characteristics')).toBeInTheDocument();
    expect(screen.getByText('arid')).toBeInTheDocument();
    expect(screen.getByText('1 standard')).toBeInTheDocument();
    expect(screen.getByText('desert')).toBeInTheDocument();
    expect(screen.getByText('1%')).toBeInTheDocument();
  });

  it('should handle unknown surface water', () => {
    render(<PlanetCharacteristics {...mockProps} surface_water="unknown" />);

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('should display all field labels', () => {
    render(<PlanetCharacteristics {...mockProps} />);

    expect(screen.getByText('Climate')).toBeInTheDocument();
    expect(screen.getByText('Gravity')).toBeInTheDocument();
    expect(screen.getByText('Terrain')).toBeInTheDocument();
    expect(screen.getByText('Surface Water')).toBeInTheDocument();
  });

  it('should apply capitalize class to climate and terrain', () => {
    render(<PlanetCharacteristics {...mockProps} />);

    const climateText = screen.getByText('arid');
    const terrainText = screen.getByText('desert');

    expect(climateText.className).toContain('capitalize');
    expect(terrainText.className).toContain('capitalize');
  });
});
