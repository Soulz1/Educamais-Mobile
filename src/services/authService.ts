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
   * Fazer cadastro (Sign Up) com email e senha
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

      // Save session to SecureStore
      await storageService.saveSession(sessionData);
      // Salvar sessão no SecureStore
      await SecureStore.setItemAsync(this.sessionKey, JSON.stringify(sessionData));
      console.log('✅ Session saved to SecureStore (SignUp)'); // DEBUG

      // Atualizar header padrão com token
      this.setAuthToken(sessionData.sessionToken);

      return sessionData;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * Fazer sign in com email e senha
   */
  async signIn(credentials: AuthCredentials): Promise<UserSession> {
    try {
      const response = await this.authApi.post<AuthResponse>('/auth/sign-in/email', credentials);

      console.log('SignIn Response:', JSON.stringify(response.data, null, 2));

      const sessionData: UserSession = {
        user: response.data.user,
        sessionToken: response.data.token,
      };

      // Save session to SecureStore
      await storageService.saveSession(sessionData);
      // Salvar sessão no SecureStore
      await SecureStore.setItemAsync(this.sessionKey, JSON.stringify(sessionData));
      console.log('✅ Session saved to SecureStore (SignIn)'); // DEBUG

      // Atualizar header padrão com token
      this.setAuthToken(sessionData.sessionToken);

      return sessionData;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * Fazer logout
   */
  async logout(): Promise<void> {
    try {
      await this.authApi.post('/auth/sign-out');
    } catch (error) {
      console.error('Error during API logout:', error);
    } finally {
      // Always clear local session
      await storageService.clearSession();
      await this.api.post('/sign-out');
      await SecureStore.deleteItemAsync(this.sessionKey);
      this.setAuthToken(null);
    } catch {
      // Mesmo se falhar na API, limpar local
      await SecureStore.deleteItemAsync(this.sessionKey);
      this.setAuthToken(null);
    }
  }

  /**
   * Verificar se há sessão salva
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
   * Check if user has a specific role
   */
  hasRole(session: UserSession | null, role: string): boolean {
    return session?.user?.appRole === role;
  }

  /**
   * Check if user is a teacher
   */
  isTeacher(session: UserSession | null): boolean {
    return this.hasRole(session, 'teacher');
  }

  /**
   * Check if user is a student
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
