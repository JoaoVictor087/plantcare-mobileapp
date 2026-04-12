import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as apexCuidadosService from '../services/apexCuidadosService';
import type { CuidadoApex } from '../types/CuidadoApex';
import {
  assertInternetDisponivel,
  isRedeOuServidorIndisponivel,
} from '../utils/networkErrors';
import {
  carregarCuidadosCache,
  salvarCuidadosCache,
} from '../utils/offlineCache';
import { cuidadoApexKeys } from './queryKeys';

type CuidadoPayload = {
  plantaId: number | null;
  tipoCuidado: string;
  observacao: string;
};

export type CuidadosDataSource = 'live' | 'cache' | null;

export type CuidadosQueryPayload = {
  rows: CuidadoApex[];
  source: 'live' | 'cache';
};

export function useCuidadosApexQuery() {
  const query = useQuery({
    queryKey: cuidadoApexKeys.all,
    queryFn: async (): Promise<CuidadosQueryPayload> => {
      try {
        const list = await apexCuidadosService.listarCuidadosApex();
        await salvarCuidadosCache(list);
        return { rows: list, source: 'live' };
      } catch (e) {
        if (isRedeOuServidorIndisponivel(e)) {
          const cached = await carregarCuidadosCache();
          if (cached.length > 0) {
            return { rows: cached, source: 'cache' };
          }
        }
        throw e;
      }
    },
  });

  return {
    ...query,
    data: query.data?.rows,
    dataSource: query.data?.source ?? null,
  };
}

export function useCriarCuidadoApexMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CuidadoPayload) => {
      await assertInternetDisponivel();
      return apexCuidadosService.criarCuidadoApex(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuidadoApexKeys.all });
    },
  });
}

export function useAtualizarCuidadoApexMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: number; payload: CuidadoPayload }) => {
      await assertInternetDisponivel();
      return apexCuidadosService.atualizarCuidadoApex(vars.id, vars.payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuidadoApexKeys.all });
    },
  });
}

export function useExcluirCuidadoApexMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await assertInternetDisponivel();
      return apexCuidadosService.excluirCuidadoApex(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuidadoApexKeys.all });
    },
  });
}
