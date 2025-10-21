import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from '../ErrorState';

describe('ErrorState', () => {
  it('should render with default props', () => {
    render(<ErrorState />);

    expect(screen.getByText('Error loading data')).toBeInTheDocument();
    expect(
      screen.getByText(
        'An error occurred while loading the data. Please try again.'
      )
    ).toBeInTheDocument();
  });

  it('should render custom title', () => {
    render(<ErrorState title="Custom Error Title" />);

    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
  });

  it('should render custom message', () => {
    render(<ErrorState message="Custom error message" />);

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    const retryButton = screen.getByRole('button', {
      name: /try again/i,
    });
    expect(retryButton).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorState />);

    const retryButton = screen.queryByRole('button', {
      name: /try again/i,
    });
    expect(retryButton).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<ErrorState onRetry={onRetry} />);

    const retryButton = screen.getByRole('button', {
      name: /try again/i,
    });
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should render error icon', () => {
    const { container } = render(<ErrorState />);

    // Look for SVG icon
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render with destructive border', () => {
    const { container } = render(<ErrorState />);

    const card = container.querySelector('.border-destructive');
    expect(card).toBeInTheDocument();
  });

  it('should render all props together', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ErrorState
        title="Network Error"
        message="Failed to fetch data from server"
        onRetry={onRetry}
      />
    );

    expect(screen.getByText('Network Error')).toBeInTheDocument();
    expect(
      screen.getByText('Failed to fetch data from server')
    ).toBeInTheDocument();

    const retryButton = screen.getByRole('button');
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalled();
  });

  it('should be accessible', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    const retryButton = screen.getByRole('button', {
      name: /try again/i,
    });
    expect(retryButton).toBeEnabled();
  });
});
