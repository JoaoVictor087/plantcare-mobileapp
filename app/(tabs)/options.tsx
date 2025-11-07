import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Pressable, Button} from 'react-native';
import COLORS from '../../constants/Colors';
import {limparAuthData} from "../../utils/AuthStorageUtils";
import {router} from "expo-router";

const Options = () => {
    const logout = () => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja sair da sua conta?",
            [
                {text: "Cancelar", style: "cancel"},
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await limparAuthData();
                            router.replace('/login');
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível fazer logout.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Ionicons name="person-circle-outline" size={90} style={styles.perfil}/>
            <Pressable>
                <Text style={styles.editarPerfil}>Editar Perfil</Text>
            </Pressable>
            <View>
                <Text style={styles.tituloTexto}>Conta</Text>
            </View>
            <Button title={"Logout"}
                    color={"red"} onPress={logout}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.begeFundo,
        alignItems: "center"

    },
    perfil: {
        color: COLORS.verdeMedio,
        marginTop: 20
    },
    editarPerfil: {
        color: 'black'
    },
    tituloTexto: {
        fontSize: 30,
        color: COLORS.verdeEscuro,
        marginBottom: 10
        //texto na esquerda
    },
});

export default Options;