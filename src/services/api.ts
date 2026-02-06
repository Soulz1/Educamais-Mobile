import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://192.168.15.5:3333';
const SESSION_KEY = '@educamais_session';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const sessionData = await SecureStore.getItemAsync(SESSION_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        config.headers.Authorization = `Bearer ${session.sessionToken}`;
      }
    } catch (error) {
      console.error('Erro ao adicionar token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear session
      try {
        await SecureStore.deleteItemAsync(SESSION_KEY);
        console.log('🔒 Session cleared due to 401');
        
        // Optionally trigger a logout event here
        // You could use an event emitter or navigation to redirect to login
      } catch (e) {
        console.error('Error clearing session:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
