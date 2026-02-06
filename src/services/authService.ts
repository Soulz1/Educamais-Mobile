import { api } from './api';
import { storageService } from './storage';
import { AuthResponse, UserSession, ApiError } from '../types/models';

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
    }
  }

  /**
   * Verificar se há sessão salva
   */
  async getSession(): Promise<UserSession | null> {
    return await storageService.getSession();
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
  }
}

export const authService = new AuthService();
