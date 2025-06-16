import { PumpModel } from '../types/pump';

export const pumpModels: PumpModel[] = [
  {
    id: 'bc21-r1',
    name: 'BC-21 R 1/2 (Modelo 1)',
    manufacturer: 'Indústrias Schneider',
    type: 'Centrífuga Monoestágio',
    efficiency: 57.05,
    npshr: 2.87,
    power: 3,
    rotation: 3500,
    maxFlow: 25,
    maxHead: 45
  },
  {
    id: 'bc21-r2',
    name: 'BC-21 R 1/2 (Modelo 2)',
    manufacturer: 'Indústrias Schneider',
    type: 'Centrífuga Monoestágio',
    efficiency: 54.68,
    npshr: 2.87,
    power: 4,
    rotation: 3500,
    maxFlow: 30,
    maxHead: 50
  },
  {
    id: 'bomba-diamante',
    name: 'Bomba Diamante',
    manufacturer: 'Bomba Personalizada',
    type: 'Centrífuga Industrial',
    efficiency: 75,
    npshr: 25,
    power: 46.5,
    rotation: 1700,
    maxFlow: 180,
    maxHead: 200,
    minHead: -10
  }
];