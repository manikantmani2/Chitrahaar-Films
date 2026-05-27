import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

// API Methods
export const apiMethods = {
  // Contact form submission
  submitContact: async (data: {
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
  }) => {
    return apiClient.post('/contact', data);
  },

  // Booking request
  submitBooking: async (data: {
    clientName: string;
    email: string;
    phone: string;
    serviceType: string;
    projectDetails: string;
    budget: string;
    timeline: string;
  }) => {
    return apiClient.post('/booking', data);
  },

  // Newsletter subscription
  subscribeNewsletter: async (email: string) => {
    return apiClient.post('/newsletter', { email });
  },

  // Get portfolio items
  getPortfolio: async () => {
    return apiClient.get('/portfolio');
  },

  // Get services
  getServices: async () => {
    return apiClient.get('/services');
  },

  // Get testimonials
  getTestimonials: async () => {
    return apiClient.get('/testimonials');
  },

  // Submit feedback
  submitFeedback: async (data: {
    name: string;
    email: string;
    rating: number;
    eventType: string;
    message: string;
  }) => {
    return apiClient.post('/feedback', data);
  },

  // Search
  search: async (query: string) => {
    return apiClient.get('/search', { params: { q: query } });
  },
};

export default apiClient;

