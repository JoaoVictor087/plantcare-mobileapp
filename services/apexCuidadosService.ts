import apexClient from '../api/apexClient';
import type { CuidadoApex } from '../types/CuidadoApex';

type CuidadoPayload = {
  plantaId: number | null;
  tipoCuidado: string;
  observacao: string;
};

function pickId(row: Record<string, unknown>): number {
  const v = row.id ?? row.cuidado_id ?? row.cuidadoId;
  return Number(v);
}

function normalize(row: Record<string, unknown>): CuidadoApex {
  const plantaRaw = row.plantaId ?? row.planta_id;
  return {
    id: pickId(row),
    plantaId:
      plantaRaw === null || plantaRaw === undefined ? null : Number(plantaRaw),
    tipoCuidado: String(row.tipoCuidado ?? row.tipo_cuidado ?? ''),
    observacao: String(row.observacao ?? ''),
    dataHora: row.dataHora != null
      ? String(row.dataHora)
      : row.data_hora != null
        ? String(row.data_hora)
        : undefined,
  };
}

function unwrapList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data as Record<string, unknown>[];
  }
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.items)) {
      return o.items as Record<string, unknown>[];
    }
    const emb = o._embedded as Record<string, unknown> | undefined;
    if (emb && Array.isArray(emb.items)) {
      return emb.items as Record<string, unknown>[];
    }
  }
  return [];
}

function toBody(p: CuidadoPayload): Record<string, unknown> {
  return {
    planta_id: p.plantaId,
    tipo_cuidado: p.tipoCuidado,
    observacao: p.observacao,
  };
}

export async function listarCuidadosApex(): Promise<CuidadoApex[]> {
  const { data } = await apexClient.get<unknown>('');
  return unwrapList(data).map(normalize);
}

export async function criarCuidadoApex(
  payload: CuidadoPayload
): Promise<CuidadoApex> {
  const { data } = await apexClient.post<unknown>('', toBody(payload));
  if (data && typeof data === 'object') {
    return normalize(data as Record<string, unknown>);
  }
  const list = await listarCuidadosApex();
  return list[list.length - 1];
}

export async function atualizarCuidadoApex(
  id: number,
  payload: CuidadoPayload
): Promise<CuidadoApex> {
  const { data } = await apexClient.put<unknown>(`/${id}`, toBody(payload));
  if (data && typeof data === 'object') {
    return normalize(data as Record<string, unknown>);
  }
  const list = await listarCuidadosApex();
  const found = list.find((c) => c.id === id);
  if (!found) {
    throw new Error('Cuidado não encontrado após atualização');
  }
  return found;
}

export async function excluirCuidadoApex(id: number): Promise<void> {
  await apexClient.delete(`/${id}`);
}
