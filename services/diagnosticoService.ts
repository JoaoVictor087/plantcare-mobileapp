import apiClient from '../api/apiClient';

export interface DiagnosticoIA {
  diagnostico: string;
  recomendacoes?: string;
  status?: string;
}

export async function buscarDiagnosticoIA(plantaId: number): Promise<DiagnosticoIA> {
  const response = await apiClient.get(`/plantas/${plantaId}/diagnostico-ia`);
  return response.data.resultado; 
}
