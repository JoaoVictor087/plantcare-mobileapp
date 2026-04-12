import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

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
      <View>
        <Text style={[styles.texto, { color: colors.text }]}>PlantCare</Text>
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
  texto: {
    fontFamily: 'Inter',
    fontSize: 50,
    fontWeight: '100',
    textAlign: 'center',
    marginLeft: 30,
  },
});

export default Header;
