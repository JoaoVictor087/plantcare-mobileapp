/**
 * Registro de cuidado gerenciado no Oracle APEX e exposto via REST.
 * Os nomes dos campos na API podem ser snake_case; o serviço normaliza.
 */
export type CuidadoApex = {
  id: number;
  plantaId: number | null;
  tipoCuidado: string;
  observacao: string;
  dataHora?: string;
};
