import axios from 'axios';

const APEX_BASE_URL =
  'https://g8e46678d441c4b-plantcare.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/plantcare';

export interface SaudeHistorica {
  id_planta: number;
  total_analises_7_dias: number;
  alertas_gerados: number;
  score_saude: number;
}

export async function buscarSaudeHistorica(plantaId: number): Promise<SaudeHistorica> {
  const response = await axios.get<SaudeHistorica>(
    `${APEX_BASE_URL}/plantas/${plantaId}/saude-historica`
  );
  return response.data;
}