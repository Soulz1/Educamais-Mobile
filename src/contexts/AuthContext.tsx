import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { UserRole } from '../types/models';

interface User {
  id: string;
  email: string;
  name: string;
  appRole?: string;
  role?: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica a sessão quando o app inicia
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const session = await authService.getSession();
      console.log('🔍 Resultado CheckSession:', session); // DEBUG
      if (session) {
        console.log('✅ Usuário restaurado da sessão:', session.user.email);
        setUser(session.user);
      } else {
        console.log('❌ Nenhuma sessão encontrada');
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const session = await authService.signIn({ email, password });
      setUser(session.user);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const session = await authService.signUp({ email, password });
      setUser(session.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Verifica se o usuário é professor
  const isTeacher = user?.appRole?.toLowerCase() === 'teacher' || user?.role === UserRole.TEACHER;
  
  // Verifica se o usuário é aluno
  const isStudent = user?.appRole?.toLowerCase() === 'student' || user?.role === UserRole.STUDENT;

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    isTeacher,
    isStudent,
    signIn,
    signUp,
    logout,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
