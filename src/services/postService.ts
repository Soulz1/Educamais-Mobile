import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.15.5:3333';

interface Post {
  id: number;
  titulo: string;
  conteudo: string;
  autorId: string;
  createdAt: string;
  atualizacao: string;
  autor?: {
    name: string;
    email: string;
    appRole?: string;
  };
}

interface PostsResponse {
  success: boolean;
  data: Post[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class PostService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api`,
      withCredentials: true,
    });

    // Interceptor para incluir o token em todas as requisições
    this.api.interceptors.request.use(async (config) => {
      try {
        const sessionData = await AsyncStorage.getItem('@educamais_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          config.headers.Authorization = `Bearer ${session.sessionToken}`;
          console.log('🔐 Token adicionado ao header');
        }
      } catch (error) {
        console.error('Erro ao adicionar token:', error);
      }
      return config;
    });
  }

  /**
   * Buscar todos os posts com paginação
   */
  async getAllPosts(page: number = 1, limit: number = 10): Promise<Post[]> {
    try {
      const response = await this.api.get<PostsResponse>('/posts', {
        params: { page, limit },
      });

      console.log(`📝 Posts fetched: ${response.data.data.length} posts`);
      return response.data.data;
    } catch (error) {
      console.error('❌ Erro ao buscar posts:', error);
      throw error;
    }
  }

  /**
   * Buscar um post específico pelo ID
   */
  async getPostById(postId: number): Promise<Post> {
    try {
      const response = await this.api.get(`/posts/${postId}`);
      // backend returns { success, data: Post }
      return response.data.data;
    } catch (error) {
      console.error('❌ Erro ao buscar post:', error);
      throw error;
    }
  }

  /**
   * Buscar posts por termo de busca
   */
  async searchPosts(searchTerm: string): Promise<Post[]> {
    try {
      const response = await this.api.get<Post[]>('/posts/search', {
        params: { q: searchTerm },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar posts:', error);
      throw error;
    }
  }

  /**
   * Criar um novo post
   */
  async createPost(titulo: string, conteudo: string): Promise<Post> {
    try {
      const response = await this.api.post<Post>('/posts', {
        titulo,
        conteudo,
      });

      console.log('✅ Post criado com sucesso');
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar post:', error);
      throw error;
    }
  }

  /**
   * Atualizar um post existente
   */
  async updatePost(
    postId: number,
    titulo: string,
    conteudo: string
  ): Promise<Post> {
    try {
      const response = await this.api.put<Post>(`/posts/${postId}`, {
        titulo,
        conteudo,
      });

      console.log('✅ Post atualizado com sucesso');
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar post:', error);
      throw error;
    }
  }

  /**
   * Deletar um post
   */
  async deletePost(postId: number): Promise<void> {
    try {
      await this.api.delete(`/posts/${postId}`);
      console.log('✅ Post deletado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao deletar post:', error);
      throw error;
    }
  }
}

export const postService = new PostService();
