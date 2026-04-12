import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as apexCuidadosService from '../services/apexCuidadosService';
import type { CuidadoApex } from '../types/CuidadoApex';
import {
  carregarCuidadosCache,
  mergeCuidadosServidorComLocais,
  novoIdLocal,
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

const LISTAR_CUIDADOS_TIMEOUT_MS = 8000;

export function useCuidadosApexQuery() {
  const query = useQuery({
    queryKey: cuidadoApexKeys.all,
    retry: false,
    queryFn: async (): Promise<CuidadosQueryPayload> => {
      try {
        const list = await Promise.race([
          apexCuidadosService.listarCuidadosApex(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), LISTAR_CUIDADOS_TIMEOUT_MS)
          ),
        ]);
        const merged = await mergeCuidadosServidorComLocais(list);
        await salvarCuidadosCache(merged);
        return { rows: merged, source: 'live' };
      } catch {
        const cached = await carregarCuidadosCache();
        return { rows: cached, source: 'cache' };
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
      try {
        return await apexCuidadosService.criarCuidadoApex(payload);
      } catch {
        const list = await carregarCuidadosCache();
        const novo: CuidadoApex = {
          id: novoIdLocal(),
          plantaId: payload.plantaId,
          tipoCuidado: payload.tipoCuidado,
          observacao: payload.observacao,
          dataHora: new Date().toISOString(),
        };
        await salvarCuidadosCache([novo, ...list]);
        return novo;
      }
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
      try {
        return await apexCuidadosService.atualizarCuidadoApex(vars.id, vars.payload);
      } catch {
        const list = await carregarCuidadosCache();
        const i = list.findIndex((c) => c.id === vars.id);
        if (i === -1) {
          throw new Error('Registro não encontrado localmente.');
        }
        const atualizado: CuidadoApex = {
          ...list[i],
          plantaId: vars.payload.plantaId,
          tipoCuidado: vars.payload.tipoCuidado,
          observacao: vars.payload.observacao,
          dataHora: new Date().toISOString(),
        };
        const next = [...list];
        next[i] = atualizado;
        await salvarCuidadosCache(next);
        return atualizado;
      }
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
      try {
        await apexCuidadosService.excluirCuidadoApex(id);
      } catch {
        const list = (await carregarCuidadosCache()).filter((c) => c.id !== id);
        await salvarCuidadosCache(list);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuidadoApexKeys.all });
    },
  });
}
