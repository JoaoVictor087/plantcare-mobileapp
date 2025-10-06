import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Button, TouchableOpacity} from 'react-native';
import COLORS from "../../constants/Colors";
import {validarCaracterEspecialSenha, validarEmail, validarNumeroSenha, validarTamanhoSenha} from "../../utils/utils";


const Cadastro = () => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [senhaValida, isSenhaValida] = useState(false);

    const [emailErro, isEmailError] = useState(false);
    const [senhaErro, isSenhaErro] = useState(false);

    const testeEmail = () => {
        if(email && !validarEmail(email)){
            isEmailError(true);
        }else {
            isEmailError(false)
        }
    }

    const rodarTesteAssincronos = async () => {
        testeEmail();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.texto}>Crie a sua conta</Text>
            <View>
                <TextInput
                    style={styles.input}
                    onChangeText={setNome}
                    value={nome}
                    placeholderTextColor={COLORS.verdeMedio}
                    placeholder={"Digite seu Nome Completo"}>
                </TextInput>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    placeholderTextColor={COLORS.verdeMedio}
                    placeholder={"Digite seu Email"}>
                </TextInput>
                {emailErro ? (<Text style={styles.textoErro}>Digite um Email válido</Text>): <Text/>}
                <TextInput
                    style={styles.input}
                    onChangeText={setSenha}
                    value={senha}
                    secureTextEntry={true}
                    placeholderTextColor={COLORS.verdeMedio}
                    placeholder={"Digite sua senha"}>
                </TextInput>
                <TextInput
                    style={styles.input}
                    onChangeText={setConfirmarSenha}
                    value={confirmarSenha}
                    secureTextEntry={true}
                    placeholderTextColor={COLORS.verdeMedio}
                    placeholder={"Confirme a sua senha"}>
                </TextInput>
            </View>
            <TouchableOpacity onPress={()=> rodarTesteAssincronos()}>
                <View style={styles.botao}>
                    <Text style={styles.textoBotao}>Criar Conta</Text>
                </View>
            </TouchableOpacity>
        </View>
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
        marginBottom: 85,
        fontSize: 30,
        fontFamily: "Inter",
        color: COLORS.verdeEscuro
    },
    textoBotao:{
        fontSize: 20,
        color: "white"
    },
    textoErro:{
        color:"red",
    }
});

export default Cadastro;