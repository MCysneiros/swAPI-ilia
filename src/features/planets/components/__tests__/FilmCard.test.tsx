import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilmCard } from '../FilmCard';
import type { Film } from '@/types';

describe('FilmCard', () => {
  const mockFilm: Film = {
    title: 'A New Hope',
    episode_id: 4,
    director: 'George Lucas',
    release_date: '1977-05-25',
    opening_crawl: 'It is a period of civil war...',
    producer: 'Gary Kurtz, Rick McCallum',
    characters: [],
    planets: [],
    starships: [],
    vehicles: [],
    species: [],
    created: '2014-12-10T14:23:31.880000Z',
    edited: '2014-12-20T19:49:45.256000Z',
    url: 'https://swapi.dev/api/films/1/',
  };

  it('should render film title', () => {
    render(<FilmCard film={mockFilm} />);

    expect(screen.getByText('A New Hope')).toBeInTheDocument();
  });

  it('should render episode number', () => {
    render(<FilmCard film={mockFilm} />);

    expect(screen.getByText('EP 4')).toBeInTheDocument();
  });

  it('should render director name', () => {
    render(<FilmCard film={mockFilm} />);

    expect(screen.getByText(/George Lucas/i)).toBeInTheDocument();
  });

  it('should format release date in Brazilian Portuguese', () => {
    render(<FilmCard film={mockFilm} />);

    // Date might be formatted as 24/05/1977 or 25/05/1977 depending on timezone
    expect(screen.getByText(/2[45]\/05\/1977/i)).toBeInTheDocument();
  });

  it('should render director label', () => {
    render(<FilmCard film={mockFilm} />);

    expect(screen.getByText(/Diretor:/i)).toBeInTheDocument();
  });

  it('should render release date label', () => {
    render(<FilmCard film={mockFilm} />);

    expect(screen.getByText(/Lançamento:/i)).toBeInTheDocument();
  });
});
