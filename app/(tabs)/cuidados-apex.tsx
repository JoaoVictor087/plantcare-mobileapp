import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Button,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import {
  useAtualizarCuidadoApexMutation,
  useCriarCuidadoApexMutation,
  useCuidadosApexQuery,
  useExcluirCuidadoApexMutation,
} from '../../hooks/useCuidadosApex';
import type { CuidadoApex } from '../../types/CuidadoApex';

export default function CuidadosApexScreen() {
  const { colors } = useTheme();
  const { data: cuidados = [], isLoading, isError, error, refetch, isFetching } =
    useCuidadosApexQuery();
  const criar = useCriarCuidadoApexMutation();
  const atualizar = useAtualizarCuidadoApexMutation();
  const excluir = useExcluirCuidadoApexMutation();

  const [modalNovo, setModalNovo] = useState(false);
  const [modalEditar, setModalEditar] = useState<CuidadoApex | null>(null);
  const [plantaIdStr, setPlantaIdStr] = useState('');
  const [tipo, setTipo] = useState('');
  const [obs, setObs] = useState('');

  const abrirNovo = () => {
    setPlantaIdStr('');
    setTipo('');
    setObs('');
    setModalNovo(true);
  };

  const abrirEditar = (c: CuidadoApex) => {
    setModalEditar(c);
    setPlantaIdStr(c.plantaId != null ? String(c.plantaId) : '');
    setTipo(c.tipoCuidado);
    setObs(c.observacao);
  };

  const plantaIdNumero = (): number | null => {
    const t = plantaIdStr.trim();
    if (t === '') return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  };

  const confirmarCriar = () => {
    criar.mutate(
      {
        plantaId: plantaIdNumero(),
        tipoCuidado: tipo.trim(),
        observacao: obs.trim(),
      },
      {
        onSuccess: () => {
          setModalNovo(false);
        },
        onError: () => {
          Alert.alert(
            'Erro',
            'Não foi possível criar o registro. Verifique a URL do APEX (EXPO_PUBLIC_APEX_BASE_URL) e a API ORDS.'
          );
        },
      }
    );
  };

  const confirmarEditar = () => {
    if (!modalEditar) return;
    atualizar.mutate(
      {
        id: modalEditar.id,
        payload: {
          plantaId: plantaIdNumero(),
          tipoCuidado: tipo.trim(),
          observacao: obs.trim(),
        },
      },
      {
        onSuccess: () => {
          setModalEditar(null);
        },
        onError: () => {
          Alert.alert('Erro', 'Não foi possível atualizar o registro no APEX.');
        },
      }
    );
  };

  const confirmarExcluir = (c: CuidadoApex) => {
    Alert.alert('Excluir', 'Remover este registro de cuidado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          excluir.mutate(c.id, {
            onError: () => {
              Alert.alert('Erro', 'Não foi possível excluir via API APEX.');
            },
          });
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: CuidadoApex }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.cardTitulo, { color: colors.text }]}>
        {item.tipoCuidado || '(sem tipo)'}
      </Text>
      <Text style={[styles.cardLinha, { color: colors.textSecondary }]}>
        Planta ID: {item.plantaId ?? '—'}
      </Text>
      <Text style={[styles.cardLinha, { color: colors.textSecondary }]}>
        {item.observacao || '—'}
      </Text>
      {item.dataHora ? (
        <Text style={[styles.cardLinha, { color: colors.textSecondary }]}>
          {item.dataHora}
        </Text>
      ) : null}
      <View style={styles.cardAcoes}>
        <TouchableOpacity onPress={() => abrirEditar(item)}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmarExcluir(item)}>
          <Text style={{ color: '#c62828', fontWeight: '600' }}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const formularioModal = (titulo: string, onSalvar: () => void, onFechar: () => void) => (
    <View style={styles.modalBackdrop}>
      <View
        style={[
          styles.modalBox,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.modalTitulo, { color: colors.text }]}>{titulo}</Text>
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Dados processados no Oracle APEX (REST). ID da planta opcional se a regra no APEX permitir.
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
          placeholder="ID da planta (número)"
          placeholderTextColor={colors.textSecondary}
          value={plantaIdStr}
          onChangeText={setPlantaIdStr}
          keyboardType="number-pad"
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
          placeholder="Tipo de cuidado (ex: Rega, Adubação)"
          placeholderTextColor={colors.textSecondary}
          value={tipo}
          onChangeText={setTipo}
        />
        <TextInput
          style={[
            styles.input,
            styles.inputMultiline,
            {
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.background,
            },
          ]}
          placeholder="Observações"
          placeholderTextColor={colors.textSecondary}
          value={obs}
          onChangeText={setObs}
          multiline
        />
        {(criar.isPending || atualizar.isPending) && (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 8 }} />
        )}
        <View style={styles.modalBotoes}>
          <Button title="Cancelar" onPress={onFechar} color="#666" />
          <Button
            title="Salvar"
            onPress={onSalvar}
            disabled={criar.isPending || atualizar.isPending}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>Cuidados (Oracle APEX)</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        CRUD via API REST exposta pelo APEX. Lista e alterações vêm do backend.
      </Text>
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.botaoNovo, { backgroundColor: colors.primary }]}
          onPress={abrirNovo}
        >
          <Text style={styles.botaoNovoTexto}>Novo cuidado</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => refetch()} disabled={isFetching}>
          {isFetching ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Atualizar</Text>
          )}
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : isError ? (
        <Text style={[styles.erro, { color: colors.textSecondary }]}>
          Falha ao carregar a API APEX. {error instanceof Error ? error.message : ''}
        </Text>
      ) : (
        <FlatList
          data={cuidados}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={[styles.vazio, { color: colors.textSecondary }]}>
              Nenhum registro retornado pela API. Crie um novo ou confira o endpoint.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}

      <Modal visible={modalNovo} animationType="slide" transparent>
        {formularioModal(
          'Novo cuidado (APEX)',
          confirmarCriar,
          () => setModalNovo(false)
        )}
      </Modal>
      <Modal visible={!!modalEditar} animationType="slide" transparent>
        {formularioModal(
          'Editar cuidado (APEX)',
          confirmarEditar,
          () => setModalEditar(null)
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titulo: {
    fontSize: 26,
    fontFamily: 'Inter',
    marginTop: 16,
  },
  sub: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  botaoNovo: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  botaoNovoTexto: {
    color: '#fff',
    fontWeight: '700',
  },
  loader: {
    marginTop: 40,
  },
  erro: {
    marginTop: 16,
    textAlign: 'center',
  },
  vazio: {
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 12,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardLinha: {
    fontSize: 14,
    marginTop: 2,
  },
  cardAcoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    marginTop: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalBox: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
