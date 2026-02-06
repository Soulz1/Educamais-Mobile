import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { ApiError } from '../types/models';

// Get API URL from environment
const API_URL = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || 'http://192.168.15.5:3333';

const SESSION_KEY = '@educamais_session';

class ApiService {
  public api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor: Add token to all requests
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const sessionData = await SecureStore.getItemAsync(SESSION_KEY);
          if (sessionData) {
            const session = JSON.parse(sessionData);
            config.headers.Authorization = `Bearer ${session.sessionToken}`;
          }
        } catch (error) {
          console.error('Error getting token from SecureStore:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Handle 401 errors (logout user)
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear session on 401
          try {
            await SecureStore.deleteItemAsync(SESSION_KEY);
          } catch (e) {
            console.error('Error clearing session:', e);
          }
          // You can emit an event or use navigation here to redirect to login
          // For now, we'll just reject the error
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error
      const data = error.response.data as any;
      return {
        message: data?.message || 'Erro no servidor',
        statusCode: error.response.status,
        errors: data?.errors,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Sem resposta do servidor. Verifique sua conexão.',
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Erro desconhecido',
      };
    }
  }

  // Helper to set token manually
  public setAuthToken(token: string | null) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Helper to get API base URL
  public getBaseURL() {
    return API_URL;
  }
}

export const apiService = new ApiService();
export const api = apiService.api;
