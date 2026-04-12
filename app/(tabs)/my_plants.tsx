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
  Button,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ContainerPlanta from '../../components/ContainerPlanta';
import { useTheme } from '../../context/ThemeContext';
import {
  useCriarPlantaMutation,
  usePlantasQuery,
} from '../../hooks/usePlantas';

const MyPlants = () => {
  const { colors } = useTheme();
  const { data: plantas = [], isLoading, isError, error } = usePlantasQuery();
  const criarPlanta = useCriarPlantaMutation();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [novaPlantaNome, setNovaPlantaNome] = useState('');
  const [novaPlantaEspecie, setNovaPlantaEspecie] = useState('');

  const salvarPlanta = () => {
    if (!novaPlantaNome.trim() || !novaPlantaEspecie.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o nome e a espécie.');
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
        onError: () => {
          Alert.alert('Erro', 'Não foi possível salvar a planta.');
        },
      }
    );
  };

  const componenteVazio = () => (
    <View style={styles.containerVazio}>
      <Text style={[styles.containerVazioTexto, { color: colors.textSecondary }]}>
        Você ainda não cadastrou nenhuma planta
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.textoTitulo, { color: colors.text }]}>
        Minhas Plantas
      </Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : isError ? (
        <Text style={[styles.erro, { color: colors.textSecondary }]}>
          Erro ao carregar plantas. {error instanceof Error ? error.message : ''}
        </Text>
      ) : (
        <FlatList
          data={plantas}
          keyExtractor={(item) => item.id.toString()}
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
      <TouchableOpacity onPress={() => setModalVisivel(true)}>
        <Ionicons name="add-circle" size={64} style={[styles.add, { color: colors.primaryDark }]} />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.modalTitulo, { color: colors.text }]}>
              Adicionar Nova Planta
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Nome da Planta (ex: Samambaia)"
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
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Espécie (ex: Nephrolepis exaltata)"
              placeholderTextColor={colors.textSecondary}
              value={novaPlantaEspecie}
              onChangeText={setNovaPlantaEspecie}
            />
            {criarPlanta.isPending ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
            ) : null}
            <View style={styles.modalBotoes}>
              <Button title="Cancelar" onPress={() => setModalVisivel(false)} color="red" />
              <Button
                title={criarPlanta.isPending ? 'Salvando...' : 'Salvar'}
                onPress={salvarPlanta}
                disabled={criarPlanta.isPending}
              />
            </View>
          </View>
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
    marginBottom: 16,
    fontSize: 30,
    fontFamily: 'Inter',
    marginTop: 20,
  },
  containerVazio: {
    marginTop: 50,
    alignItems: 'center',
  },
  containerVazioTexto: {
    fontSize: 16,
  },
  add: {
    position: 'absolute',
    bottom: 30,
    right: -30,
    shadowColor: '#000',
  },
  loader: {
    marginTop: 50,
  },
  erro: {
    marginTop: 24,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
});

export default MyPlants;
