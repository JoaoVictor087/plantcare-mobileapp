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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ThemedCard } from '../../components/ThemedCard';
import { layout } from '../../constants/themePalettes';
import { useTheme } from '../../context/ThemeContext';
import { useCadastroMutation } from '../../hooks/useAuthMutations';
import {
  validarCaracterEspecialSenha,
  validarEmail,
  validarNumeroSenha,
  validarTamanhoSenha,
} from '../../utils/LoginUtils';

interface ErrosState {
  nome?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
}

const Cadastro = () => {
  const { colors } = useTheme();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erros, setErros] = useState<ErrosState>({});
  const cadastroMutation = useCadastroMutation();

  const validarCampos = () => {
    const novosErros: ErrosState = {};

    if (nome.trim() === '') {
      novosErros.nome = 'O campo nome é obrigatório.';
    }

    if (!validarEmail(email)) {
      novosErros.email = 'Digite um e-mail válido.';
    }

    if (!validarTamanhoSenha(senha)) {
      novosErros.senha = 'A senha deve ter no mínimo 8 caracteres.\n';
    }
    if (!validarNumeroSenha(senha)) {
      novosErros.senha =
        (novosErros.senha || '') + 'Inclua pelo menos um número.\n';
    }
    if (!validarCaracterEspecialSenha(senha)) {
      novosErros.senha =
        (novosErros.senha || '') + 'Inclua um caractere especial.';
    }

    if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCadastro = () => {
    if (!validarCampos()) {
      Alert.alert('Atenção', 'Confira os campos destacados.');
      return;
    }

    cadastroMutation.mutate(
      { nome, email, senha },
      {
        onSuccess: () => {
          Alert.alert('Sucesso', 'Conta criada! Faça login.');
          setNome('');
          setEmail('');
          setSenha('');
          setConfirmarSenha('');
          setErros({});
          router.replace('/(auth)/login');
        },
        onError: (error) => {
          let mensagemErro =
            'Não foi possível salvar. Tente novamente.';
          if (isAxiosError(error) && error.response) {
            const data = error.response.data as { nomeErro?: string };
            mensagemErro = data.nomeErro ?? mensagemErro;
          } else if (isAxiosError(error) && !error.response) {
            mensagemErro = 'Sem conexão ou servidor indisponível.';
          }
          Alert.alert('Erro', mensagemErro);
        },
      }
    );
  };

  const pending = cadastroMutation.isPending;

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surfaceMuted,
      color: colors.text,
      borderColor: colors.border,
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedCard style={styles.card}>
          <Text style={[styles.titulo, { color: colors.text }]}>Nova conta</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>
            Preencha os dados para se cadastrar no PlantCare.
          </Text>
          <TextInput
            style={inputStyle}
            onChangeText={setNome}
            value={nome}
            placeholderTextColor={colors.textSecondary}
            placeholder="Nome completo"
          />
          {erros.nome ? (
            <Text style={styles.textoErro}>{erros.nome}</Text>
          ) : null}
          <TextInput
            style={inputStyle}
            onChangeText={setEmail}
            value={email}
            placeholderTextColor={colors.textSecondary}
            placeholder="E-mail"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {erros.email ? (
            <Text style={styles.textoErro}>{erros.email}</Text>
          ) : null}
          <TextInput
            style={inputStyle}
            onChangeText={setSenha}
            value={senha}
            secureTextEntry
            placeholderTextColor={colors.textSecondary}
            placeholder="Senha"
          />
          {erros.senha ? (
            <Text style={styles.textoErro}>{erros.senha}</Text>
          ) : null}
          <TextInput
            style={inputStyle}
            onChangeText={setConfirmarSenha}
            value={confirmarSenha}
            secureTextEntry
            placeholderTextColor={colors.textSecondary}
            placeholder="Confirmar senha"
          />
          {erros.confirmarSenha ? (
            <Text style={styles.textoErro}>{erros.confirmarSenha}</Text>
          ) : null}
          <PrimaryButton
            title={pending ? 'Criando…' : 'Criar conta'}
            onPress={handleCadastro}
            loading={pending}
            style={styles.btn}
          />
        </ThemedCard>
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
          <Text style={[styles.link, { color: colors.primary }]}>
            Já tenho conta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
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
    marginBottom: 6,
    fontSize: 16,
  },
  textoErro: {
    color: '#C62828',
    fontSize: 12,
    marginBottom: 8,
  },
  btn: {
    marginTop: layout.spaceSm,
    width: '100%',
  },
  link: {
    marginTop: layout.spaceLg,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Cadastro;
