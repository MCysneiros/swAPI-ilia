import axios from 'axios';
import { API_CONFIG } from '@/constants';

/**
 * Cliente API centralizado usando Axios
 * Compartilhado por todas as features
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

/**
 * Request interceptor
 * Adiciona tokens, logging, etc
 */
apiClient.interceptors.request.use(
  (config) => {
    // Aqui você pode adicionar tokens de autenticação
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Trata erros globais, refresh de tokens, etc
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Trata erros específicos
    if (error.response?.status === 401) {
      // Redirecionar para login ou refresh token
      console.error('Unauthorized');
    }

    if (error.response?.status === 403) {
      console.error('Forbidden');
    }

    if (error.response?.status === 404) {
      console.error('Not found');
    }

    if (error.response?.status >= 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);
