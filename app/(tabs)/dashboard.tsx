import React from "react";
import {View, Text, StyleSheet, ScrollView} from "react-native";
import COLORS from "../../constants/Colors";

const Dashboard = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Dashboard</Text>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.infoArea}>
                <Text style={styles.texto}>Alertas:</Text>
                <Text style={styles.texto}>Planta 1 está com baixa umidade</Text>
                <Text style={styles.texto}>Planta 2 está com baixa temperatura</Text>
            </View>
            <View style={styles.infoArea}>
                <Text style={styles.texto}>Recomendações:</Text>
                <Text style={styles.texto}>Regue a planta 1 com mais frequência</Text>
                <Text style={styles.texto}>Exponha a planta 2 ao sol com mais frequência</Text>
            </View>
            </ScrollView>
        </View>
        
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.begeFundo,
    },
    titulo: {
        marginBottom: 30,
        fontSize: 30,
        fontFamily: "Inter",
        color: COLORS.verdeEscuro,
        marginTop: 50,
    },
    infoArea: {
        height: 400,
        width: 350,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginTop: 10
    },
    texto: {
        fontSize: 20,
        marginLeft: 5,
        marginTop: 10,
        color: COLORS.verdeMedio
    },
    scroll: {
    alignItems: "center",
    paddingBottom: 20, 
  },
});

export default Dashboard;
