import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlanetHeader } from '../PlanetHeader';

describe('PlanetHeader', () => {
  it('should render planet name', () => {
    const onDelete = vi.fn();
    render(
      <PlanetHeader name="Tatooine" onDelete={onDelete} isDeleting={false} />
    );

    expect(screen.getByText('Tatooine')).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(
      <PlanetHeader name="Tatooine" onDelete={onDelete} isDeleting={false} />
    );

    const deleteButton = screen.getByRole('button', { name: /deletar/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('should disable delete button when deleting', () => {
    const onDelete = vi.fn();
    render(
      <PlanetHeader name="Tatooine" onDelete={onDelete} isDeleting={true} />
    );

    const deleteButton = screen.getByRole('button', { name: /deletando/i });
    expect(deleteButton).toBeDisabled();
  });

  it('should render back button with correct link', () => {
    const onDelete = vi.fn();
    render(
      <PlanetHeader name="Tatooine" onDelete={onDelete} isDeleting={false} />
    );

    const backButton = screen.getByRole('link', { name: /voltar/i });
    expect(backButton).toHaveAttribute('href', '/items');
  });
});
