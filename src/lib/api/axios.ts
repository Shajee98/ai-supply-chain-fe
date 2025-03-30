import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add custom headers here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await api.post('/auth/refresh')
        return api(originalRequest)
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message
    throw new Error(message)
  }
  throw error
}

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  inventory: {
    list: '/inventory',
    item: (id: string) => `/inventory/${id}`,
    create: '/inventory',
    update: (id: string) => `/inventory/${id}`,
    delete: (id: string) => `/inventory/${id}`,
  },
  orders: {
    list: '/orders',
    item: (id: string) => `/orders/${id}`,
    create: '/orders',
    update: (id: string) => `/orders/${id}`,
    delete: (id: string) => `/orders/${id}`,
  },
  suppliers: {
    list: '/suppliers',
    item: (id: string) => `/suppliers/${id}`,
    create: '/suppliers',
    update: (id: string) => `/suppliers/${id}`,
    delete: (id: string) => `/suppliers/${id}`,
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    forecast: '/analytics/forecast',
    reports: '/analytics/reports',
  },
  tracking: {
    shipments: '/tracking/shipments',
    shipment: (id: string) => `/tracking/shipments/${id}`,
  },
} as const 