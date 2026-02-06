import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://192.168.15.5:3333';

interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    appRole?: string;
  };
  token: string;
}

interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
    appRole?: string;
  };
  sessionToken: string;
}

class AuthService {
  private api: AxiosInstance;
  private sessionKey = '@educamais_session';

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api/auth`,
      withCredentials: true,
    });
  }

  /**
   * Fazer cadastro (Sign Up) com email e senha
   */
  async signUp(credentials: AuthCredentials): Promise<UserSession> {
    try {
      const response = await this.api.post<AuthResponse>('/sign-up/email', {
        email: credentials.email,
        password: credentials.password,
        name: credentials.email.split('@')[0],
      });

      console.log('SignUp Response:', JSON.stringify(response.data, null, 2)); // DEBUG

      const sessionData: UserSession = {
        user: response.data.user,
        sessionToken: response.data.token,
      };

      // Salvar sessão no SecureStore
      await SecureStore.setItemAsync(this.sessionKey, JSON.stringify(sessionData));
      console.log('✅ Session saved to SecureStore (SignUp)'); // DEBUG

      // Atualizar header padrão com token
      this.setAuthToken(sessionData.sessionToken);

      return sessionData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Fazer sign in com email e senha
   */
  async signIn(credentials: AuthCredentials): Promise<UserSession> {
    try {
      const response = await this.api.post<AuthResponse>('/sign-in/email', credentials);

      console.log('SignIn Response:', JSON.stringify(response.data, null, 2)); // DEBUG

      const sessionData: UserSession = {
        user: response.data.user,
        sessionToken: response.data.token,
      };

      // Salvar sessão no SecureStore
      await SecureStore.setItemAsync(this.sessionKey, JSON.stringify(sessionData));
      console.log('✅ Session saved to SecureStore (SignIn)'); // DEBUG

      // Atualizar header padrão com token
      this.setAuthToken(sessionData.sessionToken);

      return sessionData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Fazer logout
   */
  async logout(): Promise<void> {
    try {
      await this.api.post('/sign-out');
      await SecureStore.deleteItemAsync(this.sessionKey);
      this.setAuthToken(null);
    } catch (error) {
      // Mesmo se falhar na API, limpar local
      await SecureStore.deleteItemAsync(this.sessionKey);
      this.setAuthToken(null);
    }
  }

  /**
   * Verificar se há sessão salva
   */
  async getSession(): Promise<UserSession | null> {
    try {
      const sessionData = await SecureStore.getItemAsync(this.sessionKey);
      console.log('Session from SecureStore:', sessionData); // DEBUG
      if (sessionData) {
        const session = JSON.parse(sessionData) as UserSession;
        this.setAuthToken(session.sessionToken);
        return session;
      }
      return null;
    } catch (error) {
      console.error('Erro ao recuperar sessão:', error);
      return null;
    }
  }

  /**
   * Atualizar token no header
   */
  private setAuthToken(token: string | null): void {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Obter instância do axios configurada
   */
  getApiInstance(): AxiosInstance {
    return this.api;
  }

  /**
   * Tratar erros de forma legível
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(message);
    }
    return error;
  }
}

export const authService = new AuthService();
