import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import * as apexCuidadosService from '../services/apexCuidadosService';
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

export function useCuidadosApexQuery() {
  const [dataSource, setDataSource] = useState<CuidadosDataSource>(null);

  const query = useQuery({
    queryKey: cuidadoApexKeys.all,
    queryFn: async () => {
      try {
        const list = await apexCuidadosService.listarCuidadosApex();
        await salvarCuidadosCache(list);
        setDataSource('live');
        return list;
      } catch (e) {
        if (isRedeOuServidorIndisponivel(e)) {
          const cached = await carregarCuidadosCache();
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
