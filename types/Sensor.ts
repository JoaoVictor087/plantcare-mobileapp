export type TipoSensor = 'SENSOR_LUZ' | 'SENSOR_UMIDADE' | 'SENSOR_TEMPERATURA';

export interface Sensor {
  id: number;
  tipoSensor: TipoSensor;
  id_planta: number;
}

export interface NovoSensorPayload {
  tipoSensor: TipoSensor;
  id_planta: number;
}