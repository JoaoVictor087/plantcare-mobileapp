/**
 * Reexportações da camada de serviços (compatibilidade).
 * Prefira importar de `services/` e consumir dados via hooks em `hooks/`.
 */
export { criarConta, logarConta } from '../services/authService';
export type { NovaPlantaPayload as NovaPlantaDTO } from '../services/plantaService';
export {
  listarPlantas as buscarPlantasPorUsuario,
  criarPlanta as adicionarPlanta,
} from '../services/plantaService';
