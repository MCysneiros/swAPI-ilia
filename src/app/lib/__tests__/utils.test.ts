import { describe, it, expect } from 'vitest';
import { PAGINATION } from '@/constants';
import { getPage, getSearch } from '../utils';

type SearchParams = NonNullable<Parameters<typeof getPage>[0]>;

describe('app/lib/utils', () => {
  describe('getPage', () => {
    it('returns the default page when search params are undefined', () => {
      expect(getPage()).toBe(PAGINATION.defaultPage);
    });

    it('parses the page when provided as a string', () => {
      const params = { page: '3' } as SearchParams;
      expect(getPage(params)).toBe(3);
    });

    it('parses the page from the first entry of an array', () => {
      const params = { page: ['4', '5'] } as SearchParams;
      expect(getPage(params)).toBe(4);
    });

    it('falls back to the default page when value is not a positive number', () => {
      const params = { page: '0' } as SearchParams;
      const invalidParams = { page: 'not-a-number' } as SearchParams;

      expect(getPage(params)).toBe(PAGINATION.defaultPage);
      expect(getPage(invalidParams)).toBe(PAGINATION.defaultPage);
    });

    it('falls back to the default page when array first value is invalid', () => {
      const params = { page: ['invalid', '2'] } as SearchParams;
      expect(getPage(params)).toBe(PAGINATION.defaultPage);
    });
  });

  describe('getSearch', () => {
    it('returns the search value when provided as a string', () => {
      const params = { search: 'tatooine' } as SearchParams;
      expect(getSearch(params)).toBe('tatooine');
    });

    it('returns the first entry when search is provided as an array', () => {
      const params = { search: ['luke', 'leia'] } as SearchParams;
      expect(getSearch(params)).toBe('luke');
    });

    it('returns empty string when array first value is undefined or empty', () => {
      const params = {
        search: [undefined as unknown as string],
      } as SearchParams;
      const emptyParams = { search: [''] } as SearchParams;

      expect(getSearch(params)).toBe('');
      expect(getSearch(emptyParams)).toBe('');
    });

    it('returns empty string when search params are undefined', () => {
      expect(getSearch()).toBe('');
    });
  });
});
