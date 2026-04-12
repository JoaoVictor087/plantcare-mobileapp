import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { usePlantasQuery } from '../../hooks/usePlantas';

const Dashboard = () => {
  const { colors } = useTheme();
  const { data: plantas, isLoading, isError, error } = usePlantasQuery();

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
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : isError ? (
        <Text style={[styles.erro, { color: colors.textSecondary }]}>
          Não foi possível carregar os dados.{' '}
          {error instanceof Error ? error.message : ''}
        </Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.infoArea,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.subtitulo, { color: colors.text }]}>
              Resumo (API)
            </Text>
            <Text style={[styles.texto, { color: colors.textSecondary }]}>
              Total de plantas cadastradas: {plantas?.length ?? 0}
            </Text>
          </View>
          <View
            style={[
              styles.infoArea,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.subtitulo, { color: colors.text }]}>
              Alertas
            </Text>
            {alertas.length === 0 ? (
              <Text style={[styles.texto, { color: colors.textSecondary }]}>
                Nenhum alerta automático no momento. Dados vindos da API de
                plantas.
              </Text>
            ) : (
              alertas.map((p) => (
                <Text
                  key={p.id}
                  style={[styles.texto, { color: colors.textSecondary }]}
                >
                  {p.nome}: umidade {p.umidade}% · temp. {p.temperatura}ºC ·{' '}
                  {p.status}
                </Text>
              ))
            )}
          </View>
          <View
            style={[
              styles.infoArea,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.subtitulo, { color: colors.text }]}>
              Todas as plantas
            </Text>
            {(plantas ?? []).map((p) => (
              <Text
                key={p.id}
                style={[styles.texto, { color: colors.textSecondary }]}
              >
                {p.nome} ({p.especie})
              </Text>
            ))}
          </View>
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
    marginBottom: 20,
    fontSize: 30,
    fontFamily: 'Inter',
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoArea: {
    minHeight: 120,
    width: 350,
    borderRadius: 10,
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
  },
  texto: {
    fontSize: 16,
    marginTop: 6,
  },
  scroll: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  loader: {
    marginTop: 40,
  },
  erro: {
    marginTop: 24,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
});

export default Dashboard;
