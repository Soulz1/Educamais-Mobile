import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePosts, useDeletePost } from '../../../hooks/usePosts';
import { useAuth } from '../../../contexts/AuthContext';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import type { Post } from '../../../types/models';

export default function AdminPostsListScreen() {
  const navigation = useNavigation<any>();
  const { isTeacher } = useAuth();
  const { data: posts, isLoading } = usePosts(1, 50);
  const deletePostMutation = useDeletePost();

  // Guard: Only teachers can access this screen
  React.useEffect(() => {
    if (!isTeacher) {
      Alert.alert('Acesso negado', 'Apenas professores podem acessar esta área.');
      navigation.goBack();
    }
  }, [isTeacher, navigation]);

  const handleDelete = (postId: number, titulo: string) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir "${titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePostMutation.mutateAsync(postId);
              Alert.alert('Sucesso', 'Post excluído com sucesso');
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir o post');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (postId: number) => {
    navigation.navigate('AdminPostEdit', { postId });
  };

  const handleCreate = () => {
    navigation.navigate('AdminPostCreate');
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.titulo}</Text>
        <Text style={styles.postAuthor}>por {item.autor?.name || 'Desconhecido'}</Text>
        <Text style={styles.postDate}>
          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item.id)}
        >
          <Text style={styles.actionButtonText}>✏️ Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id, item.titulo)}
          disabled={deletePostMutation.isPending}
        >
          <Text style={styles.actionButtonText}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciar Posts</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Create Button */}
      <View style={styles.createButtonContainer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>+ Novo Post</Text>
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        ListEmptyComponent={
          <EmptyState message="Nenhum post criado ainda" icon="📝" />
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Loading overlay when deleting */}
      {deletePostMutation.isPending && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  createButtonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  createButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postContent: {
    marginBottom: 12,
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
    marginBottom: 2,
  },
  postDate: {
    fontSize: 11,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
