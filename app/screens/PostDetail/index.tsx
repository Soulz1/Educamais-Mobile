import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../routes/app.routes';
import { usePost } from '../../../src/hooks/usePosts';
import { Loader, ErrorState } from '../../../src/components/common';

type PostDetailNavigationProp = NavigationProp<RootStackParamList, 'screens/PostDetail/index'>;
type PostDetailRouteProp = RouteProp<RootStackParamList, 'screens/PostDetail/index'>;

function PostDetail() {
  const navigation = useNavigation<PostDetailNavigationProp>();
  const route = useRoute<PostDetailRouteProp>();
  const postId = route.params.postId;

  const { data: post, isLoading, isError, error, refetch } = usePost(postId);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    );
  }

  if (isError || !post) {
    return (
      <View style={styles.container}>
        <ErrorState
          message={(error as any)?.message || 'Post não encontrado'}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('screens/Home/index', { userName: '' });
            }
          }}
          style={styles.backButton}
          hitSlop={{ top: 16, left: 16, right: 16, bottom: 16 }}
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo do Post */}
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.titulo}>{post.titulo}</Text>

        {/* Info do Autor */}
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>
            por <Text style={styles.authorNameBold}>{post.autor?.name || 'Desconhecido'}</Text>
          </Text>
          <Text style={styles.authorEmail}>{post.autor?.email}</Text>
          <Text style={styles.date}>
            {new Date(post.createdAt).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Descrição (se houver) */}
        {post.descricao && (
          <>
            <Text style={styles.descricao}>{post.descricao}</Text>
            <View style={styles.divider} />
          </>
        )}

        {/* Conteúdo */}
        <Text style={styles.conteudo}>{post.conteudo}</Text>

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            ID do Post: {post.id}
          </Text>
          {post.atualizacao !== post.createdAt && (
            <Text style={styles.metadataText}>
              Atualizado em: {new Date(post.atualizacao).toLocaleDateString('pt-BR')}
            </Text>
          )}
        </View>

        {/* TODO: Comments section - placeholder for future implementation */}
        <View style={styles.commentsPlaceholder}>
          <Text style={styles.commentsTitle}>💬 Comentários</Text>
          <Text style={styles.commentsText}>Em breve: Seção de comentários</Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
    lineHeight: 32,
  },
  authorInfo: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  authorName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  authorNameBold: {
    fontWeight: '600',
    color: '#333',
  },
  authorEmail: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  descricao: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  conteudo: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  metadata: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    marginBottom: 24,
  },
  metadataText: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  commentsPlaceholder: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  commentsText: {
    fontSize: 14,
    color: '#999',
  },
});
