import apiClient from '../api/apiClient';
import type { Planta } from '../types/Planta';

export type NovaPlantaPayload = {
  nome: string;
  especie: string;
};

type PlantaApiDTO = {
  id: number;
  nome: string;
  especie: string;
  dataCadastro: string;
  dataAtualizacao?: string;
  imgLink?: string;
  umidade?: number;
  temperatura?: number;
  luminosidade?: number;
  status?: string;
};

type HateoasResponse = {
  _embedded?: {
    plantaResponseDTOList?: PlantaApiDTO[];
  };
};

function mapDto(dto: PlantaApiDTO): Planta {
  return {
    id: dto.id,
    nome: dto.nome,
    especie: dto.especie,
    dataCadastro: new Date(dto.dataCadastro),
    dataAtualizacao: dto.dataAtualizacao ? new Date(dto.dataAtualizacao) : undefined,
    imgLink: dto.imgLink,
    umidade: dto.umidade ?? 0,
    temperatura: dto.temperatura ?? 0,
    luminosidade: dto.luminosidade ?? 0,
    status: dto.status ?? 'N/A',
  };
}

export async function listarPlantas(): Promise<Planta[]> {
  const response = await apiClient.get<HateoasResponse>('/plantas');
  const list = response.data?._embedded?.plantaResponseDTOList ?? [];
  return list.map(mapDto);
}

/** Usa a lista do backend (compatível quando não existe GET /plantas/:id). */
export async function buscarPlantaPorId(id: number): Promise<Planta> {
  const plantas = await listarPlantas();
  const found = plantas.find((p) => p.id === id);
  if (!found) {
    throw new Error('Planta não encontrada');
  }
  return found;
}

export async function criarPlanta(payload: NovaPlantaPayload): Promise<Planta> {
  const response = await apiClient.post<PlantaApiDTO>('/plantas', payload);
  return mapDto(response.data);
}

export async function atualizarPlanta(
  id: number,
  payload: NovaPlantaPayload
): Promise<Planta> {
  const response = await apiClient.put<PlantaApiDTO>(`/plantas/${id}`, payload);
  return mapDto(response.data);
}

export async function excluirPlanta(id: number): Promise<void> {
  await apiClient.delete(`/plantas/${id}`);
}
