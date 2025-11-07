import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import COLORS from "../constants/Colors";
import {Planta} from "../types/Planta";

interface ContainerPlantaProps {
    planta: Planta;
}

const ContainerPlanta = ({planta}: ContainerPlantaProps) => {
  return (
      <View style={styles.container}>
          <View style={styles.infoArea}>
              <View style={styles.infoTexto}>
                  <Text style={styles.titulo}> {planta.nome}</Text>
                  <Text style={styles.titulo}>Umidade: {planta.umidade} %</Text>
                  <Text style={styles.titulo}>Temperatura: {planta.temperatura}Cº</Text>
                  <Text style={styles.titulo}>Status: {planta.status}</Text>
              </View>
              <Image style={styles.image} source={require("../assets/planta.jpg")} resizeMode="contain"></Image>
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.begeFundo,
            alignItems: "center",
            marginBottom: 20,
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
        image: {
            height: 300,
            width: 170,
            borderRadius: 10,
            marginLeft: 18,
        },

    }
);

export default ContainerPlanta;