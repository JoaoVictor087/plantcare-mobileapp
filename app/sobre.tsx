import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedCard } from '../components/ThemedCard';
import { layout } from '../constants/themePalettes';
import { useTheme } from '../context/ThemeContext';

// Hash do commit é injetado via app.json > extra ou substituído no build
const COMMIT_HASH: string =
  (Constants.expoConfig?.extra?.commitHash as string | undefined) ??
  process.env.EXPO_PUBLIC_COMMIT_HASH ??
  'dev-build';

const VERSAO = Constants.expoConfig?.version ?? '1.0.0';

const INTEGRANTES = [
  { nome: 'João Victor Alves da Silva', rm: '559726' },
  { nome: 'Vinicius Kenzo Tocuyosi', rm: '559982' },
  { nome: 'Juan Pablo Rebelo Coelho', rm: '560445' }
];

export default function SobreScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Top bar */}
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.text }]}>Sobre o App</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Logo / nome */}
        <ThemedCard style={styles.heroCard}>
          <MaterialIcons name="eco" size={56} color={colors.primary} />
          <Text style={[styles.appNome, { color: colors.text }]}>PlantCare</Text>
          <Text style={[styles.appSlogan, { color: colors.textSecondary }]}>
            Cuide das suas plantas com inteligência
          </Text>
        </ThemedCard>

        {/* Versão e commit */}
        <ThemedCard style={styles.section}>
          <InfoRow
            icon="tag"
            label="Versão"
            value={VERSAO}
            colors={colors}
          />
          <InfoRow
            icon="commit"
            label="Commit de referência"
            value={COMMIT_HASH}
            mono
            colors={colors}
          />
        </ThemedCard>

        {/* Sobre o projeto */}
        <ThemedCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="info-outline" size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre o projeto</Text>
          </View>
          <Text style={[styles.descricao, { color: colors.textSecondary }]}>
            O PlantCare é um sistema inteligente para monitoramento de plantas domésticas.
            Sensores de umidade, temperatura e luminosidade coletam dados em tempo real,
            permitindo que o usuário acompanhe a saúde das suas plantas e receba alertas
            e lembretes de cuidados diretamente no celular.
          </Text>
        </ThemedCard>

        {/* Integrantes */}
        <ThemedCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="group" size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Integrantes</Text>
          </View>
          {INTEGRANTES.map((i) => (
            <View
              key={i.rm}
              style={[styles.integranteRow, { borderColor: colors.border }]}
            >
              <MaterialIcons name="person-outline" size={18} color={colors.textSecondary} />
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.integranteNome, { color: colors.text }]}>{i.nome}</Text>
                <Text style={[styles.integranteRm, { color: colors.textSecondary }]}>
                  RM {i.rm}
                </Text>
              </View>
            </View>
          ))}
        </ThemedCard>

        {/* Tecnologias */}
        <ThemedCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="code" size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tecnologias</Text>
          </View>
          {[
            'React Native + Expo',
            'TypeScript',
            'Expo Router',
            'TanStack Query',
            'Axios',
            'Oracle APEX (REST)',
            'Spring Boot (API backend)',
            'expo-notifications',
          ].map((tech) => (
            <Text
              key={tech}
              style={[styles.techItem, { color: colors.textSecondary }]}
            >
              · {tech}
            </Text>
          ))}
        </ThemedCard>

        <Text style={[styles.footer, { color: colors.textSecondary }]}>
          FIAP · 2TDSPA · Challenge Sprint
        </Text>
      </ScrollView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono = false,
  colors,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  mono?: boolean;
  colors: any;
}) {
  return (
    <View style={infoStyles.row}>
      <MaterialIcons name={icon} size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
      <Text style={[infoStyles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text
        style={[
          infoStyles.value,
          { color: colors.text },
          mono && { fontFamily: 'monospace', fontSize: 12 },
        ]}
        selectable
      >
        {value}
      </Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: { flex: 1, fontSize: 14 },
  value: { fontSize: 14, fontWeight: '600' },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { padding: layout.spaceMd, paddingBottom: 48 },
  heroCard: { alignItems: 'center', marginBottom: layout.spaceMd },
  appNome: { fontSize: 30, fontWeight: '800', marginTop: 10 },
  appSlogan: { marginTop: 4, fontSize: 14, textAlign: 'center' },
  section: { marginBottom: layout.spaceMd },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  descricao: { fontSize: 14, lineHeight: 22 },
  integranteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  integranteNome: { fontSize: 14, fontWeight: '600' },
  integranteRm: { fontSize: 12, marginTop: 2 },
  techItem: { fontSize: 14, paddingVertical: 3 },
  footer: { textAlign: 'center', fontSize: 12, marginTop: 8 },
});
