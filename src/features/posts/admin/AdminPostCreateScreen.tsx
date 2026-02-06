import React from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, PostFormData } from '../../../types/models';
import { useCreatePost } from '../../../hooks/usePosts';
import { useAuth } from '../../../contexts/AuthContext';

export default function AdminPostCreateScreen() {
  const navigation = useNavigation<any>();
  const { isTeacher } = useAuth();
  const createPostMutation = useCreatePost();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      titulo: '',
      conteudo: '',
      descricao: '',
    },
  });

  // Guard: Only teachers can access
  React.useEffect(() => {
    if (!isTeacher) {
      Alert.alert('Acesso negado', 'Apenas professores podem criar posts.');
      navigation.goBack();
    }
  }, [isTeacher]);

  const onSubmit = async (data: PostFormData) => {
    try {
      await createPostMutation.mutateAsync(data);
      Alert.alert('Sucesso', 'Post criado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar post';
      Alert.alert('Erro', message);
    }
  };

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
          <Text style={styles.headerTitle}>Novo Post</Text>
          <View style={{ width: 80 }} />
        </View>

        <View style={styles.content}>
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
              {isSubmitting ? 'Criando...' : 'Criar Post'}
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
    backgroundColor: '#34C759',
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
