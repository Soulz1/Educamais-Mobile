import * as SecureStore from 'expo-secure-store';
import { UserSession } from '../types/models';

const SESSION_KEY = '@educamais_session';

class StorageService {
  /**
   * Save user session securely
   */
  async saveSession(session: UserSession): Promise<void> {
    try {
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
      console.log('✅ Session saved to SecureStore');
    } catch (error) {
      console.error('❌ Error saving session to SecureStore:', error);
      throw error;
    }
  }

  /**
   * Get saved user session
   */
  async getSession(): Promise<UserSession | null> {
    try {
      const sessionData = await SecureStore.getItemAsync(SESSION_KEY);
      if (sessionData) {
        return JSON.parse(sessionData) as UserSession;
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting session from SecureStore:', error);
      return null;
    }
  }

  /**
   * Remove user session
   */
  async clearSession(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(SESSION_KEY);
      console.log('✅ Session cleared from SecureStore');
    } catch (error) {
      console.error('❌ Error clearing session from SecureStore:', error);
      throw error;
    }
  }

  /**
   * Check if a session exists
   */
  async hasSession(): Promise<boolean> {
    try {
      const session = await this.getSession();
      return session !== null;
    } catch (error) {
      return false;
    }
  }
}

export const storageService = new StorageService();
