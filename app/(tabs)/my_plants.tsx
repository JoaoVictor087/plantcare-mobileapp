import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const MyPlants = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Minhas Plantas</Text>
      <View style={styles.infoArea}>

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
    infoArea: {
        height: 300,
        width: 350,
        backgroundColor: "#fff",
        borderRadius: 10
    },
    add: {
      marginTop: 80,
      color: COLORS.verdeEscuro
    }

    }      
  );

    

export default MyPlants;