import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlanetMetadata } from '../PlanetMetadata';

// Mock formatDate function
vi.mock('@/lib/utils', () => ({
  formatDate: (date: string) => new Date(date).toLocaleDateString('en-US'),
}));

describe('PlanetMetadata', () => {
  it('should render created date', () => {
    render(
      <PlanetMetadata
        created="2014-12-09T13:50:49.641000Z"
        edited="2014-12-20T20:58:18.411000Z"
      />
    );

    expect(screen.getByText(/Created:/i)).toBeInTheDocument();
  });

  it('should render edited date', () => {
    render(
      <PlanetMetadata
        created="2014-12-09T13:50:49.641000Z"
        edited="2014-12-20T20:58:18.411000Z"
      />
    );

    expect(screen.getByText(/Updated:/i)).toBeInTheDocument();
  });
});
