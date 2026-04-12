import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { NovaPlantaPayload } from '../services/plantaService';
import * as plantaService from '../services/plantaService';
import type { Planta } from '../types/Planta';
import {
  carregarPlantasCache,
  mergePlantasServidorComLocais,
  novoIdLocal,
  salvarPlantasCache,
} from '../utils/offlineCache';
import { plantKeys } from './queryKeys';

/** Tempo máximo de espera pela API antes de usar só o armazenamento local. */
const LISTAR_PLANTAS_TIMEOUT_MS = 8000;

export type PlantasDataSource = 'live' | 'cache' | null;

export type PlantasQueryPayload = {
  rows: Planta[];
  source: 'live' | 'cache';
};

function readRowsFromCache(client: QueryClient, id: number): Planta | undefined {
  const raw = client.getQueryData<PlantasQueryPayload | Planta[]>(plantKeys.all);
  if (!raw) return undefined;
  const rows = Array.isArray(raw) ? raw : raw.rows;
  return rows.find((p) => p.id === id);
}

export function usePlantasQuery() {
  const query = useQuery({
    queryKey: plantKeys.all,
    retry: false,
    queryFn: async (): Promise<PlantasQueryPayload> => {
      try {
        const list = await Promise.race([
          plantaService.listarPlantas(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), LISTAR_PLANTAS_TIMEOUT_MS)
          ),
        ]);
        const merged = await mergePlantasServidorComLocais(list);
        await salvarPlantasCache(merged);
        return { rows: merged, source: 'live' };
      } catch {
        const cached = await carregarPlantasCache();
        return { rows: cached, source: 'cache' };
      }
    },
  });

  const dataSource: PlantasDataSource = query.data?.source ?? null;
  const rows = query.data?.rows;

  return {
    ...query,
    data: rows,
    dataSource,
  };
}

export function usePlantaQuery(id: number) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: plantKeys.detail(id),
    retry: false,
    queryFn: async () => {
      const hit = readRowsFromCache(queryClient, id);
      if (hit) return hit;
      const disk = await carregarPlantasCache();
      const found = disk.find((p) => p.id === id);
      if (found) return found;
      throw new Error('Planta não encontrada');
    },
    enabled: Number.isFinite(id) && id !== 0,
  });
}

export function useCriarPlantaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: NovaPlantaPayload) => {
      try {
        return await plantaService.criarPlanta(payload);
      } catch {
        const list = await carregarPlantasCache();
        const nova: Planta = {
          id: novoIdLocal(),
          nome: payload.nome,
          especie: payload.especie,
          dataCadastro: new Date(),
          umidade: 0,
          temperatura: 0,
          status: 'Só no aparelho',
        };
        await salvarPlantasCache([nova, ...list]);
        return nova;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
    },
  });
}

export function useAtualizarPlantaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: number; payload: NovaPlantaPayload }) => {
      try {
        return await plantaService.atualizarPlanta(vars.id, vars.payload);
      } catch {
        const list = await carregarPlantasCache();
        const i = list.findIndex((p) => p.id === vars.id);
        if (i === -1) {
          throw new Error('Planta não encontrada no armazenamento local.');
        }
        const atualizada: Planta = {
          ...list[i],
          nome: vars.payload.nome,
          especie: vars.payload.especie,
          dataAtualizacao: new Date(),
        };
        const next = [...list];
        next[i] = atualizada;
        await salvarPlantasCache(next);
        return atualizada;
      }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
      queryClient.invalidateQueries({ queryKey: plantKeys.detail(vars.id) });
    },
  });
}

export function useExcluirPlantaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await plantaService.excluirPlanta(id);
      } catch {
        const list = (await carregarPlantasCache()).filter((p) => p.id !== id);
        await salvarPlantasCache(list);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
    },
  });
}
