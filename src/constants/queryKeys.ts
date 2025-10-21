export const queryKeys = {
  items: {
    all: ['items'] as const,
    lists: () => [...queryKeys.items.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.items.lists(), filters] as const,
    details: () => [...queryKeys.items.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.items.details(), id] as const,
  },

  planets: {
    all: ['planets'] as const,
    lists: () => [...queryKeys.planets.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.planets.lists(), filters] as const,
    details: () => [...queryKeys.planets.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.planets.details(), id] as const,
  },

  films: {
    all: ['films'] as const,
    lists: () => [...queryKeys.films.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.films.lists(), filters] as const,
    details: () => [...queryKeys.films.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.films.details(), id] as const,
    byUrl: (url: string) => [...queryKeys.films.all, 'url', url] as const,
  },

  residents: {
    all: ['residents'] as const,
    byUrl: (url: string) => [...queryKeys.residents.all, 'url', url] as const,
  },
} as const;
