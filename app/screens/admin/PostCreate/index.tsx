import React from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePost } from '../../../../src/hooks/usePosts';
import { createPostSchema, CreatePostFormData } from '../../../../src/types/models';
import { Input, Button } from '../../../../src/components/common';

function AdminPostCreate() {
  const navigation = useNavigation();
  const { mutate: createPost, isPending } = useCreatePost();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      titulo: '',
      conteudo: '',
      descricao: '',
    },
  });

  const onSubmit = (data: CreatePostFormData) => {
    createPost(data, {
      onSuccess: () => {
        Alert.alert('Sucesso', 'Post criado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              reset();
              navigation.goBack();
            },
          },
        ]);
      },
      onError: (error: any) => {
        Alert.alert('Erro', error?.message || 'Erro ao criar post');
      },
    });
  };

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
        <Text style={styles.headerTitle}>Novo Post</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
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
                value={value}
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
            title="Criar Post"
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

export default AdminPostCreate;

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
