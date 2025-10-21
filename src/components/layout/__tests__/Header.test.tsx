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

    // Now we only have the logo link
    const logoLink = screen.getByRole('link', { name: /swapi explorer/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should render correct href for each link', () => {
    render(<Header />);

    // Logo link should point to home
    const logoLink = screen.getByRole('link', { name: /swapi explorer/i });
    expect(logoLink).toHaveAttribute('href', '/');
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
