import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import COLORS from "../../constants/Colors";
import {
  validarCaracterEspecialSenha,
  validarEmail,
  validarNumeroSenha,
  validarTamanhoSenha,
} from "../../utils/utils";
import { KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [emailErro, setEmailErro] = useState("");
  const [senhaErro, setSenhaErro] = useState("");

  const validarCampos = () => {
    let valid = true;

    if (nome.trim() === "") {
      Alert.alert("Erro", "Digite um nome");
      valid = false;
    }

    if (!validarEmail(email)) {
      setEmailErro("Digite um email válido");
      valid = false;
    } else {
      setEmailErro("");
    }

    if (senha.length < 6) {
      setSenhaErro("A senha deve ter pelo menos 6 caracteres.");
      valid = false;
    } else if (senha !== confirmarSenha) {
      setSenhaErro("As senhas não coincidem.");
      valid = false;
    } else {
      setSenhaErro("");
    }

    return valid;
  };

  const handleCadastro = async () => {
    if (validarCampos()) {
      try {
        const dadosUsuario = {
          nome,
          email,
          senha,
        };

        await AsyncStorage.setItem("usuario", JSON.stringify(dadosUsuario));

        Alert.alert("Sucesso", "Conta criada com sucesso!");

        setNome("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
      } catch (error) {
        Alert.alert("Erro", "Não foi possível salvar os dados.");
        console.error("Erro ao salvar dados:", error);
      }
    } else {
      Alert.alert("Erro", "Confira os dados e tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <Text style={styles.texto}>Crie a sua conta</Text>
        <View>
          <TextInput
            style={styles.input}
            onChangeText={setNome}
            value={nome}
            placeholderTextColor={COLORS.verdeMedio}
            placeholder={"Digite seu Nome Completo"}
          ></TextInput>
          {emailErro !== "" && (
            <Text style={styles.textoErro}>{emailErro}</Text>
          )}

          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholderTextColor={COLORS.verdeMedio}
            placeholder={"Digite seu Email"}
          ></TextInput>

          <TextInput
            style={styles.input}
            onChangeText={setSenha}
            value={senha}
            secureTextEntry={true}
            placeholderTextColor={COLORS.verdeMedio}
            placeholder={"Digite sua senha"}
          ></TextInput>
          {senhaErro !== "" && (
            <Text style={styles.textoErro}>{senhaErro}</Text>
          )}

          <TextInput
            style={styles.input}
            onChangeText={setConfirmarSenha}
            value={confirmarSenha}
            secureTextEntry={true}
            placeholderTextColor={COLORS.verdeMedio}
            placeholder={"Confirme a sua senha"}
          ></TextInput>
        </View>
        <TouchableOpacity onPress={handleCadastro}>
          <View style={styles.botao}>
            <Text style={styles.textoBotao}>Criar Conta</Text>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.begeFundo,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginBottom: 50,
    backgroundColor: "white",
    textAlign: "center",
  },
  botao: {
    backgroundColor: COLORS.verdeMedio,
    borderRadius: 20,
    width: 200,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    marginBottom: 30,
    fontSize: 30,
    fontFamily: "Inter",
    color: COLORS.verdeEscuro,
  },
  textoBotao: {
    fontSize: 20,
    color: "white",
  },
  textoErro: {
    color: "red",
  },
});

export default Cadastro;
