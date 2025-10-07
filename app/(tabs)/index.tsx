import React from "react";
import {View, Text, StyleSheet} from "react-native";
import COLORS from "../../constants/Colors";

const Index = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.texto}>Dashboard</Text>
            <View style={styles.infoArea}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.begeFundo,
    },
    texto: {
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
        borderRadius: 10
    },
});

export default Index;
