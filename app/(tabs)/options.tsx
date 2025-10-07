import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../../constants/Colors';

const Options = () => {
  return (
      <View style={styles.container}>    
      <Ionicons name="person-circle-outline" size={90} style={styles.perfil} />
      <View style={styles.campoTexto}>
      <Text style={styles.textoNome}>Usuario</Text>
      </View>
      
      <View style={styles.campoTexto}>
      <Text style={styles.textoNome}>Email</Text>
      </View>

      </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.begeFundo,
        alignItems: "center",
    },
    perfil: {
      color: COLORS.verdeMedio,
      marginTop: 20
    },
    textoNome: {
        marginBottom: 0,
        fontSize: 20,
        fontFamily: "Inter",
        color: COLORS.verdeEscuro,
        marginTop: 5,
        justifyContent: "center"
    },
    campoTexto: {
      backgroundColor: "#fff",
      height: 50,
      width: 350,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    }


});

export default Options;