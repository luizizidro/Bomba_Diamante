import React, { useState, useMemo } from 'react';
import { PumpSelector } from './components/PumpSelector';
import { PumpChart } from './components/PumpChart';
import { ControlPanel } from './components/ControlPanel';
import { pumpModels } from './data/pumpModels';
import { generatePumpCurves } from './utils/pumpCalculations';
import { Wrench } from 'lucide-react';

function App() {
  const [selectedPump, setSelectedPump] = useState(pumpModels[0]);
  const [flow, setFlow] = useState(selectedPump.maxFlow * 0.6);
  const [head, setHead] = useState(selectedPump.maxHead * 0.7);
  const [calculatedPoint, setCalculatedPoint] = useState<{ flow: number; head: number } | null>(null);

  // Atualizar flow e head quando a bomba mudar
  React.useEffect(() => {
    setFlow(selectedPump.maxFlow * 0.6);
    setHead(selectedPump.maxHead * 0.7);
    setCalculatedPoint(null); // Limpar ponto calculado quando trocar de bomba
  }, [selectedPump]);

  const chartData = useMemo(() => generatePumpCurves(selectedPump), [selectedPump]);

  const handleCalculate = () => {
    setCalculatedPoint({ flow, head });
  };

  const handleClearPoint = () => {
    setCalculatedPoint(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Wrench className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sistema de Seleção de Bombas</h1>
              <p className="text-gray-600 mt-1">Trabalho Sistema Fluído Mecânico / Prof. Wilson Alano</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Painel de Controles - Lado Esquerdo */}
          <div className="xl:col-span-1 space-y-6">
            <PumpSelector
              pumps={pumpModels}
              selectedPump={selectedPump}
              onPumpSelect={setSelectedPump}
            />
            
            <ControlPanel
              pump={selectedPump}
              flow={flow}
              head={head}
              onFlowChange={setFlow}
              onHeadChange={setHead}
              onCalculate={handleCalculate}
              onClearPoint={handleClearPoint}
              hasCalculatedPoint={calculatedPoint !== null}
            />
          </div>

          {/* Gráfico - Lado Direito */}
          <div className="xl:col-span-2">
            <PumpChart
              pump={selectedPump}
              chartData={chartData}
              controlPoint={calculatedPoint}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;