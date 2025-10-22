import { apiClient } from '@/lib/api';
import { API_CONFIG } from '@/constants';
import type {
  ApiResponse,
  Planet,
  Film,
  Resident,
  PlanetsQueryParams,
} from '@/types';

export const planetsApi = {
  getAll: async (params?: PlanetsQueryParams): Promise<ApiResponse<Planet>> => {
    const { data } = await apiClient.get<ApiResponse<Planet>>('/planets/', {
      params,
    });
    return data;
  },

  getById: async (id: string): Promise<Planet> => {
    const { data } = await apiClient.get<Planet>(`/planets/${id}/`);
    return data;
  },

  getFilmByUrl: async (url: string): Promise<Film> => {
    const { data } = await apiClient.get<Film>(url);
    return data;
  },

  getResidentByUrl: async (url: string): Promise<Resident> => {
    const { data } = await apiClient.get<Resident>(url);
    return data;
  },
};

type ApiError = Error & { status?: number };

export const planetsServerApi = {
  getById: async (id: string): Promise<Planet> => {
    const res = await fetch(`${API_CONFIG.baseURL}/planets/${id}/`, {
      next: { revalidate: API_CONFIG.revalidate },
    });

    if (res.status === 404) {
      const error: ApiError = new Error('Planet not found');
      error.status = 404;
      throw error;
    }

    if (!res.ok) {
      throw new Error('Failed to fetch planet');
    }

    return res.json();
  },

  getAll: async (params?: PlanetsQueryParams): Promise<ApiResponse<Planet>> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const url = `${API_CONFIG.baseURL}/planets/${queryParams.toString() ? `?${queryParams}` : ''}`;

    const res = await fetch(url, {
      next: { revalidate: API_CONFIG.revalidate },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch planets');
    }

    return res.json();
  },
};

export const getPlanet = planetsServerApi.getById;
export const getPlanets = (page: number = 1, search?: string) =>
  planetsServerApi.getAll({ page, search });
