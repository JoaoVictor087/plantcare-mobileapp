import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  Switch,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { isSessaoAdmin, limparAuthData } from '../../utils/AuthStorageUtils';
import { MaterialIcons } from '@expo/vector-icons';

const Options = () => {
  const { colors, isDark, toggleMode } = useTheme();
  const [admin, setAdmin] = useState(false);

  useFocusEffect(
    useCallback(() => {
      isSessaoAdmin().then(setAdmin);
    }, [])
  );

  const logout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await limparAuthData();
            router.replace('/(auth)/login');
          } catch {
            Alert.alert('Erro', 'Não foi possível fazer logout.');
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons
        name="person-circle-outline"
        size={90}
        style={[styles.perfil, { color: colors.primary }]}
      />
      {admin ? (
        <View
          style={[
            styles.adminTag,
            { backgroundColor: colors.primary, borderColor: colors.border },
          ]}
        >
          <Text style={styles.adminTagTexto}>Sessão administrador (local)</Text>
        </View>
      ) : null}
      <Pressable>
        <Text style={[styles.editarPerfil, { color: colors.text }]}>Editar Perfil</Text>
      </Pressable>
      <View style={styles.secao}>
        <Text style={[styles.tituloTexto, { color: colors.text }]}>Aparência</Text>
        <View
          style={[
            styles.row,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={{ color: colors.text }}>Modo escuro</Text>
          <Switch value={isDark} onValueChange={toggleMode} />
        </View>
      </View>
      
      <View style={styles.secao}>
        <Text style={[styles.tituloTexto, { color: colors.text }]}>Aplicativo</Text>
        <TouchableOpacity
          style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push('/sobre')}
        >
          <Text style={{ color: colors.text }}>Sobre o PlantCare</Text>
          <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.secao}>
        <Text style={[styles.tituloTexto, { color: colors.text }]}>Conta</Text>
        <Pressable
          onPress={logout}
          style={[
            styles.botaoSair,
            { backgroundColor: '#c62828', borderColor: colors.border },
          ]}
        >
          <Text style={styles.textoSair}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  adminTag: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  adminTagTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  perfil: {
    marginTop: 20,
  },
  nomeIntegrante: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  editarPerfil: {
    marginTop: 8,
    marginBottom: 24,
  },
  secao: {
    width: '100%',
    marginBottom: 24,
  },
  tituloTexto: {
    fontSize: 22,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  botaoSair: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  textoSair: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Options;
