import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NovaPlantaPayload } from '../services/plantaService';
import * as plantaService from '../services/plantaService';
import { plantKeys } from './queryKeys';

export function usePlantasQuery() {
  return useQuery({
    queryKey: plantKeys.all,
    queryFn: plantaService.listarPlantas,
  });
}

export function usePlantaQuery(id: number) {
  return useQuery({
    queryKey: plantKeys.detail(id),
    queryFn: () => plantaService.buscarPlantaPorId(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCriarPlantaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NovaPlantaPayload) => plantaService.criarPlanta(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
    },
  });
}

export function useAtualizarPlantaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; payload: NovaPlantaPayload }) =>
      plantaService.atualizarPlanta(vars.id, vars.payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
      queryClient.invalidateQueries({ queryKey: plantKeys.detail(vars.id) });
    },
  });
}

export function useExcluirPlantaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => plantaService.excluirPlanta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
    },
  });
}
