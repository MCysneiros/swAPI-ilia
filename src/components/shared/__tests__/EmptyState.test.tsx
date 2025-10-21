import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('should render with default props', () => {
    render(<EmptyState />);

    expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
    expect(
      screen.getByText('Não há dados para exibir no momento.')
    ).toBeInTheDocument();
  });

  it('should render custom title', () => {
    render(<EmptyState title="Custom Empty Title" />);

    expect(screen.getByText('Custom Empty Title')).toBeInTheDocument();
  });

  it('should render custom message', () => {
    render(<EmptyState message="Custom empty message" />);

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('should render empty icon', () => {
    const { container } = render(<EmptyState />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should not render action button by default', () => {
    render(<EmptyState />);

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  describe('with actionHref', () => {
    it('should render link button with actionHref', () => {
      render(<EmptyState actionLabel="Go Home" actionHref="/home" />);

      const link = screen.getByRole('link', { name: 'Go Home' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/home');
    });

    it('should not render button if actionLabel is missing', () => {
      render(<EmptyState actionHref="/home" />);

      const link = screen.queryByRole('link');
      expect(link).not.toBeInTheDocument();
    });
  });

  describe('with onAction', () => {
    it('should render button with onAction', () => {
      const onAction = vi.fn();

      render(<EmptyState actionLabel="Try Again" onAction={onAction} />);

      const button = screen.getByRole('button', { name: 'Try Again' });
      expect(button).toBeInTheDocument();
    });

    it('should call onAction when button is clicked', async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();

      render(<EmptyState actionLabel="Click Me" onAction={onAction} />);

      const button = screen.getByRole('button', { name: 'Click Me' });
      await user.click(button);

      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('should not render button if actionLabel is missing', () => {
      const onAction = vi.fn();
      render(<EmptyState onAction={onAction} />);

      const button = screen.queryByRole('button');
      expect(button).not.toBeInTheDocument();
    });
  });

  describe('priority', () => {
    it('should prefer actionHref over onAction when both are provided', () => {
      const onAction = vi.fn();

      render(
        <EmptyState
          actionLabel="Action"
          actionHref="/home"
          onAction={onAction}
        />
      );

      // Should render link, not button
      expect(screen.getByRole('link')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  it('should render complete example', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <EmptyState
        title="No Items Found"
        message="Try adjusting your filters"
        actionLabel="Clear Filters"
        onAction={onAction}
      />
    );

    expect(screen.getByText('No Items Found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'Clear Filters' });
    await user.click(button);

    expect(onAction).toHaveBeenCalled();
  });

  it('should be accessible', () => {
    const onAction = vi.fn();
    render(<EmptyState actionLabel="Action" onAction={onAction} />);

    const button = screen.getByRole('button');
    expect(button).toBeEnabled();
  });
});
