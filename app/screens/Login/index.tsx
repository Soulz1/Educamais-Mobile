import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../routes/app.routes';
import { useAuth } from '@/src/contexts/AuthContext';

type LoginNavigationProp = NavigationProp<RootStackParamList, 'screens/Login/index'>;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<LoginNavigationProp>();
  const { signIn, signUp } = useAuth();

  const handleLogin = async () => {
    // Validação
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha email e senha');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password);
      // Navegar para Home após login bem-sucedido
      navigation.navigate('screens/Home/index', { userName: email });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      Alert.alert('Erro de Login', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha email e senha para cadastrar');
      return;
    }

    try {
      setIsLoading(true);
      await signUp(email, password);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      navigation.navigate('screens/Home/index', { userName: email });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar';
      Alert.alert('Erro de Cadastro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
<LinearGradient
      colors={['#87CEEB', '#FFFFFF']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.content}>
        <Text style={styles.title}>EducaMais</Text>
        <Text style={styles.subtitle}>Acesso ao Sistema</Text>
        
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input}
          placeholder="seu@email.com"
          onChangeText={setEmail}
          value={email}
          editable={!isLoading}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Campo de email"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput 
          style={styles.input}
          placeholder="Sua senha"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          editable={!isLoading}
          accessibilityLabel="Campo de senha"
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.signUpButton, isLoading && styles.buttonDisabled]} 
          onPress={handleSignUp}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.signUpButtonText}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    width: '100%',
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },
  signUpButton: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  signUpButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});