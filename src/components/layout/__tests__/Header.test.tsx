import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

describe('Header', () => {
  it('should render header', () => {
    render(<Header />);

    expect(screen.getByText('SWAPI Explorer')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /planets/i })).toBeInTheDocument();
  });

  it('should render correct href for each link', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: /planets/i })).toHaveAttribute(
      'href',
      '/planets'
    );
  });

  it('should render icons for each navigation item', () => {
    const { container } = render(<Header />);

    // Should have SVG icons
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should have sticky positioning', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky', 'top-0');
  });

  it('should have backdrop blur', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('backdrop-blur');
  });

  it('should be responsive', () => {
    render(<Header />);

    const appName = screen.getByText('SWAPI Explorer');
    expect(appName).toHaveClass('sm:inline-block');
  });
});
