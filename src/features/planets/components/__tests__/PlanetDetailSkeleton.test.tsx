import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PlanetDetailSkeleton } from '../PlanetDetailSkeleton';

describe('PlanetDetailSkeleton', () => {
  it('should render loading skeleton', () => {
    const { container } = render(<PlanetDetailSkeleton />);

    // Check for skeleton elements
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render in a container with correct classes', () => {
    const { container } = render(<PlanetDetailSkeleton />);

    const mainContainer = container.querySelector('.container');
    expect(mainContainer).toBeInTheDocument();
  });
});
