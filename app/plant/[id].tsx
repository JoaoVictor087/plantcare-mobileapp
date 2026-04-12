import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import {
  useAtualizarPlantaMutation,
  useExcluirPlantaMutation,
  usePlantaQuery,
} from '../../hooks/usePlantas';

export default function PlantaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plantId = Number(Array.isArray(id) ? id[0] : id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const { data: planta, isLoading, isError, error } = usePlantaQuery(plantId);
  const atualizar = useAtualizarPlantaMutation();
  const excluir = useExcluirPlantaMutation();

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');

  useEffect(() => {
    if (planta) {
      setNome(planta.nome);
      setEspecie(planta.especie);
    }
  }, [planta]);

  const salvar = () => {
    if (!nome.trim() || !especie.trim()) {
      Alert.alert('Validação', 'Preencha nome e espécie.');
      return;
    }
    atualizar.mutate(
      { id: plantId, payload: { nome: nome.trim(), especie: especie.trim() } },
      {
        onSuccess: () => {
          Alert.alert('Sucesso', 'Planta atualizada.');
        },
        onError: () => {
          Alert.alert('Erro', 'Não foi possível atualizar.');
        },
      }
    );
  };

  const remover = () => {
    Alert.alert(
      'Excluir planta',
      'Esta ação não pode ser desfeita. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            excluir.mutate(plantId, {
              onSuccess: () => {
                router.back();
              },
              onError: () => {
                Alert.alert('Erro', 'Não foi possível excluir.');
              },
            });
          },
        },
      ]
    );
  };

  const busy = atualizar.isPending || excluir.isPending;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.text }]}>Detalhe da planta</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : isError ? (
        <Text style={[styles.erro, { color: colors.textSecondary }]}>
          {error instanceof Error ? error.message : 'Erro ao carregar'}
        </Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.label, { color: colors.textSecondary }]}>Nome</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.surface,
              },
            ]}
            value={nome}
            onChangeText={setNome}
          />
          <Text style={[styles.label, { color: colors.textSecondary }]}>Espécie</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.surface,
              },
            ]}
            value={especie}
            onChangeText={setEspecie}
          />
          {planta ? (
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              Status: {planta.status} · Umidade {planta.umidade}% · Temp.{' '}
              {planta.temperatura}ºC
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.botaoPrimario,
              { backgroundColor: colors.primary, opacity: busy ? 0.7 : 1 },
            ]}
            onPress={salvar}
            disabled={busy}
          >
            {atualizar.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Salvar alterações</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoPerigo, { opacity: busy ? 0.7 : 1 }]}
            onPress={remover}
            disabled={busy}
          >
            {excluir.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Excluir planta</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  loader: {
    marginTop: 48,
  },
  erro: {
    marginTop: 24,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  meta: {
    marginTop: 16,
    fontSize: 14,
  },
  botaoPrimario: {
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoPerigo: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#b71c1c',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
