import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, PostFormData } from '../../../types/models';
import { usePost, useUpdatePost } from '../../../hooks/usePosts';
import { useAuth } from '../../../contexts/AuthContext';
import Loader from '../../../components/common/Loader';
import ErrorState from '../../../components/common/ErrorState';

export default function AdminPostEditScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const postId = (route.params as any)?.postId;
  const { isTeacher } = useAuth();
  
  const { data: post, isLoading, error, refetch } = usePost(postId);
  const updatePostMutation = useUpdatePost();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      titulo: '',
      conteudo: '',
      descricao: '',
    },
  });

  // Guard: Only teachers can access
  useEffect(() => {
    if (!isTeacher) {
      Alert.alert('Acesso negado', 'Apenas professores podem editar posts.');
      navigation.goBack();
    }
  }, [isTeacher, navigation]);

  // Load post data into form
  useEffect(() => {
    if (post) {
      reset({
        titulo: post.titulo,
        conteudo: post.conteudo,
        descricao: post.descricao || '',
      });
    }
  }, [post, reset]);

  const onSubmit = async (data: PostFormData) => {
    try {
      await updatePostMutation.mutateAsync({ postId, data });
      Alert.alert('Sucesso', 'Post atualizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar post';
      Alert.alert('Erro', message);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !post) {
    return (
      <ErrorState 
        message="Erro ao carregar post para edição" 
        onRetry={refetch} 
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Post</Text>
          <View style={{ width: 80 }} />
        </View>

        <View style={styles.content}>
          {/* Post ID Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Editando post #{post.id}</Text>
          </View>

          {/* Título */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Título <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name="titulo"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.titulo && styles.inputError]}
                  placeholder="Digite o título do post"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!isSubmitting}
                />
              )}
            />
            {errors.titulo && (
              <Text style={styles.errorText}>{errors.titulo.message}</Text>
            )}
          </View>

          {/* Descrição */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição (opcional)</Text>
            <Controller
              control={control}
              name="descricao"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea, errors.descricao && styles.inputError]}
                  placeholder="Breve descrição do post"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={3}
                  editable={!isSubmitting}
                />
              )}
            />
            {errors.descricao && (
              <Text style={styles.errorText}>{errors.descricao.message}</Text>
            )}
          </View>

          {/* Conteúdo */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Conteúdo <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name="conteudo"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    styles.largeTextArea,
                    errors.conteudo && styles.inputError,
                  ]}
                  placeholder="Digite o conteúdo completo do post"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={10}
                  editable={!isSubmitting}
                />
              )}
            />
            {errors.conteudo && (
              <Text style={styles.errorText}>{errors.conteudo.message}</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
  content: {
    padding: 16,
  },
  infoBox: {
    backgroundColor: '#E8F4FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  largeTextArea: {
    minHeight: 200,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
