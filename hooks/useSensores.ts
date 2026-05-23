import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as sensorService from '../services/sensorService';
import type { NovoSensorPayload } from '../types/Sensor';

export const sensorKeys = {
  byPlanta: (plantaId: number) => ['sensores', plantaId] as const,
};

export function useSensoresQuery(plantaId: number) {
  return useQuery({
    queryKey: sensorKeys.byPlanta(plantaId),
    queryFn: () => sensorService.listarSensores(plantaId),
    enabled: Number.isFinite(plantaId) && plantaId > 0,
    retry: false,
  });
}

export function useAdicionarSensorMutation(plantaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NovoSensorPayload) => sensorService.adicionarSensor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sensorKeys.byPlanta(plantaId) });
    },
  });
}

export function useRemoverSensorMutation(plantaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sensorId: number) => sensorService.removerSensor(sensorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sensorKeys.byPlanta(plantaId) });
    },
  });
}