import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ListSkeleton } from '../ListSkeleton';

describe('ListSkeleton', () => {
  it('should render default number of skeleton cards', () => {
    const { container } = render(<ListSkeleton />);
    const skeletonCards = container.querySelectorAll('[data-testid], .border');

    // Should render 6 cards by default
    expect(skeletonCards.length).toBeGreaterThanOrEqual(6);
  });

  it('should render custom number of skeleton cards', () => {
    const { container } = render(<ListSkeleton count={3} />);
    const skeletonCards = container.querySelectorAll('[data-testid], .border');

    expect(skeletonCards.length).toBeGreaterThanOrEqual(3);
  });

  it('should render skeleton cards with correct layout', () => {
    const { container } = render(<ListSkeleton count={4} />);
    const grid = container.querySelector('.grid');

    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('gap-4');
  });

  it('should render responsive grid classes', () => {
    const { container } = render(<ListSkeleton />);
    const grid = container.querySelector('.grid');

    expect(grid).toHaveClass('md:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
  });

  it('should render skeleton elements inside cards', () => {
    const { container } = render(<ListSkeleton />);

    // Should have skeleton elements (Skeleton component uses a div with specific classes)
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
  it('should render with zero count', () => {
    const { container } = render(<ListSkeleton count={0} />);
    const grid = container.querySelector('.grid');

    expect(grid).toBeInTheDocument();
    expect(grid?.children.length).toBe(0);
  });

  it('should render with large count', () => {
    const { container } = render(<ListSkeleton count={20} />);
    const skeletonCards = container.querySelectorAll('[data-testid], .border');

    expect(skeletonCards.length).toBeGreaterThanOrEqual(20);
  });
});
