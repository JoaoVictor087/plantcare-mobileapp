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
import { layout } from '../constants/themePalettes';
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
        <Text style={[styles.nome, { color: colors.text }]}>{planta.nome}</Text>
        <Text style={[styles.linha, { color: colors.textSecondary }]}>
          Umidade {planta.umidade}%
        </Text>
        <Text style={[styles.linha, { color: colors.textSecondary }]}>
          {planta.temperatura}ºC
        </Text>
        <Text style={[styles.linha, { color: colors.primary }]}>{planta.status}</Text>
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
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          android_ripple={{ color: colors.surfaceMuted }}
        >
          {content}
        </Pressable>
      ) : (
        content
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  /** Sem flex:1 — dentro de FlatList, flex:1 quebra o scroll (itens “lutam” pela altura). */
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: layout.spaceMd,
  },
  nome: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 16,
    paddingHorizontal: 12,
  },
  linha: {
    fontSize: 14,
    marginTop: 8,
    paddingHorizontal: 12,
  },
  infoArea: {
    height: 280,
    width: 340,
    borderRadius: layout.radiusMd,
    flexDirection: 'row',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTexto: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: 280,
    width: 150,
    borderTopRightRadius: layout.radiusMd,
    borderBottomRightRadius: layout.radiusMd,
  },
});

export default ContainerPlanta;
