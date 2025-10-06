import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from "../../components/header";

const Index = () => {
  return (
    <View style={styles.container}>
      <Text>Página 2345</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});

export default Index;