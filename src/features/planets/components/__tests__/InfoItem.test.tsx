import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InfoItem } from '../InfoItem';

describe('InfoItem', () => {
  it('should render label and value', () => {
    render(<InfoItem label="Test Label" value="Test Value" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('should apply capitalize class when specified', () => {
    render(<InfoItem label="Label" value="value" capitalize={true} />);

    const valueElement = screen.getByText('value');
    expect(valueElement.className).toContain('capitalize');
  });

  it('should not apply capitalize class by default', () => {
    render(<InfoItem label="Label" value="value" />);

    const valueElement = screen.getByText('value');
    expect(valueElement.className).not.toContain('capitalize');
  });
});
