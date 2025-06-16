export interface PumpModel {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  efficiency: number; // %
  npshr: number; // mca
  power: number; // cv
  rotation: number; // rpm
  maxFlow: number; // m³/h
  maxHead: number; // mca
  minHead?: number; // mca (opcional, padrão 0)
}

export interface PumpPoint {
  flow: number; // m³/h
  head: number; // mca
  power: number; // cv
  npsh: number; // mca
  efficiency: number; // %
}

export interface ChartData {
  flow: number[];
  head: number[];
  power: number[];
  npsh: number[];
  efficiency: number[];
}