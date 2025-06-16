import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PumpModel, ChartData } from '../types/pump';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PumpChartProps {
  pump: PumpModel;
  chartData: ChartData;
  controlPoint: { flow: number; head: number } | null;
}

export function PumpChart({ pump, chartData, controlPoint }: PumpChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const data = {
    labels: chartData.flow.map(f => f.toFixed(1)),
    datasets: [
      {
        label: 'Altura (m)',
        data: chartData.head,
        borderColor: '#DC2626', // Vermelho
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Potência (cv)',
        data: chartData.power,
        borderColor: '#2563EB', // Azul
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        yAxisID: 'y1',
      },
      {
        label: 'NPSH (mca)',
        data: chartData.npsh,
        borderColor: '#059669', // Verde
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Rendimento (%)',
        data: chartData.efficiency,
        borderColor: '#7C3AED', // Roxo
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        yAxisID: 'y2',
      },
      // Dataset para o ponto de controle calculado
      ...(controlPoint ? [{
        label: 'Ponto Calculado',
        data: chartData.flow.map(() => null).map((_, index) => {
          // Encontrar o índice mais próximo da vazão do ponto de controle
          const flowDifferences = chartData.flow.map(f => Math.abs(f - controlPoint.flow));
          const closestIndex = flowDifferences.indexOf(Math.min(...flowDifferences));
          return index === closestIndex ? controlPoint.head : null;
        }),
        borderColor: '#F59E0B', // Amarelo/Laranja para destaque
        backgroundColor: '#F59E0B',
        borderWidth: 0,
        pointRadius: 12,
        pointHoverRadius: 15,
        pointBorderWidth: 3,
        pointBorderColor: '#FFFFFF',
        showLine: false,
        yAxisID: 'y',
      }] : []),
    ],
  };

  // Determinar os limites do eixo Y baseado na bomba selecionada
  const getYAxisLimits = () => {
    if (pump.id === 'bomba-diamante') {
      return {
        min: -20, // Um pouco abaixo do mínimo para visualização
        max: 220, // Um pouco acima do máximo
      };
    } else {
      return {
        min: 0,
        max: Math.max(...chartData.head) * 1.1,
      };
    }
  };

  const yLimits = getYAxisLimits();

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          filter: function(item) {
            // Não mostrar o ponto calculado na legenda se não existir
            return !(item.text === 'Ponto Calculado' && !controlPoint);
          }
        },
      },
      title: {
        display: true,
        text: `Curvas Características - ${pump.name}`,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === 'Ponto Calculado') {
                return `Ponto Calculado: Vazão ${controlPoint?.flow.toFixed(1)} m³/h, Altura ${controlPoint?.head.toFixed(1)} m`;
              }
              label += context.parsed.y.toFixed(2);
              if (context.dataset.label === 'Altura (m)') {
                label += ' m';
              } else if (context.dataset.label === 'NPSH (mca)') {
                label += ' mca';
              } else if (context.dataset.label === 'Potência (cv)') {
                label += ' cv';
              } else if (context.dataset.label === 'Rendimento (%)') {
                label += '%';
              }
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Vazão (m³/h)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Altura (m)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        min: yLimits.min,
        max: yLimits.max,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Potência (cv)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
        max: pump.power * 1.2,
      },
      y2: {
        type: 'linear' as const,
        display: false,
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="h-96">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      
      {controlPoint && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="font-medium">
              Ponto Calculado: {controlPoint.flow.toFixed(1)} m³/h × {controlPoint.head.toFixed(1)} m
            </span>
          </div>
        </div>
      )}
    </div>
  );
}