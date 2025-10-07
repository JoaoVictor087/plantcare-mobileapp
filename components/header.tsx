import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import COLORS from "../constants/Colors";

const Header = () => {
    const insets = useSafeAreaInsets();
  return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
            <View>
                <Image style={styles.image} source={require("../assets/Logo_PlantCare 1.png")}></Image>
            </View>
            <View>
                <Text style={styles.texto}>PlantCare</Text>
            </View>
        </View>
  );
};

const styles = StyleSheet.create({
    container:{
        flexDirection: "row",
        backgroundColor: COLORS.begeFundo,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: 10,
        position: "relative"
    },
    image:{
        width: 60,
        height: 60,
        marginLeft: 20,
    },
    texto:{
        fontFamily: "Inter",
        fontSize: 50,
        fontWeight: 100,
        textAlign: "center",
        marginLeft: 30,
        color: COLORS.verdeEscuro,
    }
});

export default Header;