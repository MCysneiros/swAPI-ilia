import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('should render footer', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should display SWAPI credit', () => {
    render(<Footer />);

    const swapiLink = screen.getByRole('link', { name: /swapi/i });
    expect(swapiLink).toBeInTheDocument();
    expect(swapiLink).toHaveAttribute('href', 'https://swapi.dev');
    expect(swapiLink).toHaveAttribute('target', '_blank');
  });

  it('should display current year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(currentYear.toString()))
    ).toBeInTheDocument();
  });

  it('should display heart icon', () => {
    const { container } = render(<Footer />);

    const heartIcon = container.querySelector('.fill-red-500');
    expect(heartIcon).toBeInTheDocument();
  });

  it('should have GitHub link', () => {
    render(<Footer />);

    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('should have proper layout classes', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('border-t', 'bg-background');
  });

  it('should be responsive', () => {
    const { container } = render(<Footer />);

    const contentDiv = container.querySelector('.container');
    expect(contentDiv).toHaveClass('md:flex-row');
  });

  it('should have external links with rel attribute', () => {
    render(<Footer />);

    const externalLinks = screen.getAllByRole('link', {
      name: /github|swapi/i,
    });
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute('rel', 'noreferrer');
    });
  });
});
