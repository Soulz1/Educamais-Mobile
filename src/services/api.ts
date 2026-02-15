import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { ApiError } from '../types/models';

// Obtém a URL da API do ambiente
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
    // Interceptor de requisição: Adiciona o token a todas as requisições
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const sessionData = await SecureStore.getItemAsync(SESSION_KEY);
          if (sessionData) {
            const session = JSON.parse(sessionData);
            config.headers.Authorization = `Bearer ${session.sessionToken}`;
          }
        } catch (error) {
          console.error('Erro ao obter token do SecureStore:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de resposta: Trata erros 401 (deslogar usuário)
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Limpa a sessão em caso de 401
          try {
            await SecureStore.deleteItemAsync(SESSION_KEY);
          } catch (e) {
            console.error('Erro ao limpar sessão:', e);
          }
          // Você pode emitir um evento ou usar navegação aqui para redirecionar ao login
          // Por enquanto, apenas rejeitamos o erro
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Servidor respondeu com erro
      const data = error.response.data as any;
      return {
        message: data?.message || 'Erro no servidor',
        statusCode: error.response.status,
        errors: data?.errors,
      };
    } else if (error.request) {
      // Requisição feita mas sem resposta
      return {
        message: 'Sem resposta do servidor. Verifique sua conexão.',
      };
    } else {
      // Algo mais aconteceu
      return {
        message: error.message || 'Erro desconhecido',
      };
    }
  }

  // Função auxiliar para definir o token manualmente
  public setAuthToken(token: string | null) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Função auxiliar para obter a URL base da API
  public getBaseURL() {
    return API_URL;
  }
}

export const apiService = new ApiService();
export const api = apiService.api;
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://192.168.15.5:3333';
const SESSION_KEY = '@educamais_session';

// Cria instância do axios
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição - Adiciona token de autenticação
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

// Interceptor de resposta - Trata erros 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - limpa a sessão
      try {
        await SecureStore.deleteItemAsync(SESSION_KEY);
        console.log('🔒 Sessão limpa devido ao erro 401');
        
        // Opcionalmente, dispara um evento de logout aqui
        // Você pode usar um emissor de eventos ou navegação para redirecionar ao login
      } catch (e) {
        console.error('Erro ao limpar sessão:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
