import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MainLayout } from '../MainLayout';

// Mock the Header and Footer components
vi.mock('../Header', () => ({
  Header: () => <header data-testid="mock-header">Header</header>,
}));

vi.mock('../Footer', () => ({
  Footer: () => <footer data-testid="mock-footer">Footer</footer>,
}));

describe('MainLayout', () => {
  it('should render children', () => {
    const { getByText } = render(
      <MainLayout>
        <div>Page Content</div>
      </MainLayout>
    );

    expect(getByText('Page Content')).toBeInTheDocument();
  });

  it('should render Header component', () => {
    const { getByTestId } = render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    expect(getByTestId('mock-header')).toBeInTheDocument();
  });

  it('should render Footer component', () => {
    const { getByTestId } = render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    expect(getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('should render children inside main tag', () => {
    const { container } = render(
      <MainLayout>
        <div data-testid="content">Content</div>
      </MainLayout>
    );

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toContainHTML('<div data-testid="content">Content</div>');
  });

  it('should have proper layout structure', () => {
    const { container } = render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('relative', 'flex', 'min-h-screen', 'flex-col');
  });

  it('should have flex-1 on main content', () => {
    const { container } = render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const main = container.querySelector('main');
    expect(main).toHaveClass('flex-1');
  });

  it('should render components in correct order', () => {
    const { container } = render(
      <MainLayout>
        <div data-testid="content">Content</div>
      </MainLayout>
    );

    const elements = Array.from(container.firstChild!.childNodes);
    expect(elements[0].nodeName).toBe('HEADER');
    expect(elements[1].nodeName).toBe('MAIN');
    expect(elements[2].nodeName).toBe('FOOTER');
  });

  it('should handle multiple children', () => {
    const { getByText } = render(
      <MainLayout>
        <div>First Child</div>
        <div>Second Child</div>
        <div>Third Child</div>
      </MainLayout>
    );

    expect(getByText('First Child')).toBeInTheDocument();
    expect(getByText('Second Child')).toBeInTheDocument();
    expect(getByText('Third Child')).toBeInTheDocument();
  });

  it('should handle complex children', () => {
    const { getByText, getByRole } = render(
      <MainLayout>
        <section>
          <h1>Title</h1>
          <button>Click me</button>
        </section>
      </MainLayout>
    );

    expect(getByText('Title')).toBeInTheDocument();
    expect(getByRole('button')).toBeInTheDocument();
  });
});
