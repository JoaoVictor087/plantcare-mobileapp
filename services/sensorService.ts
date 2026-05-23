import apiClient from '../api/apiClient';
import type { NovoSensorPayload, Sensor } from '../types/Sensor';

type SensorApiDTO = {
  id: number;
  tipoSensor: string;
  id_planta: number;
};

function mapDto(dto: SensorApiDTO): Sensor {
  return {
    id: dto.id,
    tipoSensor: dto.tipoSensor as Sensor['tipoSensor'],
    id_planta: dto.id_planta,
  };
}

export async function listarSensores(id_planta: number): Promise<Sensor[]> {
  const response = await apiClient.get<SensorApiDTO[] | unknown>(
    `/sensor/listarSensores`,
    { params: { id_planta } }
  );
  const data = response.data;
  if (Array.isArray(data)) return data.map(mapDto);
  return [];
}

export async function adicionarSensor(payload: NovoSensorPayload): Promise<Sensor> {
  const response = await apiClient.post<SensorApiDTO>('/sensor/addSensor', {
    tipoSensor: payload.tipoSensor,
    id_planta: payload.id_planta,
  });
  return mapDto(response.data);
}

export async function removerSensor(id: number): Promise<void> {
  await apiClient.delete(`/sensor/${id}`);
}