import { useQuery } from '@tanstack/react-query';
import { buscarDiagnosticoIA } from '../services/diagnosticoService';

export function useDiagnosticoQuery(plantaId: number) {
  return useQuery({
    queryKey: ['diagnostico', plantaId],
    queryFn: async () => {
      const result = await buscarDiagnosticoIA(plantaId);
      console.log('DIAGNOSTICO RESULT:', JSON.stringify(result));
      return result;
    },
    enabled: Number.isFinite(plantaId) && plantaId > 0,
    retry: false,
    staleTime: 60_000,
  });
}