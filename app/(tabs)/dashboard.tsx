import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { CacheHintRow } from '../../components/CacheHintRow';
import { ThemedCard } from '../../components/ThemedCard';
import { layout } from '../../constants/themePalettes';
import { useTheme } from '../../context/ThemeContext';
import { usePlantasQuery } from '../../hooks/usePlantas';

const Dashboard = () => {
  const { colors } = useTheme();
  const { data: plantas, isLoading, isError, error, dataSource } =
    usePlantasQuery();

  const alertas =
    plantas?.filter(
      (p) =>
        (p.umidade ?? 0) < 30 ||
        (p.temperatura ?? 0) < 15 ||
        (p.status ?? '').toLowerCase().includes('baix')
    ) ?? [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>Dashboard</Text>
      <Text style={[styles.subtitulo, { color: colors.textSecondary }]}>
        Visão geral das suas plantas
      </Text>
      {dataSource === 'cache' ? <CacheHintRow /> : null}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : isError ? (
        <ThemedCard style={styles.cardErro}>
          <MaterialIcons name="sentiment-dissatisfied" size={40} color={colors.warning} />
          <Text style={[styles.erroTitulo, { color: colors.text }]}>
            Não foi possível carregar agora
          </Text>
          <Text style={[styles.erroTxt, { color: colors.textSecondary }]}>
            Verifique a internet ou se o servidor está no ar. Quando já tiver
            usado o app online, os dados ficam salvos neste dispositivo.
          </Text>
          {error instanceof Error ? (
            <Text style={[styles.erroDet, { color: colors.textSecondary }]}>
              {error.message}
            </Text>
          ) : null}
        </ThemedCard>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <ThemedCard>
            <View style={styles.cardHeader}>
              <MaterialIcons name="park" size={22} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Resumo
              </Text>
            </View>
            <Text style={[styles.texto, { color: colors.textSecondary }]}>
              Total de plantas:{' '}
              <Text style={{ fontWeight: '800', color: colors.text }}>
                {plantas?.length ?? 0}
              </Text>
            </Text>
          </ThemedCard>
          <ThemedCard style={styles.cardSpacer}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="warning-amber" size={22} color={colors.warning} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Alertas
              </Text>
            </View>
            {alertas.length === 0 ? (
              <Text style={[styles.texto, { color: colors.textSecondary }]}>
                Nenhum alerta automático. Tudo calmo por aqui.
              </Text>
            ) : (
              alertas.map((p) => (
                <Text
                  key={p.id}
                  style={[styles.texto, { color: colors.textSecondary }]}
                >
                  · {p.nome}: umidade {p.umidade}% · {p.temperatura}ºC ·{' '}
                  {p.status}
                </Text>
              ))
            )}
          </ThemedCard>
          <ThemedCard style={styles.cardSpacer}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="list-alt" size={22} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Plantas
              </Text>
            </View>
            {(plantas ?? []).map((p) => (
              <Text
                key={p.id}
                style={[styles.texto, { color: colors.textSecondary }]}
              >
                · {p.nome}{' '}
                <Text style={{ fontStyle: 'italic' }}>({p.especie})</Text>
              </Text>
            ))}
          </ThemedCard>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  titulo: {
    marginTop: layout.spaceMd,
    fontSize: 28,
    fontFamily: 'Inter',
    fontWeight: '800',
  },
  subtitulo: {
    marginTop: 4,
    marginBottom: layout.spaceSm,
    fontSize: 15,
  },
  scroll: {
    alignItems: 'center',
    paddingBottom: layout.spaceLg,
    paddingHorizontal: layout.spaceMd,
  },
  loader: {
    marginTop: 40,
  },
  cardSpacer: {
    marginTop: layout.spaceMd,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  texto: {
    fontSize: 15,
    marginTop: 6,
    lineHeight: 22,
  },
  cardErro: {
    alignItems: 'center',
    marginHorizontal: layout.spaceMd,
    marginTop: 12,
  },
  erroTitulo: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  erroTxt: {
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 14,
  },
  erroDet: {
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Dashboard;
