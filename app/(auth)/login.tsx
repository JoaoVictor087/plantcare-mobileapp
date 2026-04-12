import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { useLoginMutation } from '../../hooks/useAuthMutations';
import { credenciaisAdminValidas } from '../../utils/adminCredentials';
import { limparAuthData, salvarSessaoAdmin } from '../../utils/AuthStorageUtils';

const Login = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const loginMutation = useLoginMutation();

  const handleLogin = async () => {
    if (credenciaisAdminValidas(email, senha)) {
      await limparAuthData();
      await salvarSessaoAdmin();
      router.replace('/(tabs)/dashboard');
      return;
    }

    loginMutation.mutate(
      { email, senha },
      {
        onSuccess: () => {
          router.replace('/(tabs)/dashboard');
        },
        onError: (error) => {
          let mensagemErro = 'Não foi possível fazer o login.';
          if (isAxiosError(error) && error.response) {
            const data = error.response.data as { nomeErro?: string };
            mensagemErro = data.nomeErro ?? 'Usuário ou senha inválidos.';
          }
          Alert.alert('Erro', mensagemErro);
        },
      }
    );
  };

  const pending = loginMutation.isPending;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.primary }]}>Faça o seu Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          onChangeText={setEmail}
          value={email}
          placeholderTextColor={colors.textSecondary}
          placeholder="E-mail ou usuário (admin)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          onChangeText={setSenha}
          secureTextEntry
          value={senha}
          placeholderTextColor={colors.textSecondary}
          placeholder="Digite a sua senha"
        />
      </View>
      <TouchableOpacity onPress={handleLogin} disabled={pending}>
        <View
          style={[
            styles.botao,
            { backgroundColor: colors.primary, opacity: pending ? 0.7 : 1 },
          ]}
        >
          {pending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>Fazer Login</Text>
          )}
        </View>
      </TouchableOpacity>
      <Text style={[styles.dicaAdmin, { color: colors.textSecondary }]}>
        Administrador: usuário e senha{' '}
        <Text style={{ fontWeight: '700' }}>admin</Text>
      </Text>
      <TouchableOpacity onPress={() => router.replace('/(auth)/cadastro')}>
        <Text style={[styles.textoCriarConta, { color: colors.primary }]}>
          Não tem conta? Cadastre-se agora
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 10,
    textAlign: 'center',
    width: 300,
    borderWidth: 1,
  },
  inputContainer: {
    marginBottom: 30,
  },
  titulo: {
    marginTop: 80,
    fontSize: 25,
    fontFamily: 'Inter',
    marginBottom: 110,
  },
  botao: {
    marginTop: 70,
    width: 200,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    color: 'white',
    fontSize: 18,
  },
  textoCriarConta: {
    marginTop: 10,
  },
  dicaAdmin: {
    marginTop: 20,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 18,
  },
});

export default Login;
