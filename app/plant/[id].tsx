import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
  Modal,
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
import {
  useAdicionarSensorMutation,
  useRemoverSensorMutation,
  useSensoresQuery,
} from '../../hooks/useSensores';
import type { TipoSensor } from '../../types/Sensor';
import { mensagemErroMutacao } from '../../utils/mutationErrors';

const TIPOS_SENSOR: TipoSensor[] = ['SENSOR_LUZ', 'SENSOR_UMIDADE', 'SENSOR_TEMPERATURA'];

const LABEL_SENSOR: Record<TipoSensor, string> = {
  SENSOR_LUZ: 'Luminosidade',
  SENSOR_UMIDADE: 'Umidade',
  SENSOR_TEMPERATURA: 'Temperatura',
};

const ICONE_SENSOR: Record<TipoSensor, keyof typeof MaterialIcons.glyphMap> = {
  SENSOR_LUZ: 'wb-sunny',
  SENSOR_UMIDADE: 'water-drop',
  SENSOR_TEMPERATURA: 'thermostat',
};

export default function PlantaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plantId = Number(Array.isArray(id) ? id[0] : id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const { data: planta, isLoading, isError, error } = usePlantaQuery(plantId);
  const atualizar = useAtualizarPlantaMutation();
  const excluir = useExcluirPlantaMutation();
  const { data: sensores = [], isLoading: loadingSensores } = useSensoresQuery(plantId);
  const adicionarSensor = useAdicionarSensorMutation(plantId);
  const removerSensor = useRemoverSensorMutation(plantId);

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [modalSensor, setModalSensor] = useState(false);
  const [tipoSensorSelecionado, setTipoSensorSelecionado] = useState<TipoSensor>('SENSOR_UMIDADE');

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
        onSuccess: () => Alert.alert('Salvo', 'Planta atualizada com sucesso.'),
        onError: (err) => Alert.alert('Erro', mensagemErroMutacao(err)),
      }
    );
  };

  const remover = () => {
    Alert.alert('Excluir planta', 'Esta ação não pode ser desfeita. Continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          excluir.mutate(plantId, {
            onSuccess: () => router.back(),
            onError: (err) => Alert.alert('Erro', mensagemErroMutacao(err)),
          }),
      },
    ]);
  };

  const confirmarAdicionarSensor = () => {
    const jaExiste = sensores.some((s) => s.tipoSensor === tipoSensorSelecionado);
    if (jaExiste) {
      Alert.alert('Atenção', 'Este tipo de sensor já está cadastrado para esta planta.');
      return;
    }
    adicionarSensor.mutate(
      { tipoSensor: tipoSensorSelecionado, id_planta: plantId },
      {
        onSuccess: () => {
          setModalSensor(false);
          Alert.alert('Sensor adicionado', `${LABEL_SENSOR[tipoSensorSelecionado]} cadastrado com sucesso.`);
        },
        onError: (err) => Alert.alert('Erro', mensagemErroMutacao(err)),
      }
    );
  };

  const confirmarRemoverSensor = (sensorId: number, tipo: TipoSensor) => {
    Alert.alert('Remover sensor', `Remover sensor de ${LABEL_SENSOR[tipo]}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () =>
          removerSensor.mutate(sensorId, {
            onError: (err) => Alert.alert('Erro', mensagemErroMutacao(err)),
          }),
      },
    ]);
  };

  const testarNotificacao = async () => {
  if (!planta) return;
  Alert.alert(
    '🌿 Hora de regar!',
    `Sua planta "${planta.nome}" precisa de água.`,
    [{ text: 'OK' }]
  );
};

  const busy = atualizar.isPending || excluir.isPending;

  const inputStyle = [
    styles.input,
    { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceMuted },
  ];

  if (isLoading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <TopBar insets={insets} colors={colors} onBack={() => router.back()} />
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </View>
    );
  }

  if (isError || !planta) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <TopBar insets={insets} colors={colors} onBack={() => router.back()} />
        <ThemedCard style={styles.erroCard}>
          <Text style={[styles.erro, { color: colors.textSecondary }]}>
            {error instanceof Error ? error.message : 'Não foi possível abrir esta planta.'}
          </Text>
        </ThemedCard>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <TopBar insets={insets} colors={colors} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <ThemedCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="sensors" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Monitoramento</Text>
          </View>
          <View style={styles.metricsRow}>
            <MetricCard
              icon="water-drop"
              label="Umidade"
              value={`${planta.umidade.toFixed(1)}%`}
              color={colors.primary}
              colors={colors}
            />
            <MetricCard
              icon="thermostat"
              label="Temperatura"
              value={`${planta.temperatura.toFixed(1)}°C`}
              color="#e57373"
              colors={colors}
            />
            <MetricCard
              icon="wb-sunny"
              label="Luminosidade"
              value={`${planta.luminosidade.toFixed(1)} lx`}
              color="#ffb300"
              colors={colors}
            />
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.surfaceMuted }]}>
            <MaterialIcons name="info-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {planta.status}
            </Text>
          </View>
        </ThemedCard>

        <ThemedCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="memory" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sensores</Text>
            <TouchableOpacity
              style={[styles.btnAddSensor, { backgroundColor: colors.primary }]}
              onPress={() => setModalSensor(true)}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.btnAddSensorTxt}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {loadingSensores ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 8 }} />
          ) : sensores.length === 0 ? (
            <Text style={[styles.semSensores, { color: colors.textSecondary }]}>
              Nenhum sensor cadastrado. Adicione para iniciar o monitoramento.
            </Text>
          ) : (
            sensores.map((s) => (
              <View
                key={s.id}
                style={[styles.sensorItem, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}
              >
                <MaterialIcons
                  name={ICONE_SENSOR[s.tipoSensor] ?? 'sensors'}
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.sensorLabel, { color: colors.text }]}>
                  {LABEL_SENSOR[s.tipoSensor] ?? s.tipoSensor}
                </Text>
                <TouchableOpacity
                  onPress={() => confirmarRemoverSensor(s.id, s.tipoSensor)}
                  disabled={removerSensor.isPending}
                  style={styles.sensorRemove}
                >
                  <Ionicons name="trash-outline" size={18} color="#c62828" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ThemedCard>

        <ThemedCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="edit" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Editar planta</Text>
          </View>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Nome</Text>
          <TextInput style={inputStyle} value={nome} onChangeText={setNome} />
          <Text style={[styles.label, { color: colors.textSecondary }]}>Espécie</Text>
          <TextInput style={inputStyle} value={especie} onChangeText={setEspecie} />
          <PrimaryButton
            title={atualizar.isPending ? 'Salvando…' : 'Salvar alterações'}
            onPress={salvar}
            loading={atualizar.isPending}
            disabled={busy}
            style={styles.btn}
          />
        </ThemedCard>

        <ThemedCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="notifications-active" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Lembretes</Text>
          </View>
          <Text style={[styles.helpText, { color: colors.textSecondary }]}>
            Receba um lembrete diário para regar esta planta.
          </Text>
          <PrimaryButton
            title="Testar notificação agora"
            onPress={testarNotificacao}
            style={styles.btn}
          />
        </ThemedCard>

        <ThemedCard style={styles.section}>
          <PrimaryButton
            title={excluir.isPending ? 'Removendo…' : 'Excluir planta'}
            variant="danger"
            onPress={remover}
            loading={excluir.isPending}
            disabled={busy}
          />
        </ThemedCard>

      </ScrollView>

      <Modal visible={modalSensor} transparent animationType="fade">
        <View style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]}>
          <ThemedCard style={styles.modalBox}>
            <Text style={[styles.modalTitulo, { color: colors.text }]}>Adicionar sensor</Text>
            <Text style={[styles.helpText, { color: colors.textSecondary }]}>
              Selecione o tipo de sensor a cadastrar nesta planta.
            </Text>
            {TIPOS_SENSOR.map((tipo) => {
              const selecionado = tipoSensorSelecionado === tipo;
              const jaExiste = sensores.some((s) => s.tipoSensor === tipo);
              return (
                <TouchableOpacity
                  key={tipo}
                  onPress={() => !jaExiste && setTipoSensorSelecionado(tipo)}
                  style={[
                    styles.sensorOpcao,
                    {
                      borderColor: selecionado ? colors.primary : colors.border,
                      backgroundColor: selecionado ? colors.primary + '18' : colors.surfaceMuted,
                      opacity: jaExiste ? 0.4 : 1,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={ICONE_SENSOR[tipo]}
                    size={22}
                    color={selecionado ? colors.primary : colors.textSecondary}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.sensorOpcaoLabel, { color: colors.text }]}>
                      {LABEL_SENSOR[tipo]}
                    </Text>
                    {jaExiste && (
                      <Text style={[styles.sensorOpcaoSub, { color: colors.textSecondary }]}>
                        Já cadastrado
                      </Text>
                    )}
                  </View>
                  {selecionado && !jaExiste && (
                    <MaterialIcons name="check-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
            <View style={styles.modalBotoes}>
              <PrimaryButton
                title="Cancelar"
                variant="secondary"
                onPress={() => setModalSensor(false)}
                style={{ flex: 1 }}
              />
              <PrimaryButton
                title={adicionarSensor.isPending ? 'Salvando…' : 'Confirmar'}
                onPress={confirmarAdicionarSensor}
                loading={adicionarSensor.isPending}
                style={{ flex: 1 }}
              />
            </View>
          </ThemedCard>
        </View>
      </Modal>
    </View>
  );
}


function TopBar({
  insets,
  colors,
  onBack,
}: {
  insets: ReturnType<typeof useSafeAreaInsets>;
  colors: any;
  onBack: () => void;
}) {
  return (
    <View
      style={[
        topBarStyles.bar,
        {
          paddingTop: insets.top + 8,
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity onPress={onBack} style={topBarStyles.backBtn}>
        <Ionicons name="arrow-back" size={26} color={colors.text} />
      </TouchableOpacity>
      <Text style={[topBarStyles.title, { color: colors.text }]}>Detalhes da planta</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const topBarStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
});

function MetricCard({
  icon,
  label,
  value,
  color,
  colors,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  color: string;
  colors: any;
}) {
  return (
    <View style={[metricStyles.card, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
      <MaterialIcons name={icon} size={24} color={color} />
      <Text style={[metricStyles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[metricStyles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const metricStyles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  value: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  label: { fontSize: 11, marginTop: 2 },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  loader: { marginTop: 48 },
  erroCard: { margin: layout.spaceMd, marginTop: 24 },
  erro: { textAlign: 'center', lineHeight: 22 },
  scroll: { padding: layout.spaceMd, paddingBottom: 48 },
  section: { marginBottom: layout.spaceMd },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  metricsRow: { flexDirection: 'row', gap: 4, marginBottom: 12 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: { fontSize: 12 },
  semSensores: { fontSize: 13, lineHeight: 20 },
  sensorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  sensorLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  sensorRemove: { padding: 4 },
  btnAddSensor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnAddSensorTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
  label: { marginBottom: 6, marginTop: 10, fontWeight: '600', fontSize: 13 },
  input: {
    borderWidth: 1,
    borderRadius: layout.radiusSm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  btn: { marginTop: layout.spaceMd },
  helpText: { fontSize: 13, lineHeight: 20, marginBottom: 10 },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: layout.spaceMd },
  modalBox: { maxWidth: 420, alignSelf: 'center', width: '100%' },
  modalTitulo: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  sensorOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  sensorOpcaoLabel: { fontSize: 15, fontWeight: '600' },
  sensorOpcaoSub: { fontSize: 11, marginTop: 2 },
  modalBotoes: { flexDirection: 'row', gap: 12, marginTop: 12 },
});
