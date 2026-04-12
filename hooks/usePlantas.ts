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
  assertInternetDisponivel,
  isRedeOuServidorIndisponivel,
} from '../utils/networkErrors';
import {
  carregarPlantasCache,
  salvarPlantasCache,
} from '../utils/offlineCache';
import { plantKeys } from './queryKeys';

export type PlantasDataSource = 'live' | 'cache' | null;

/** Formato interno do cache do React Query (evita setState dentro do queryFn). */
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
    queryFn: async (): Promise<PlantasQueryPayload> => {
      try {
        const list = await plantaService.listarPlantas();
        await salvarPlantasCache(list);
        return { rows: list, source: 'live' };
      } catch (e) {
        if (isRedeOuServidorIndisponivel(e)) {
          const cached = await carregarPlantasCache();
          if (cached.length > 0) {
            return { rows: cached, source: 'cache' };
          }
        }
        throw e;
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
    queryFn: async () => {
      const hit = readRowsFromCache(queryClient, id);
      if (hit) return hit;
      return plantaService.buscarPlantaPorId(id);
    },
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCriarPlantaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: NovaPlantaPayload) => {
      await assertInternetDisponivel();
      return plantaService.criarPlanta(payload);
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
      await assertInternetDisponivel();
      return plantaService.atualizarPlanta(vars.id, vars.payload);
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
      await assertInternetDisponivel();
      return plantaService.excluirPlanta(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
    },
  });
}
