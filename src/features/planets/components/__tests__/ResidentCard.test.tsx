import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResidentCard } from '../ResidentCard';
import type { ResidentDetails } from '../../hooks/useResidents';

describe('ResidentCard', () => {
  const mockResident: ResidentDetails = {
    name: 'Luke Skywalker',
    hair_color: 'blond',
    eye_color: 'blue',
    gender: 'male',
    species: [{ name: 'Human' }],
    vehicles: [
      { name: 'Snowspeeder', model: 't-47 airspeeder' },
      { name: 'Imperial Speeder Bike', model: '74-Z speeder bike' },
    ],
  };

  it('should render resident name', () => {
    render(<ResidentCard resident={mockResident} />);

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
  });

  it('should render resident physical characteristics', () => {
    render(<ResidentCard resident={mockResident} />);

    expect(screen.getByText('blond')).toBeInTheDocument();
    expect(screen.getByText('blue')).toBeInTheDocument();
  });

  it('should translate gender to Portuguese', () => {
    render(<ResidentCard resident={mockResident} />);

    expect(screen.getByText('Masculino')).toBeInTheDocument();
  });

  it('should render species information', () => {
    render(<ResidentCard resident={mockResident} />);

    expect(screen.getByText('Human')).toBeInTheDocument();
  });

  it('should render vehicle information', () => {
    render(<ResidentCard resident={mockResident} />);

    expect(screen.getByText('Snowspeeder')).toBeInTheDocument();
    expect(screen.getByText('t-47 airspeeder')).toBeInTheDocument();
  });

  it('should not render species section when empty', () => {
    const residentWithoutSpecies = { ...mockResident, species: [] };
    render(<ResidentCard resident={residentWithoutSpecies} />);

    expect(screen.queryByText('Espécie(s):')).not.toBeInTheDocument();
  });

  it('should not render vehicles section when empty', () => {
    const residentWithoutVehicles = { ...mockResident, vehicles: [] };
    render(<ResidentCard resident={residentWithoutVehicles} />);

    expect(screen.queryByText('Veículo(s):')).not.toBeInTheDocument();
  });

  it('should handle female gender', () => {
    const femaleResident = { ...mockResident, gender: 'female' };
    render(<ResidentCard resident={femaleResident} />);

    expect(screen.getByText('Feminino')).toBeInTheDocument();
  });
});
