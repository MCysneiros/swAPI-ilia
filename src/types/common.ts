import { ReactNode } from 'react';

export interface WithChildren {
  children: ReactNode;
}

export interface WithClassName {
  className?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type SortDirection = 'asc' | 'desc';

export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith';

export interface Filter<T = string> {
  field: string;
  operator: FilterOperator;
  value: T;
}

export interface Sort {
  field: string;
  direction: SortDirection;
}

export interface RouteParams<
  T extends Record<string, string> = Record<string, string>,
> {
  params: T;
}

export interface SearchParams {
  searchParams?: Record<string, string | string[] | undefined>;
}
