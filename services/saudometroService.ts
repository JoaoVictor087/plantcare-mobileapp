import axios from 'axios';

const APEX_BASE_URL =
  'https://g8e46678d441c4b-plantcare.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/plantcare';

export interface SaudometroResponse {
  id_planta: number;
  nome: string;
  tipo: string;
  status_monitoramento: string;
  saudometro: number;
  insight: string;
}

export async function buscarSaudometro(
  plantaId: number
): Promise<SaudometroResponse> {
  const response = await axios.get<SaudometroResponse>(
    `${APEX_BASE_URL}/plantas/${plantaId}/saude-atual`
  );

  return response.data;
}