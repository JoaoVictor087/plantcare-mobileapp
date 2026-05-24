import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { layout } from '../constants/themePalettes';
import type { Planta } from '../types/Planta';

import { useTheme } from '../context/ThemeContext';

import { useDiagnosticoQuery } from '../hooks/useDiagnostico';
import { useSaudometroQuery } from '../hooks/useSaudometro';

interface ContainerPlantaProps {
  planta: Planta;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const ContainerPlanta = ({
  planta,
  onPress,
  style,
}: ContainerPlantaProps) => {
  const { colors } = useTheme();

  const {
    data: diagnostico,
    isLoading: loadingDiag,
  } = useDiagnosticoQuery(planta.id);

  const { data: saude } = useSaudometroQuery(planta.id);

  const corScore = (score: number) => {
    if (score >= 70) return '#4caf50';
    if (score >= 40) return '#ff9800';
    return '#f44336';
  };

  const content = (
    <View
      style={[
        styles.infoArea,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.infoTexto}>
        <Text
          style={[
            styles.nome,
            { color: colors.text },
          ]}
        >
          {planta.nome}
        </Text>

        <Text
          style={[
            styles.linha,
            { color: colors.textSecondary },
          ]}
        >
          Umidade {planta.umidade}%
        </Text>

        <Text
          style={[
            styles.linha,
            { color: colors.textSecondary },
          ]}
        >
          {planta.temperatura}ºC
        </Text>

        <Text
          style={[
            styles.linha,
            { color: colors.primary },
          ]}
        >
          {planta.status}
        </Text>

        {/* DIAGNÓSTICO IA */}
        <View style={styles.diagArea}>
          {loadingDiag ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={{ marginTop: 6 }}
            />
          ) : diagnostico?.diagnostico ? (
            <View style={styles.diagRow}>
              <MaterialIcons
                name="psychology"
                size={13}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.diagTexto,
                  { color: colors.textSecondary },
                ]}
                numberOfLines={3}
              >
                {diagnostico.diagnostico}
              </Text>
            </View>
          ) : null}
        </View>

        {/* SAUDÔMETRO */}
        {saude && (
          <View style={styles.saudometroArea}>
            <View style={styles.saudometroHeader}>
              <MaterialIcons
                name="favorite"
                size={12}
                color={corScore(saude.saudometro)}
              />

              <Text
                style={[
                  styles.saudometroLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Saudômetro
              </Text>

              <Text
                style={[
                  styles.saudometroScore,
                  {
                    color: corScore(saude.saudometro),
                  },
                ]}
              >
                {saude.saudometro}%
              </Text>
            </View>

            <View
              style={[
                styles.saudometroBarBg,
                {
                  backgroundColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.saudometroBarFill,
                  {
                    width: `${saude.saudometro}%`,
                    backgroundColor: corScore(
                      saude.saudometro
                    ),
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.insightTexto,
                { color: colors.textSecondary },
              ]}
              numberOfLines={2}
            >
              {saude.insight}
            </Text>
          </View>
        )}
      </View>

      <Image
        style={styles.image}
        source={require('../assets/planta.jpg')}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      {onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          android_ripple={{
            color: colors.surfaceMuted,
          }}
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 2,
  },

  infoTexto: {
    flex: 1,
  },

  image: {
    height: 280,
    width: 150,
    borderTopRightRadius: layout.radiusMd,
    borderBottomRightRadius: layout.radiusMd,
  },

  diagArea: {
    marginTop: 6,
    paddingHorizontal: 12,
  },

  diagRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },

  diagTexto: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
    fontStyle: 'italic',
  },

  saudometroArea: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    marginTop: 10,
  },

  saudometroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },

  saudometroLabel: {
    fontSize: 10,
    flex: 1,
  },

  saudometroScore: {
    fontSize: 11,
    fontWeight: '800',
  },

  saudometroBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },

  saudometroBarFill: {
    height: 6,
    borderRadius: 3,
  },

  insightTexto: {
    fontSize: 10,
    marginTop: 6,
    fontStyle: 'italic',
    lineHeight: 14,
  },
});

export default ContainerPlanta;