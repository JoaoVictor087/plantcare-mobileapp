import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../constants/themePalettes';

/** Indica que a lista veio do armazenamento local (API indisponível). */
export function CacheHintRow() {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.warningMuted, borderColor: colors.warning },
      ]}
    >
      <MaterialIcons name="cloud-off" size={16} color={colors.warning} />
      <Text style={[styles.txt, { color: colors.warning }]}>
        Última cópia salva neste aparelho — reconecte para atualizar.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: layout.spaceMd,
    marginBottom: layout.spaceSm,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: layout.radiusSm,
    borderWidth: 1,
  },
  txt: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});
