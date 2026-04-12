import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { Planta } from '../types/Planta';
import { useTheme } from '../context/ThemeContext';

interface ContainerPlantaProps {
  planta: Planta;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const ContainerPlanta = ({ planta, onPress, style }: ContainerPlantaProps) => {
  const { colors } = useTheme();

  const content = (
    <View
      style={[
        styles.infoArea,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.infoTexto}>
        <Text style={[styles.titulo, { color: colors.primary }]}>
          {planta.nome}
        </Text>
        <Text style={[styles.titulo, { color: colors.textSecondary }]}>
          Umidade: {planta.umidade} %
        </Text>
        <Text style={[styles.titulo, { color: colors.textSecondary }]}>
          Temperatura: {planta.temperatura}Cº
        </Text>
        <Text style={[styles.titulo, { color: colors.textSecondary }]}>
          Status: {planta.status}
        </Text>
      </View>
      <Image
        style={styles.image}
        source={require('../assets/planta.jpg')}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      {onPress ? (
        <Pressable onPress={onPress} accessibilityRole="button">
          {content}
        </Pressable>
      ) : (
        content
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    marginTop: 30,
  },
  infoArea: {
    height: 300,
    width: 350,
    borderRadius: 10,
    flexDirection: 'row',
    borderWidth: 1,
  },
  infoTexto: {
    alignContent: 'center',
  },
  image: {
    height: 300,
    width: 170,
    borderRadius: 10,
    marginLeft: 18,
  },
});

export default ContainerPlanta;
