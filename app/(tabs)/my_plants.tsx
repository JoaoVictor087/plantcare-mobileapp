import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import COLORS from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const MyPlants = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Minhas Plantas</Text>
      <View style={styles.infoArea}>
        <View style={styles.infoTexto}>
        <Text style={styles.titulo}> Planta 1</Text>
        <Text style={styles.titulo}> Umidade: 40%</Text>
        <Text style={styles.titulo}> Temperatura: 24 C°</Text>
        <Text style={styles.titulo}> Status: Saudável</Text>
        </View>
        <Image style={styles.image} source={require("../../assets/planta.jpg")} resizeMode="contain"></Image>
      </View>
      <TouchableOpacity>
      <Ionicons name="add-circle" size={64} style={styles.add} />
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
    texto: {
        marginBottom: 30,
        fontSize: 30,
        fontFamily: "Inter",
        color: COLORS.verdeEscuro,
        marginTop: 20,
    },
    titulo: {
      fontSize: 18,
      color: COLORS.verdeMedio,
      marginTop: 30
      
    },
    infoArea: {
        height: 300,
        width: 350,
        backgroundColor: "#fff",
        borderRadius: 10,
        flexDirection: "row"
    },
    infoTexto: {
        alignContent: "center",
    },
    add: {
      marginTop: 80,
      color: COLORS.verdeEscuro
    },
    image: {
      height: 300,
      width: 170,
      borderRadius: 10,
      marginLeft: 18,
    },

    }      
  );

    

export default MyPlants;