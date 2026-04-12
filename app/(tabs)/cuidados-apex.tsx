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
} from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ThemedCard } from '../../components/ThemedCard';
import { layout } from '../../constants/themePalettes';
import { useTheme } from '../../context/ThemeContext';
import {
  useAtualizarCuidadoApexMutation,
  useCriarCuidadoApexMutation,
  useCuidadosApexQuery,
  useExcluirCuidadoApexMutation,
} from '../../hooks/useCuidadosApex';
import type { CuidadoApex } from '../../types/CuidadoApex';
import { mensagemErroMutacao } from '../../utils/mutationErrors';

export default function CuidadosApexScreen() {
  const { colors } = useTheme();
  const {
    data: cuidados = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCuidadosApexQuery();
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
        onSuccess: () => setModalNovo(false),
        onError: (err) => {
          Alert.alert('Não enviado', mensagemErroMutacao(err));
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
        onSuccess: () => setModalEditar(null),
        onError: (err) => {
          Alert.alert('Não enviado', mensagemErroMutacao(err));
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
            onError: (err) => {
              Alert.alert('Não enviado', mensagemErroMutacao(err));
            },
          });
        },
      },
    ]);
  };

  const inputBase = [
    styles.input,
    {
      borderColor: colors.border,
      color: colors.text,
      backgroundColor: colors.surfaceMuted,
    },
  ];

  const renderItem = ({ item }: { item: CuidadoApex }) => (
    <ThemedCard style={styles.cardItem}>
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
          <Text style={{ color: colors.primary, fontWeight: '700' }}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmarExcluir(item)}>
          <Text style={{ color: '#c62828', fontWeight: '700' }}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </ThemedCard>
  );

  const formularioModal = (titulo: string, onSalvar: () => void, onFechar: () => void) => (
    <View style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]}>
      <ThemedCard style={styles.modalBox}>
        <Text style={[styles.modalTitulo, { color: colors.text }]}>{titulo}</Text>
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Oracle APEX (REST). Ajuste EXPO_PUBLIC_APEX_BASE_URL se necessário.
        </Text>
        <TextInput
          style={inputBase}
          placeholder="ID da planta (opcional)"
          placeholderTextColor={colors.textSecondary}
          value={plantaIdStr}
          onChangeText={setPlantaIdStr}
          keyboardType="number-pad"
        />
        <TextInput
          style={inputBase}
          placeholder="Tipo (rega, adubação…)"
          placeholderTextColor={colors.textSecondary}
          value={tipo}
          onChangeText={setTipo}
        />
        <TextInput
          style={[inputBase, styles.inputMultiline]}
          placeholder="Observações"
          placeholderTextColor={colors.textSecondary}
          value={obs}
          onChangeText={setObs}
          multiline
        />
        <View style={styles.modalBotoes}>
          <PrimaryButton
            title="Cancelar"
            variant="secondary"
            onPress={onFechar}
            style={styles.modalBtn}
          />
          <PrimaryButton
            title="Salvar"
            onPress={onSalvar}
            loading={criar.isPending || atualizar.isPending}
            disabled={criar.isPending || atualizar.isPending}
            style={styles.modalBtn}
          />
        </View>
      </ThemedCard>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>Cuidados (APEX)</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        Registros via API REST do Oracle APEX.
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
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Atualizar</Text>
          )}
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : isError ? (
        <ThemedCard style={styles.erroWrap}>
          <Text style={[styles.erro, { color: colors.textSecondary }]}>
            Falha ao carregar. {error instanceof Error ? error.message : ''}
          </Text>
        </ThemedCard>
      ) : (
        <FlatList
          data={cuidados}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={[styles.vazio, { color: colors.textSecondary }]}>
              Nenhum registro. Com internet, crie um novo ou confira o endpoint APEX.
            </Text>
          }
          contentContainerStyle={styles.listPad}
        />
      )}

      <Modal visible={modalNovo} animationType="fade" transparent>
        {formularioModal('Novo cuidado', confirmarCriar, () => setModalNovo(false))}
      </Modal>
      <Modal visible={!!modalEditar} animationType="fade" transparent>
        {formularioModal(
          'Editar cuidado',
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
    paddingHorizontal: layout.spaceMd,
  },
  titulo: {
    fontSize: 26,
    fontFamily: 'Inter',
    fontWeight: '800',
    marginTop: layout.spaceMd,
  },
  sub: {
    marginTop: 6,
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  botaoNovo: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: layout.radiusMd,
  },
  botaoNovoTexto: {
    color: '#fff',
    fontWeight: '800',
  },
  loader: {
    marginTop: 40,
  },
  erroWrap: {
    marginTop: 16,
  },
  erro: {
    textAlign: 'center',
    lineHeight: 20,
  },
  listPad: {
    paddingBottom: 32,
  },
  vazio: {
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 12,
    lineHeight: 20,
  },
  cardItem: {
    marginBottom: layout.spaceMd,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardLinha: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  cardAcoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 24,
    marginTop: 14,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: layout.spaceMd,
  },
  modalBox: {
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 17,
  },
  input: {
    borderWidth: 1,
    borderRadius: layout.radiusSm,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  inputMultiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
  },
});
