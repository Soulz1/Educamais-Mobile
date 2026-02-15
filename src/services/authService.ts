import { api } from './api';
import { storageService } from './storage';
import { AuthResponse, UserSession, ApiError } from '../types/models';
import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://192.168.15.5:3333';

interface AuthCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends AuthCredentials {
  name?: string;
}

class AuthService {
  private authApi = api;

  /**
   * Faz cadastro (Sign Up) com email e senha
   */
  async signUp(credentials: SignUpCredentials): Promise<UserSession> {
    try {
      const response = await this.authApi.post<AuthResponse>('/auth/sign-up/email', {
        email: credentials.email,
        password: credentials.password,
        name: credentials.name || credentials.email.split('@')[0],
      });

      console.log('SignUp Response:', JSON.stringify(response.data, null, 2));

      const sessionData: UserSession = {
        user: response.data.user,
        sessionToken: response.data.token,
      };

      // Salva a sessão no SecureStore
      await storageService.saveSession(sessionData);
      // Salva a sessão no SecureStore
      await SecureStore.setItemAsync(this.sessionKey, JSON.stringify(sessionData));
      console.log('✅ Sessão salva no SecureStore (SignUp)'); // DEBUG

      // Atualiza o header padrão com o token
      this.setAuthToken(sessionData.sessionToken);

      return sessionData;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * Faz login (Sign In) com email e senha
   */
  async signIn(credentials: AuthCredentials): Promise<UserSession> {
    try {
      const response = await this.authApi.post<AuthResponse>('/auth/sign-in/email', credentials);

      console.log('SignIn Response:', JSON.stringify(response.data, null, 2));

      const sessionData: UserSession = {
        user: response.data.user,
        sessionToken: response.data.token,
      };

      // Salva a sessão no SecureStore
      await storageService.saveSession(sessionData);
      // Salva a sessão no SecureStore
      await SecureStore.setItemAsync(this.sessionKey, JSON.stringify(sessionData));
      console.log('✅ Sessão salva no SecureStore (SignIn)'); // DEBUG

      // Atualiza o header padrão com o token
      this.setAuthToken(sessionData.sessionToken);

      return sessionData;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await this.authApi.post('/auth/sign-out');
    } catch (error) {
      console.error('Erro durante logout na API:', error);
    } finally {
      // Sempre limpa a sessão local
      await storageService.clearSession();
      await this.api.post('/sign-out');
      await SecureStore.deleteItemAsync(this.sessionKey);
      this.setAuthToken(null);
    } catch {
      // Mesmo se falhar na API, limpa localmente
      await SecureStore.deleteItemAsync(this.sessionKey);
      this.setAuthToken(null);
    }
  }

  /**
   * Verifica se há uma sessão salva
   */
  async getSession(): Promise<UserSession | null> {
    return await storageService.getSession();
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
   * Verifica se o usuário tem uma função específica
   */
  hasRole(session: UserSession | null, role: string): boolean {
    return session?.user?.appRole === role;
  }

  /**
   * Verifica se o usuário é professor
   */
  isTeacher(session: UserSession | null): boolean {
    return this.hasRole(session, 'teacher');
  }

  /**
   * Verifica se o usuário é aluno
   */
  isStudent(session: UserSession | null): boolean {
    return this.hasRole(session, 'student');
  private handleError(error: any): Error {
    // eslint-disable-next-line import/no-named-as-default-member
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(message);
    }
    return error;
  }
}

export const authService = new AuthService();
