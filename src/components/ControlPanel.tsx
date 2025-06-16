import React from 'react';
import { Sliders, Gauge, Calculator, X } from 'lucide-react';
import { PumpModel } from '../types/pump';

interface ControlPanelProps {
  pump: PumpModel;
  flow: number;
  head: number;
  onFlowChange: (flow: number) => void;
  onHeadChange: (head: number) => void;
  onCalculate: () => void;
  onClearPoint: () => void;
  hasCalculatedPoint: boolean;
}

export function ControlPanel({ 
  pump, 
  flow, 
  head, 
  onFlowChange, 
  onHeadChange, 
  onCalculate, 
  onClearPoint,
  hasCalculatedPoint 
}: ControlPanelProps) {
  // Determinar o valor mínimo da altura baseado na bomba
  const minHead = pump.minHead !== undefined ? pump.minHead : 0;
  
  // Função para lidar com mudanças no campo de altura
  const handleHeadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Permitir campo vazio
    if (value === '') {
      onHeadChange(0);
      return;
    }
    
    // Permitir apenas números, ponto decimal e sinal negativo
    if (!/^-?\d*\.?\d*$/.test(value)) {
      return; // Não atualizar se não for um número válido
    }
    
    // Converter para número
    const numValue = parseFloat(value);
    
    // Se for um número válido, atualizar
    if (!isNaN(numValue)) {
      // Verificar limites apenas quando o valor estiver completo
      if (numValue >= minHead && numValue <= pump.maxHead) {
        onHeadChange(numValue);
      } else {
        // Ainda permitir a digitação, mas não validar até estar completo
        onHeadChange(numValue);
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sliders className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">Controles de Operação</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vazão (m³/h)
          </label>
          <input
            type="number"
            min="0"
            max={pump.maxFlow}
            step="0.1"
            value={flow}
            onChange={(e) => onFlowChange(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={`0 - ${pump.maxFlow}`}
          />
          <div className="text-xs text-gray-500 mt-1">
            Máximo: {pump.maxFlow} m³/h
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Altura (m)
          </label>
          <input
            type="text"
            value={head}
            onChange={handleHeadChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={`${minHead} - ${pump.maxHead}`}
          />
          <div className="text-xs text-gray-500 mt-1">
            {minHead < 0 ? `Mínimo: ${minHead} m, ` : ''}Máximo: {pump.maxHead} m
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={onCalculate}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Calculator className="w-5 h-5" />
          Calcular
        </button>
        
        {hasCalculatedPoint && (
          <button
            onClick={onClearPoint}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            title="Limpar ponto do gráfico"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Gauge className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-800">Ponto de Operação Atual</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-blue-600">{flow.toFixed(1)}</div>
            <div className="text-gray-600">Vazão</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className={`text-lg font-bold ${head < 0 ? 'text-red-600' : 'text-blue-600'}`}>
              {head.toFixed(1)}
            </div>
            <div className="text-gray-600">Altura</div>
          </div>
        </div>
        
        {hasCalculatedPoint && (
          <div className="mt-3 p-2 bg-green-100 rounded-lg border border-green-200">
            <div className="text-xs text-green-700 font-medium text-center">
              ✓ Ponto calculado exibido no gráfico
            </div>
          </div>
        )}
      </div>
    </div>
  );
}