import { MaterialIcons } from '@expo/vector-icons';
import { useNetworkState } from 'expo-network';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../constants/themePalettes';

export function OfflineBanner() {
  const { colors } = useTheme();
  const net = useNetworkState();

  const semRede =
    net.isConnected === false || net.isInternetReachable === false;

  if (!semRede) return null;

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.warningMuted,
          borderBottomColor: colors.warning,
        },
      ]}
    >
      <MaterialIcons name="wifi-off" size={18} color={colors.warning} />
      <Text style={[styles.txt, { color: colors.warning }]}>
        Sem conexão — leituras podem usar dados salvos no aparelho.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: layout.spaceMd,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  txt: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
});
