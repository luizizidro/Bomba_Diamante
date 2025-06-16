import React from 'react';
import { PumpModel } from '../types/pump';
import { Settings } from 'lucide-react';

interface PumpSelectorProps {
  pumps: PumpModel[];
  selectedPump: PumpModel;
  onPumpSelect: (pump: PumpModel) => void;
}

export function PumpSelector({ pumps, selectedPump, onPumpSelect }: PumpSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Seleção de Bomba</h2>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Modelo da Bomba
        </label>
        <select
          value={selectedPump.id}
          onChange={(e) => {
            const pump = pumps.find(p => p.id === e.target.value);
            if (pump) onPumpSelect(pump);
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
        >
          {pumps.map((pump) => (
            <option key={pump.id} value={pump.id}>
              {pump.name} - {pump.manufacturer} ({pump.power} cv)
            </option>
          ))}
        </select>
      </div>

      {/* Detalhes da bomba selecionada */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Especificações</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Fabricante:</span>
            <span className="ml-2 font-medium">{selectedPump.manufacturer}</span>
          </div>
          <div>
            <span className="text-gray-600">Tipo:</span>
            <span className="ml-2 font-medium">{selectedPump.type}</span>
          </div>
          <div>
            <span className="text-gray-600">Rendimento:</span>
            <span className="ml-2 font-medium">{selectedPump.efficiency}%</span>
          </div>
          <div>
            <span className="text-gray-600">NPSHr:</span>
            <span className="ml-2 font-medium">{selectedPump.npshr} mca</span>
          </div>
          <div>
            <span className="text-gray-600">Potência:</span>
            <span className="ml-2 font-medium">{selectedPump.power} cv</span>
          </div>
          <div>
            <span className="text-gray-600">Rotação:</span>
            <span className="ml-2 font-medium">{selectedPump.rotation} rpm</span>
          </div>
        </div>
      </div>
    </div>
  );
}