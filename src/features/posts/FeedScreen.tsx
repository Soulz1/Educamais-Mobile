import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useInfinitePosts } from '../../../src/hooks/usePosts';
import { useDebounce } from '../../../src/hooks/useDebounce';
import PostSkeleton from '../../../src/components/common/PostSkeleton';
import EmptyState from '../../../src/components/common/EmptyState';
import ErrorState from '../../../src/components/common/ErrorState';
import type { Post } from '../../../src/types/models';

function FeedScreen() {
  const navigation = useNavigation();
  const { user, logout, isTeacher } = useAuth();
  const displayName = user?.name ? user.name.split(' ')[0] : 'Usuário';
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfinitePosts(debouncedSearchTerm);

  const posts = data?.pages.flatMap((page) => page) ?? [];

  const handleLogout = async () => {
    Alert.alert('Logout', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Sair',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleAdminPress = () => {
    if (!isTeacher) {
      Alert.alert(
        'Acesso negado',
        'Apenas professores podem acessar a área administrativa.'
      );
      return;
    }
    navigation.navigate('AdminPostsList' as any);
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('screens/PostDetail/index' as any, { postId: item.id })}
      activeOpacity={0.8}
      hitSlop={{ top: 12, left: 12, right: 12, bottom: 12 }}
      accessibilityRole="button"
    >
      <View style={styles.postHeader}>
        <Text style={styles.postTitle}>{item.titulo}</Text>
        <Text style={styles.postAuthor}>
          por {item.autor?.name || 'Desconhecido'}
        </Text>
      </View>
      <Text style={styles.postContent} numberOfLines={3}>
        {item.descricao || item.conteudo}
      </Text>
      <View style={styles.postFooter}>
        <Text style={styles.postDate}>
          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text>
        <Text style={styles.readMore}>Leia mais →</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bem-vindo!</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
        </View>
        <View style={styles.listContent}>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bem-vindo!</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
        </View>
        <ErrorState message="Erro ao carregar posts" onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bem-vindo!</Text>
          <Text style={styles.userName}>{displayName}</Text>
        </View>
        <View style={styles.headerButtons}>
          {isTeacher && (
            <TouchableOpacity
              style={styles.adminButton}
              onPress={handleAdminPress}
            >
              <Text style={styles.adminButtonText}>Admin</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar posts..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderPostItem}
        onRefresh={refetch}
        refreshing={isLoading}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyState 
            message={
              searchTerm 
                ? `Nenhum post encontrado para "${searchTerm}"` 
                : 'Nenhum post disponível'
            }
            icon={searchTerm ? '🔍' : '📭'}
          />
        }
        contentContainerStyle={posts.length === 0 ? styles.emptyList : styles.listContent}
      />
    </View>
  );
}

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greeting: {
    fontSize: 14,
    color: '#999',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  adminButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FF9500',
    borderRadius: 6,
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  listContent: {
    padding: 12,
  },
  emptyList: {
    flex: 1,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  postAuthor: {
    fontSize: 12,
    color: '#666',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postDate: {
    fontSize: 11,
    color: '#999',
  },
  readMore: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
