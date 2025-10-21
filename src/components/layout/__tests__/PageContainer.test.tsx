import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PageContainer } from '../PageContainer';

describe('PageContainer', () => {
  it('should render children', () => {
    const { getByText } = render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );

    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply default max-width', () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('max-w-screen-xl');
  });

  it('should apply custom max-width', () => {
    const { container } = render(
      <PageContainer maxWidth="sm">
        <div>Content</div>
      </PageContainer>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('max-w-screen-sm');
  });

  it('should apply all max-width options', () => {
    const maxWidths: Array<'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'> = [
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      'full',
    ];

    maxWidths.forEach((maxWidth) => {
      const { container } = render(
        <PageContainer maxWidth={maxWidth}>
          <div>Content</div>
        </PageContainer>
      );

      const wrapper = container.firstChild;
      const expectedClass =
        maxWidth === 'full' ? 'max-w-full' : `max-w-screen-${maxWidth}`;
      expect(wrapper).toHaveClass(expectedClass);
    });
  });

  it('should apply custom className', () => {
    const { container } = render(
      <PageContainer className="custom-class">
        <div>Content</div>
      </PageContainer>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should have responsive padding', () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
  });

  it('should have vertical padding', () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('py-8');
  });

  it('should be centered', () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('mx-auto');
  });

  it('should have full width', () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('w-full');
  });

  it('should combine custom className with default classes', () => {
    const { container } = render(
      <PageContainer className="bg-red-500" maxWidth="md">
        <div>Content</div>
      </PageContainer>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('bg-red-500');
    expect(wrapper).toHaveClass('max-w-screen-md');
    expect(wrapper).toHaveClass('mx-auto');
  });
});
