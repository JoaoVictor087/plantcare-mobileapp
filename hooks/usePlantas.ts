import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
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

export function usePlantasQuery() {
  const [dataSource, setDataSource] = useState<PlantasDataSource>(null);

  const query = useQuery({
    queryKey: plantKeys.all,
    queryFn: async () => {
      try {
        const list = await plantaService.listarPlantas();
        await salvarPlantasCache(list);
        setDataSource('live');
        return list;
      } catch (e) {
        if (isRedeOuServidorIndisponivel(e)) {
          const cached = await carregarPlantasCache();
          if (cached.length > 0) {
            setDataSource('cache');
            return cached;
          }
        }
        setDataSource(null);
        throw e;
      }
    },
  });

  return { ...query, dataSource };
}

export function usePlantaQuery(id: number) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: plantKeys.detail(id),
    queryFn: async () => {
      const todas = queryClient.getQueryData<Planta[]>(plantKeys.all);
      const hit = todas?.find((p) => p.id === id);
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
