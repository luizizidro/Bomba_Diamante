import { PumpModel, ChartData, PumpPoint } from '../types/pump';

export function generatePumpCurves(pump: PumpModel): ChartData {
  const flowPoints = Array.from({ length: 21 }, (_, i) => (i * pump.maxFlow) / 20);
  
  const headCurve = flowPoints.map(flow => {
    const normalizedFlow = flow / pump.maxFlow;
    
    // Para a Bomba Diamante, usar curva específica que vai de 200m a -10m
    if (pump.id === 'bomba-diamante') {
      // Curva que começa em 200m (vazão 0) e termina em -10m (vazão máxima)
      // Usando uma curva quadrática mais agressiva
      const headRange = pump.maxHead - (pump.minHead || 0); // 210m de range total
      const minHead = pump.minHead || 0;
      return pump.maxHead - headRange * Math.pow(normalizedFlow, 1.8);
    } else {
      // Curva padrão para outras bombas
      return pump.maxHead * (1 - 0.8 * Math.pow(normalizedFlow, 2));
    }
  });

  const powerCurve = flowPoints.map(flow => {
    const normalizedFlow = flow / pump.maxFlow;
    
    if (pump.id === 'bomba-diamante') {
      // Curva de potência mais realista para bomba industrial
      // Potência cresce de forma mais linear no início, depois mais acentuada
      return pump.power * (0.2 + 0.8 * Math.pow(normalizedFlow, 2.2));
    } else {
      // Curva padrão
      return pump.power * (0.3 + 0.7 * Math.pow(normalizedFlow, 3));
    }
  });

  const npshCurve = flowPoints.map(flow => {
    const normalizedFlow = flow / pump.maxFlow;
    
    if (pump.id === 'bomba-diamante') {
      // NPSH cresce até o máximo de 25 mca
      // Curva mais suave no início, mais agressiva no final
      return pump.npshr * Math.pow(normalizedFlow, 1.5);
    } else {
      // Curva padrão
      return pump.npshr * (1 + 2 * Math.pow(normalizedFlow, 2));
    }
  });

  const efficiencyCurve = flowPoints.map(flow => {
    const normalizedFlow = flow / pump.maxFlow;
    
    if (pump.id === 'bomba-diamante') {
      // Curva de eficiência com pico em torno de 60% da vazão máxima
      const optimalPoint = 0.6;
      const efficiency = pump.efficiency * (1 - 0.4 * Math.pow(normalizedFlow - optimalPoint, 2));
      return Math.max(20, Math.min(pump.efficiency, efficiency)); // Mínimo de 20%
    } else {
      // Curva padrão
      const optimalPoint = 0.7;
      const efficiency = pump.efficiency * (1 - 0.5 * Math.pow(normalizedFlow - optimalPoint, 2));
      return Math.max(0, Math.min(pump.efficiency, efficiency));
    }
  });

  return {
    flow: flowPoints,
    head: headCurve,
    power: powerCurve,
    npsh: npshCurve,
    efficiency: efficiencyCurve
  };
}

export function calculatePumpPoint(pump: PumpModel, flow: number, head: number): PumpPoint {
  const curves = generatePumpCurves(pump);
  
  // Encontrar o ponto mais próximo na curva
  const closestIndex = curves.flow.reduce((bestIndex, currentFlow, currentIndex) => {
    const currentDistance = Math.abs(currentFlow - flow);
    const bestDistance = Math.abs(curves.flow[bestIndex] - flow);
    return currentDistance < bestDistance ? currentIndex : bestIndex;
  }, 0);

  // Interpolação linear para valores mais precisos
  const interpolatedPower = interpolateValue(curves.flow, curves.power, flow);
  const interpolatedNPSH = interpolateValue(curves.flow, curves.npsh, flow);
  const interpolatedEfficiency = interpolateValue(curves.flow, curves.efficiency, flow);

  return {
    flow,
    head,
    power: interpolatedPower,
    npsh: interpolatedNPSH,
    efficiency: interpolatedEfficiency
  };
}

function interpolateValue(xArray: number[], yArray: number[], x: number): number {
  if (x <= xArray[0]) return yArray[0];
  if (x >= xArray[xArray.length - 1]) return yArray[yArray.length - 1];

  for (let i = 0; i < xArray.length - 1; i++) {
    if (x >= xArray[i] && x <= xArray[i + 1]) {
      const ratio = (x - xArray[i]) / (xArray[i + 1] - xArray[i]);
      return yArray[i] + ratio * (yArray[i + 1] - yArray[i]);
    }
  }
  
  return yArray[0];
}