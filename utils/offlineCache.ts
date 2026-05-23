import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Planta } from '../types/Planta';
import type { CuidadoApex } from '../types/CuidadoApex';

const PLANTAS_KEY = '@plantcare_cache_plantas_v2';
const CUIDADOS_KEY = '@plantcare_cache_cuidados_v1';

type PlantaSerial = Omit<Planta, 'dataCadastro' | 'dataAtualizacao'> & {
  dataCadastro: string;
  dataAtualizacao?: string;
};

function revivePlanta(row: PlantaSerial): Planta {
  return {
    ...row,
    dataCadastro: new Date(row.dataCadastro),
    dataAtualizacao: row.dataAtualizacao
      ? new Date(row.dataAtualizacao)
      : undefined,
  };
}

export async function salvarPlantasCache(plantas: Planta[]): Promise<void> {
  const serial: PlantaSerial[] = plantas.map((p) => ({
    ...p,
    dataCadastro: p.dataCadastro.toISOString(),
    dataAtualizacao: p.dataAtualizacao?.toISOString(),
  }));
  await AsyncStorage.setItem(PLANTAS_KEY, JSON.stringify(serial));
}

export async function carregarPlantasCache(): Promise<Planta[]> {
  try {
    const raw = await AsyncStorage.getItem(PLANTAS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PlantaSerial[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(revivePlanta);
  } catch {
    return [];
  }
}

export async function salvarCuidadosCache(lista: CuidadoApex[]): Promise<void> {
  await AsyncStorage.setItem(CUIDADOS_KEY, JSON.stringify(lista));
}

export async function carregarCuidadosCache(): Promise<CuidadoApex[]> {
  try {
    const raw = await AsyncStorage.getItem(CUIDADOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CuidadoApex[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function novoIdLocal(): number {
  return -Math.floor(Date.now() * 1000 + Math.random() * 1000);
}

export async function mergePlantasServidorComLocais(
  servidor: Planta[]
): Promise<Planta[]> {
  const atual = await carregarPlantasCache();
  const locais = atual.filter((p) => p.id < 0);
  return [...locais, ...servidor];
}

export async function mergeCuidadosServidorComLocais(
  servidor: CuidadoApex[]
): Promise<CuidadoApex[]> {
  const atual = await carregarCuidadosCache();
  const locais = atual.filter((c) => c.id < 0);
  return [...locais, ...servidor];
}
