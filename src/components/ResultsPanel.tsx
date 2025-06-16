import React from 'react';
import { Calculator, Zap, Droplets, Gauge, TrendingUp } from 'lucide-react';
import { PumpPoint } from '../types/pump';

interface ResultsPanelProps {
  results: PumpPoint;
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-orange-600" />
        <h2 className="text-xl font-semibold text-gray-800">Resultados Calculados</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Potência Requerida</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {results.power.toFixed(2)} <span className="text-sm font-normal">cv</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">NPSH Requerido</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {results.npsh.toFixed(2)} <span className="text-sm font-normal">mca</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-800">Rendimento</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {results.efficiency.toFixed(2)} <span className="text-sm font-normal">%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Gauge className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-800">Ponto de Operação</span>
          </div>
          <div className="text-sm text-orange-900">
            <div>Vazão: {results.flow.toFixed(1)} m³/h</div>
            <div>Altura: {results.head.toFixed(1)} mca</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-3">Análise do Ponto de Operação</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Eficiência Operacional:</span>
            <span className={`font-medium ${results.efficiency > 70 ? 'text-green-600' : results.efficiency > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {results.efficiency > 70 ? 'Excelente' : results.efficiency > 50 ? 'Boa' : 'Baixa'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Consumo de Energia:</span>
            <span className={`font-medium ${results.power < 5 ? 'text-green-600' : results.power < 20 ? 'text-yellow-600' : 'text-red-600'}`}>
              {results.power < 5 ? 'Baixo' : results.power < 20 ? 'Moderado' : 'Alto'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Condição de Cavitação:</span>
            <span className={`font-medium ${results.npsh < 10 ? 'text-green-600' : results.npsh < 20 ? 'text-yellow-600' : 'text-red-600'}`}>
              {results.npsh < 10 ? 'Segura' : results.npsh < 20 ? 'Atenção' : 'Crítica'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}