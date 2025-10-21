import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render pagination controls', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByLabelText('First page')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
      expect(screen.getByLabelText('Last page')).toBeInTheDocument();
    });

    it('should display current page info', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      expect(screen.getByText('Page 5 of 10')).toBeInTheDocument();
    });

    it('should render all buttons', () => {
      render(<Pagination {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4); // first, prev, next, last
    });
  });

  describe('first page behavior', () => {
    it('should disable first and previous buttons on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      const firstButton = screen.getByLabelText('First page');
      const prevButton = screen.getByLabelText('Previous page');

      expect(firstButton).toBeDisabled();
      expect(prevButton).toBeDisabled();
    });

    it('should enable next and last buttons on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      const nextButton = screen.getByLabelText('Next page');
      const lastButton = screen.getByLabelText('Last page');

      expect(nextButton).toBeEnabled();
      expect(lastButton).toBeEnabled();
    });
  });

  describe('last page behavior', () => {
    it('should disable next and last buttons on last page', () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={10} />);

      const nextButton = screen.getByLabelText('Next page');
      const lastButton = screen.getByLabelText('Last page');

      expect(nextButton).toBeDisabled();
      expect(lastButton).toBeDisabled();
    });

    it('should enable first and previous buttons on last page', () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={10} />);

      const firstButton = screen.getByLabelText('First page');
      const prevButton = screen.getByLabelText('Previous page');

      expect(firstButton).toBeEnabled();
      expect(prevButton).toBeEnabled();
    });
  });

  describe('middle page behavior', () => {
    it('should enable all buttons on middle page', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeEnabled();
      });
    });
  });

  describe('button interactions', () => {
    it('should call onPageChange with 1 when first button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <Pagination
          {...defaultProps}
          currentPage={5}
          onPageChange={onPageChange}
        />
      );

      const firstButton = screen.getByLabelText('First page');
      await user.click(firstButton);

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('should call onPageChange with previous page when prev button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <Pagination
          {...defaultProps}
          currentPage={5}
          onPageChange={onPageChange}
        />
      );

      const prevButton = screen.getByLabelText('Previous page');
      await user.click(prevButton);

      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('should call onPageChange with next page when next button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <Pagination
          {...defaultProps}
          currentPage={5}
          onPageChange={onPageChange}
        />
      );

      const nextButton = screen.getByLabelText('Next page');
      await user.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it('should call onPageChange with totalPages when last button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <Pagination
          {...defaultProps}
          currentPage={5}
          onPageChange={onPageChange}
        />
      );

      const lastButton = screen.getByLabelText('Last page');
      await user.click(lastButton);

      expect(onPageChange).toHaveBeenCalledWith(10);
    });

    it('should not call onPageChange when disabled button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <Pagination
          {...defaultProps}
          currentPage={1}
          onPageChange={onPageChange}
        />
      );

      const firstButton = screen.getByLabelText('First page');
      await user.click(firstButton);

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('custom hasNextPage and hasPreviousPage', () => {
    it('should respect custom hasNextPage prop', () => {
      render(
        <Pagination {...defaultProps} currentPage={5} hasNextPage={false} />
      );

      const nextButton = screen.getByLabelText('Next page');
      const lastButton = screen.getByLabelText('Last page');

      expect(nextButton).toBeDisabled();
      expect(lastButton).toBeDisabled();
    });

    it('should respect custom hasPreviousPage prop', () => {
      render(
        <Pagination {...defaultProps} currentPage={5} hasPreviousPage={false} />
      );

      const firstButton = screen.getByLabelText('First page');
      const prevButton = screen.getByLabelText('Previous page');

      expect(firstButton).toBeDisabled();
      expect(prevButton).toBeDisabled();
    });
  });

  describe('edge cases', () => {
    it('should handle single page', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={1} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('should handle large page numbers', () => {
      render(
        <Pagination {...defaultProps} currentPage={999} totalPages={1000} />
      );

      expect(screen.getByText('Page 999 of 1000')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Pagination {...defaultProps} className="custom-class" />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should have proper layout classes', () => {
      const { container } = render(<Pagination {...defaultProps} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
    });
  });

  describe('accessibility', () => {
    it('should have proper aria-labels', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByLabelText('First page')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
      expect(screen.getByLabelText('Last page')).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <Pagination
          {...defaultProps}
          currentPage={5}
          onPageChange={onPageChange}
        />
      );

      const nextButton = screen.getByLabelText('Next page');
      nextButton.focus();

      await user.keyboard('{Enter}');

      expect(onPageChange).toHaveBeenCalledWith(6);
    });
  });
});
