export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  currentPage: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  timeout?: number;
}

export interface ListQueryParams {
  page?: number;
  search?: string;
  limit?: number;
  offset?: number;
}
