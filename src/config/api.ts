// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_REACT_APP_API_URL || 'https://api.virtuallibrary.com',
  TIMEOUT: 10000, // 10 secondes
  RETRY_ATTEMPTS: 3,
};

// Configuration des endpoints
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register/',
    LOGIN: '/api/auth/login/',
    LOGOUT: '/api/auth/logout/',
    VERIFY: '/api/auth/verify/',
    REFRESH: '/api/auth/refresh/',
  },
  BOOKS: {
    LOOKUP: '/api/books/lookup',
  },
  LIBRARY: {
    LIST: '/api/library/',
    ADD: '/api/library/add/',
    REMOVE: '/api/library/remove/',
    UPDATE_STATUS: '/api/library/update-status/',
  },
  USER: {
    STATS: '/api/user/stats/',
    UPDATE: '/api/user/update/',
  },
};