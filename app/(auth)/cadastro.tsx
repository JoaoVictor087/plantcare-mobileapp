import React, {useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
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
import {KeyboardAvoidingView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import {criarConta} from "../../api/apiMetodos";
import {isAxiosError} from "axios";

interface ErrosState {
    nome?: string;
    email?: string;
    senha?: string;
    confirmarSenha?: string;
}

const Cadastro = () => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erros, setErros] = useState<ErrosState>({});

    const validarCampos = () => {

        const novosErros : ErrosState = {};

        if (nome.trim() === "") {
            novosErros.nome = "O campo nome é obrigatório.";
        }

        if (!validarEmail(email)) {
            novosErros.email = "Digite um e-mail válido.";
        }

        if (!validarTamanhoSenha(senha)) {
            novosErros.senha = "A senha deve ter no mínimo 8 caracteres.\n";
        }
        if (!validarNumeroSenha(senha)) {
            novosErros.senha = (novosErros.senha || "") + "A senha deve conter pelo menos um número.\n";
        }
        if (!validarCaracterEspecialSenha(senha)) {
            novosErros.senha = (novosErros.senha || "") + "A senha deve conter um caractere especial.";
        }

        if (senha !== confirmarSenha) {
            novosErros.confirmarSenha = "As senhas não coincidem.";
        }

        setErros(novosErros);

        return Object.keys(novosErros).length === 0;
    };

    const handleCadastro = async () => {
        if (validarCampos()) {
            try {
                const dadosUsuario = {
                    nome,
                    email,
                    senha,
                };
                await criarConta(dadosUsuario);

                Alert.alert("Sucesso", "Conta criada com sucesso!");

                setNome("");
                setEmail("");
                setSenha("");
                setConfirmarSenha("");
                setErros({});
                router.replace("/login");
            } catch (error) {
                let mensagemErro = "Não foi possível salvar os dados. Tente novamente.";

                if (isAxiosError(error) && error.response) {
                    mensagemErro = error.response.data.nomeErro || mensagemErro;
                }
                Alert.alert("Erro", mensagemErro);
                console.error("Erro ao salvar dados:", error);
            }
        } else {
            Alert.alert("Erro", "Confira os dados e tente novamente.");
        }
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
            <View style={styles.container}>
                <Text style={styles.texto}>Crie a sua conta</Text>
                <View>
                    <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setNome}
                        value={nome}
                        placeholderTextColor={COLORS.verdeMedio}
                        placeholder={"Digite seu Nome Completo"}
                    ></TextInput>
                    {erros.nome && <Text style={styles.textoErro}>{erros.nome}</Text>}
                    </View>
                    <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholderTextColor={COLORS.verdeMedio}
                        placeholder={"Digite seu Email"}
                    ></TextInput>
                    {erros.email && <Text style={styles.textoErro}>{erros.email}</Text>}
                    </View>
                    <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSenha}
                        value={senha}
                        secureTextEntry={true}
                        placeholderTextColor={COLORS.verdeMedio}
                        placeholder={"Digite sua senha"}
                    ></TextInput>
                    {erros.senha && <Text style={styles.textoErro}>{erros.senha}</Text>}
                    </View>
                    <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setConfirmarSenha}
                        value={confirmarSenha}
                        secureTextEntry={true}
                        placeholderTextColor={COLORS.verdeMedio}
                        placeholder={"Confirme a sua senha"}
                    ></TextInput>
                    {erros.confirmarSenha && <Text style={styles.textoErro}>{erros.confirmarSenha}</Text>}
                    </View>
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
        backgroundColor: "white",
        textAlign: "center",
        width:300
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
    inputContainer:{
        marginBottom:30,
    }
});

export default Cadastro;
