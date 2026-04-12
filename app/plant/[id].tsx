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
import { PrimaryButton } from '../../components/PrimaryButton';
import { ThemedCard } from '../../components/ThemedCard';
import { layout } from '../../constants/themePalettes';
import { useTheme } from '../../context/ThemeContext';
import {
  useAtualizarPlantaMutation,
  useExcluirPlantaMutation,
  usePlantaQuery,
} from '../../hooks/usePlantas';
import { mensagemErroMutacao } from '../../utils/mutationErrors';

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
          Alert.alert('Salvo', 'Planta atualizada no servidor.');
        },
        onError: (err) => {
          Alert.alert('Não enviado', mensagemErroMutacao(err));
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
              onError: (err) => {
                Alert.alert('Não enviado', mensagemErroMutacao(err));
              },
            });
          },
        },
      ]
    );
  };

  const busy = atualizar.isPending || excluir.isPending;

  const inputStyle = [
    styles.input,
    {
      borderColor: colors.border,
      color: colors.text,
      backgroundColor: colors.surfaceMuted,
    },
  ];

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
        <Text style={[styles.topTitle, { color: colors.text }]}>Detalhe</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : isError ? (
        <ThemedCard style={styles.erroCard}>
          <Text style={[styles.erro, { color: colors.textSecondary }]}>
            {error instanceof Error ? error.message : 'Não foi possível abrir esta planta.'}
          </Text>
        </ThemedCard>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedCard>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Nome</Text>
            <TextInput style={inputStyle} value={nome} onChangeText={setNome} />
            <Text style={[styles.label, { color: colors.textSecondary }]}>Espécie</Text>
            <TextInput style={inputStyle} value={especie} onChangeText={setEspecie} />
            {planta ? (
              <Text style={[styles.meta, { color: colors.textSecondary }]}>
                {planta.status} · Umidade {planta.umidade}% · {planta.temperatura}ºC
              </Text>
            ) : null}
            <PrimaryButton
              title={atualizar.isPending ? 'Salvando…' : 'Salvar alterações'}
              onPress={salvar}
              loading={atualizar.isPending}
              disabled={busy}
              style={styles.btn}
            />
            <PrimaryButton
              title={excluir.isPending ? 'Removendo…' : 'Excluir planta'}
              variant="danger"
              onPress={remover}
              loading={excluir.isPending}
              disabled={busy}
              style={styles.btnDanger}
            />
          </ThemedCard>
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
    fontWeight: '700',
  },
  loader: {
    marginTop: 48,
  },
  erroCard: {
    margin: layout.spaceMd,
    marginTop: 24,
  },
  erro: {
    textAlign: 'center',
    lineHeight: 22,
  },
  scroll: {
    padding: layout.spaceMd,
    paddingBottom: 40,
  },
  label: {
    marginBottom: 6,
    marginTop: 10,
    fontWeight: '600',
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderRadius: layout.radiusSm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  meta: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 20,
  },
  btn: {
    marginTop: layout.spaceMd,
  },
  btnDanger: {
    marginTop: 12,
  },
});
