import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import ContainerPlanta from '../../components/ContainerPlanta';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ThemedCard } from '../../components/ThemedCard';
import { layout } from '../../constants/themePalettes';
import { useTheme } from '../../context/ThemeContext';
import {
  useCriarPlantaMutation,
  usePlantasQuery,
} from '../../hooks/usePlantas';
import { mensagemErroMutacao } from '../../utils/mutationErrors';

const MyPlants = () => {
  const { colors } = useTheme();
  const { data: plantas = [], isLoading, isError, error } = usePlantasQuery();
  const criarPlanta = useCriarPlantaMutation();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [novaPlantaNome, setNovaPlantaNome] = useState('');
  const [novaPlantaEspecie, setNovaPlantaEspecie] = useState('');

  const salvarPlanta = () => {
    if (!novaPlantaNome.trim() || !novaPlantaEspecie.trim()) {
      Alert.alert('Atenção', 'Preencha o nome e a espécie da planta.');
      return;
    }

    criarPlanta.mutate(
      { nome: novaPlantaNome.trim(), especie: novaPlantaEspecie.trim() },
      {
        onSuccess: () => {
          setModalVisivel(false);
          setNovaPlantaNome('');
          setNovaPlantaEspecie('');
        },
        onError: (err) => {
          Alert.alert('Não enviado', mensagemErroMutacao(err));
        },
      }
    );
  };

  const componenteVazio = () => (
    <ThemedCard style={styles.vazioCard}>
      <Ionicons name="leaf-outline" size={48} color={colors.textSecondary} />
      <Text style={[styles.vazioTitulo, { color: colors.text }]}>
        Nenhuma planta ainda
      </Text>
      <Text style={[styles.vazioTxt, { color: colors.textSecondary }]}>
        Toque no + para cadastrar quando estiver online, ou aguarde dados em
        cache se já usou o app antes.
      </Text>
    </ThemedCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.textoTitulo, { color: colors.text }]}>
        Minhas plantas
      </Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : isError ? (
        <ThemedCard style={styles.erroBox}>
          <Text style={[styles.erroTxt, { color: colors.textSecondary }]}>
            Não foi possível carregar. {error instanceof Error ? error.message : ''}
          </Text>
        </ThemedCard>
      ) : (
        <FlatList
          data={plantas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ContainerPlanta
              planta={item}
              onPress={() =>
                router.push({
                  pathname: '/plant/[id]',
                  params: { id: String(item.id) },
                })
              }
            />
          )}
          ListEmptyComponent={componenteVazio}
        />
      )}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisivel(true)}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]}>
          <ThemedCard style={styles.modalCard}>
            <Text style={[styles.modalTitulo, { color: colors.text }]}>
              Nova planta
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.surfaceMuted,
                },
              ]}
              placeholder="Nome (ex: Samambaia)"
              placeholderTextColor={colors.textSecondary}
              value={novaPlantaNome}
              onChangeText={setNovaPlantaNome}
            />
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.surfaceMuted,
                },
              ]}
              placeholder="Espécie científica"
              placeholderTextColor={colors.textSecondary}
              value={novaPlantaEspecie}
              onChangeText={setNovaPlantaEspecie}
            />
            <View style={styles.modalActions}>
              <PrimaryButton
                title="Cancelar"
                variant="secondary"
                onPress={() => setModalVisivel(false)}
                style={styles.btnHalf}
              />
              <PrimaryButton
                title={criarPlanta.isPending ? 'Salvando…' : 'Salvar'}
                onPress={salvarPlanta}
                loading={criarPlanta.isPending}
                style={styles.btnHalf}
              />
            </View>
          </ThemedCard>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textoTitulo: {
    marginBottom: 8,
    fontSize: 28,
    fontFamily: 'Inter',
    fontWeight: '800',
    marginTop: layout.spaceMd,
  },
  listContent: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  loader: {
    marginTop: 50,
  },
  erroBox: {
    marginHorizontal: layout.spaceMd,
    marginTop: 16,
  },
  erroTxt: {
    textAlign: 'center',
    lineHeight: 20,
  },
  vazioCard: {
    marginTop: 24,
    alignItems: 'center',
  },
  vazioTitulo: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
  },
  vazioTxt: {
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: layout.spaceMd,
  },
  modalCard: {
    maxWidth: 400,
    alignSelf: 'center',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: layout.spaceMd,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: layout.radiusSm,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  btnHalf: {
    flex: 1,
  },
});

export default MyPlants;
