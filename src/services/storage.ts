import * as SecureStore from 'expo-secure-store';
import { UserSession } from '../types/models';

const SESSION_KEY = '@educamais_session';

class StorageService {
  /**
   * Salva a sessão do usuário de forma segura
   */
  async saveSession(session: UserSession): Promise<void> {
    try {
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
      console.log('✅ Sessão salva no SecureStore');
    } catch (error) {
      console.error('❌ Erro ao salvar sessão no SecureStore:', error);
      throw error;
    }
  }

  /**
   * Obtém a sessão do usuário salva
   */
  async getSession(): Promise<UserSession | null> {
    try {
      const sessionData = await SecureStore.getItemAsync(SESSION_KEY);
      if (sessionData) {
        return JSON.parse(sessionData) as UserSession;
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao obter sessão do SecureStore:', error);
      return null;
    }
  }

  /**
   * Remove a sessão do usuário
   */
  async clearSession(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(SESSION_KEY);
      console.log('✅ Sessão removida do SecureStore');
    } catch (error) {
      console.error('❌ Erro ao limpar sessão do SecureStore:', error);
      throw error;
    }
  }

  /**
   * Verifica se existe uma sessão salva
   */
  async hasSession(): Promise<boolean> {
    try {
      const session = await this.getSession();
      return session !== null;
    } catch {
      return false;
    }
  }
}

export const storageService = new StorageService();
