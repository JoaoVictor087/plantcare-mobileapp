import { isAxiosError } from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ThemedCard } from '../../components/ThemedCard';
import { layout } from '../../constants/themePalettes';
import { useTheme } from '../../context/ThemeContext';
import { useLoginMutation } from '../../hooks/useAuthMutations';

const Login = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const loginMutation = useLoginMutation();

  const handleLogin = async () => {

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
          } else if (isAxiosError(error) && !error.response) {
            mensagemErro =
              'Sem conexão ou servidor indisponível. Tente de novo mais tarde.';
          }
          Alert.alert('Erro', mensagemErro);
        },
      }
    );
  };

  const pending = loginMutation.isPending;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ThemedCard style={styles.card}>
        <Text style={[styles.titulo, { color: colors.text }]}>Bem-vindo</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Entre com sua conta ou use o acesso administrador.
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceMuted,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          onChangeText={setEmail}
          value={email}
          placeholderTextColor={colors.textSecondary}
          placeholder="E-mail"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceMuted,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          onChangeText={setSenha}
          secureTextEntry
          value={senha}
          placeholderTextColor={colors.textSecondary}
          placeholder="Senha"
        />
        <PrimaryButton
          title={pending ? 'Entrando…' : 'Entrar'}
          onPress={handleLogin}
          loading={pending}
          style={styles.btnMain}
        />
      </ThemedCard>
      <TouchableOpacity onPress={() => router.replace('/(auth)/cadastro')}>
        <Text style={[styles.link, { color: colors.primary }]}>
          Criar conta
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: layout.spaceMd,
  },
  card: {
    alignSelf: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    marginBottom: layout.spaceMd,
    lineHeight: 20,
  },
  input: {
    width: '100%',
    minWidth: 280,
    height: 50,
    borderRadius: layout.radiusSm,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  btnMain: {
    marginTop: 8,
    width: '100%',
  },
  dicaAdmin: {
    marginTop: layout.spaceMd,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    marginTop: layout.spaceLg,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Login;
