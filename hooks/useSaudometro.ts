import { useQuery } from '@tanstack/react-query';
import { buscarSaudeHistorica } from '../services/saudometroService';

export function useSaudometroQuery(plantaId: number) {
  return useQuery({
    queryKey: ['saudometro', plantaId],
    queryFn: () => buscarSaudeHistorica(plantaId),
    enabled: Number.isFinite(plantaId) && plantaId > 0,
    retry: false,
    staleTime: 60_000,
  });
}