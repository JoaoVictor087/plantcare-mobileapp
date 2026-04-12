import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as apexCuidadosService from '../services/apexCuidadosService';
import { cuidadoApexKeys } from './queryKeys';

type CuidadoPayload = {
  plantaId: number | null;
  tipoCuidado: string;
  observacao: string;
};

export function useCuidadosApexQuery() {
  return useQuery({
    queryKey: cuidadoApexKeys.all,
    queryFn: apexCuidadosService.listarCuidadosApex,
  });
}

export function useCriarCuidadoApexMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CuidadoPayload) =>
      apexCuidadosService.criarCuidadoApex(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuidadoApexKeys.all });
    },
  });
}

export function useAtualizarCuidadoApexMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; payload: CuidadoPayload }) =>
      apexCuidadosService.atualizarCuidadoApex(vars.id, vars.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuidadoApexKeys.all });
    },
  });
}

export function useExcluirCuidadoApexMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apexCuidadosService.excluirCuidadoApex(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuidadoApexKeys.all });
    },
  });
}
