import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import {
  validarCaracterEspecialSenha,
  validarEmail,
  validarNumeroSenha,
  validarTamanhoSenha,
} from '../../utils/LoginUtils';
import { useTheme } from '../../context/ThemeContext';
import { useCadastroMutation } from '../../hooks/useAuthMutations';

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
        (novosErros.senha || '') + 'A senha deve conter pelo menos um número.\n';
    }
    if (!validarCaracterEspecialSenha(senha)) {
      novosErros.senha =
        (novosErros.senha || '') + 'A senha deve conter um caractere especial.';
    }

    if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCadastro = () => {
    if (!validarCampos()) {
      Alert.alert('Erro', 'Confira os dados e tente novamente.');
      return;
    }

    cadastroMutation.mutate(
      { nome, email, senha },
      {
        onSuccess: () => {
          Alert.alert('Sucesso', 'Conta criada com sucesso!');
          setNome('');
          setEmail('');
          setSenha('');
          setConfirmarSenha('');
          setErros({});
          router.replace('/(auth)/login');
        },
        onError: (error) => {
          let mensagemErro =
            'Não foi possível salvar os dados. Tente novamente.';
          if (isAxiosError(error) && error.response) {
            const data = error.response.data as { nomeErro?: string };
            mensagemErro = data.nomeErro ?? mensagemErro;
          }
          Alert.alert('Erro', mensagemErro);
        },
      }
    );
  };

  const pending = cadastroMutation.isPending;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior="padding"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.texto, { color: colors.text }]}>Crie a sua conta</Text>
        <View>
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
              onChangeText={setNome}
              value={nome}
              placeholderTextColor={colors.textSecondary}
              placeholder="Digite seu Nome Completo"
            />
            {erros.nome ? (
              <Text style={styles.textoErro}>{erros.nome}</Text>
            ) : null}
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
              onChangeText={setEmail}
              value={email}
              placeholderTextColor={colors.textSecondary}
              placeholder="Digite seu Email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {erros.email ? (
              <Text style={styles.textoErro}>{erros.email}</Text>
            ) : null}
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
              value={senha}
              secureTextEntry
              placeholderTextColor={colors.textSecondary}
              placeholder="Digite sua senha"
            />
            {erros.senha ? (
              <Text style={styles.textoErro}>{erros.senha}</Text>
            ) : null}
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
              onChangeText={setConfirmarSenha}
              value={confirmarSenha}
              secureTextEntry
              placeholderTextColor={colors.textSecondary}
              placeholder="Confirme a sua senha"
            />
            {erros.confirmarSenha ? (
              <Text style={styles.textoErro}>{erros.confirmarSenha}</Text>
            ) : null}
          </View>
        </View>
        <TouchableOpacity onPress={handleCadastro} disabled={pending}>
          <View
            style={[
              styles.botao,
              { backgroundColor: colors.primary, opacity: pending ? 0.7 : 1 },
            ]}
          >
            {pending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBotao}>Criar Conta</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  botao: {
    borderRadius: 20,
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    marginBottom: 30,
    fontSize: 30,
    fontFamily: 'Inter',
  },
  textoBotao: {
    fontSize: 20,
    color: 'white',
  },
  textoErro: {
    color: 'red',
  },
  inputContainer: {
    marginBottom: 30,
  },
});

export default Cadastro;
