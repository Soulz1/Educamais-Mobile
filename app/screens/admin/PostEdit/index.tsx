import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../routes/app.routes';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePost, useUpdatePost } from '../../../../src/hooks/usePosts';
import { updatePostSchema, UpdatePostFormData } from '../../../../src/types/models';
import { Input, Button, Loader, ErrorState } from '../../../../src/components/common';

type AdminPostEditNavigationProp = NavigationProp<RootStackParamList, 'screens/admin/PostEdit/index'>;
type AdminPostEditRouteProp = RouteProp<RootStackParamList, 'screens/admin/PostEdit/index'>;

function AdminPostEdit() {
  const navigation = useNavigation<AdminPostEditNavigationProp>();
  const route = useRoute<AdminPostEditRouteProp>();
  const postId = route.params.postId;

  const { data: post, isLoading, isError, error, refetch } = usePost(postId);
  const { mutate: updatePost, isPending } = useUpdatePost();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePostFormData>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      titulo: '',
      conteudo: '',
      descricao: '',
    },
  });

  // Populate form when post data is loaded
  useEffect(() => {
    if (post) {
      reset({
        titulo: post.titulo,
        conteudo: post.conteudo,
        descricao: post.descricao || '',
      });
    }
  }, [post, reset]);

  const onSubmit = (data: UpdatePostFormData) => {
    updatePost(
      { postId, data },
      {
        onSuccess: () => {
          Alert.alert('Sucesso', 'Post atualizado com sucesso!', [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert('Erro', error?.message || 'Erro ao atualizar post');
        },
      }
    );
  };

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Post</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          {/* Post Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>ID: {post.id}</Text>
            <Text style={styles.infoText}>
              Criado: {new Date(post.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>

          {/* Título Field */}
          <Controller
            control={control}
            name="titulo"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Título *"
                placeholder="Digite o título do post"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.titulo?.message}
                editable={!isPending}
              />
            )}
          />

          {/* Descrição Field */}
          <Controller
            control={control}
            name="descricao"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Descrição (opcional)"
                placeholder="Breve descrição do post"
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.descricao?.message}
                editable={!isPending}
                multiline
                numberOfLines={3}
                inputStyle={styles.textArea}
              />
            )}
          />

          {/* Conteúdo Field */}
          <Controller
            control={control}
            name="conteudo"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Conteúdo *"
                placeholder="Digite o conteúdo completo do post"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.conteudo?.message}
                editable={!isPending}
                multiline
                numberOfLines={8}
                inputStyle={styles.textArea}
              />
            )}
          />

          <Text style={styles.hint}>* Campos obrigatórios</Text>

          {/* Submit Button */}
          <Button
            title="Salvar Alterações"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            disabled={isPending}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AdminPostEdit;

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
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  placeholder: {
    width: 80,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  submitButton: {
    marginTop: 8,
  },
});
