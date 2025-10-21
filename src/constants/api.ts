import { env } from '@/lib/env';

export const API_CONFIG = {
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  revalidate: 300, // 5 minutes (for Next.js fetch)
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

export const API_ENDPOINTS = {
  people: '/people',
  planets: '/planets',
  films: '/films',
  species: '/species',
  vehicles: '/vehicles',
  starships: '/starships',
} as const;

export const PAGINATION = {
  defaultPage: 1,
  defaultPageSize: 10,
  maxPageSize: 100,
} as const;

export const CACHE_CONFIG = {
  staleTime: 60 * 1000, // 60 segundos
  gcTime: 5 * 60 * 1000, // 5 minutos
  refetchOnWindowFocus: false,
  retry: 1,
} as const;
