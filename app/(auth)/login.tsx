import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import COLORS from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';

interface StorageInterface {
    nome: string;
    email: string;
    senha: string;
}

const Login = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [logado, setLogado] = useState(false);

    useEffect(() => {
        if(logado){
            router.replace("/dashboard")
        }
    }, [logado])

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(email);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.log(e);
        }
    };

    async function verificarLogin() {
        const loginUsuario: StorageInterface = await getData();
        if(!loginUsuario){
            Alert.alert("Erro", "Usuário não encontrado");
            return null;
        }

        if (loginUsuario.senha === senha && loginUsuario.email === email){
            setLogado(true);
        }else{
            Alert.alert("Erro", "Email e/ou senha inválidos")
        }

    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Faça o seu Login</Text>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input}
                           onChangeText={setEmail}
                           value={email}
                           placeholderTextColor={COLORS.verdeMedio}
                           placeholder={"Digite o seu email"}>
                </TextInput>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input}
                           onChangeText={setSenha}
                           value={senha}
                           placeholderTextColor={COLORS.verdeMedio}
                           placeholder={"Digite a sua senha"}>
                </TextInput>
            </View>
            <TouchableOpacity onPress={verificarLogin}>
                <View style={styles.botao}>
                    <Text style={styles.textoBotao}>Fazer Login</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace("/cadastro")}>
                <Text style={styles.textoCriarConta}>Não tem conta? Cadastre-se agora</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.begeFundo,
        alignItems: "center",
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 60,
        borderRadius: 10,
        backgroundColor: "white",
        textAlign: "center",
        width: 300
    },
    inputContainer: {
        marginBottom: 30,
    },
    titulo: {
        marginTop: 80,
        fontSize: 25,
        fontFamily: "Inter",
        color: COLORS.verdeMedio,
        marginBottom: 110,
    },
    botao: {
        marginTop: 70,
        width: 200,
        height: 40,
        backgroundColor: COLORS.verdeMedio,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    textoBotao: {
        color: "white",
        fontSize: 18,
    },
    textoCriarConta: {
        marginTop: 10,
        color: COLORS.verdeMedio,

    }
});

export default Login;