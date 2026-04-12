import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { isSessaoAdmin } from '../utils/AuthStorageUtils';

const Header = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [admin, setAdmin] = useState(false);

  useFocusEffect(
    useCallback(() => {
      isSessaoAdmin().then(setAdmin);
    }, [])
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View>
        <Image
          style={styles.image}
          source={require('../assets/Logo_PlantCare 1.png')}
        />
      </View>
      <View style={styles.tituloArea}>
        <Text style={[styles.texto, { color: colors.text }]}>PlantCare</Text>
        {admin ? (
          <View style={[styles.pill, { backgroundColor: colors.primaryDark }]}>
            <Text style={styles.pillTexto}>Admin</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 10,
  },
  image: {
    width: 60,
    height: 60,
    marginLeft: 20,
  },
  tituloArea: {
    marginLeft: 30,
    flex: 1,
  },
  texto: {
    fontFamily: 'Inter',
    fontSize: 50,
    fontWeight: '100',
  },
  pill: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default Header;
