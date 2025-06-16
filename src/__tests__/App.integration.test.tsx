import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock Chart.js components
vi.mock('react-chartjs-2', () => ({
  Line: vi.fn(({ data, options }) => (
    <div data-testid="pump-chart" data-chart-data={JSON.stringify(data)}>
      Pump Chart Component
    </div>
  )),
}));

describe('App Integration Tests', () => {
  it('should render all main components', () => {
    render(<App />);
    
    // Header
    expect(screen.getByText('Sistema de Seleção de Bombas')).toBeInTheDocument();
    expect(screen.getByText('Análise de Performance e Características Técnicas')).toBeInTheDocument();
    
    // Components
    expect(screen.getByText('Seleção de Bomba')).toBeInTheDocument();
    expect(screen.getByText('Controles de Operação')).toBeInTheDocument();
    expect(screen.getByTestId('pump-chart')).toBeInTheDocument();
  });

  it('should update flow and head when pump selection changes', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Verificar valores iniciais
    const flowInput = screen.getByDisplayValue(/30/); // Valor inicial baseado na primeira bomba
    const headInput = screen.getByDisplayValue(/35/); // Valor inicial baseado na primeira bomba
    
    expect(flowInput).toBeInTheDocument();
    expect(headInput).toBeInTheDocument();
    
    // Mudar seleção de bomba
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'bomba-diamante');
    
    // Aguardar atualização dos valores
    await waitFor(() => {
      const newFlowInput = screen.getByDisplayValue(/108/); // 60% de 180
      const newHeadInput = screen.getByDisplayValue(/140/); // 70% de 200
      
      expect(newFlowInput).toBeInTheDocument();
      expect(newHeadInput).toBeInTheDocument();
    });
  });

  it('should show and hide calculated point correctly', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Verificar que não há ponto calculado inicialmente
    expect(screen.queryByText('✓ Ponto calculado exibido no gráfico')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Limpar ponto do gráfico')).not.toBeInTheDocument();
    
    // Clicar no botão calcular
    const calculateButton = screen.getByText('Calcular');
    await user.click(calculateButton);
    
    // Verificar que o ponto foi calculado
    expect(screen.getByText('✓ Ponto calculado exibido no gráfico')).toBeInTheDocument();
    expect(screen.getByTitle('Limpar ponto do gráfico')).toBeInTheDocument();
    
    // Limpar o ponto
    const clearButton = screen.getByTitle('Limpar ponto do gráfico');
    await user.click(clearButton);
    
    // Verificar que o ponto foi removido
    expect(screen.queryByText('✓ Ponto calculado exibido no gráfico')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Limpar ponto do gráfico')).not.toBeInTheDocument();
  });

  it('should clear calculated point when pump changes', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Calcular um ponto
    const calculateButton = screen.getByText('Calcular');
    await user.click(calculateButton);
    
    expect(screen.getByText('✓ Ponto calculado exibido no gráfico')).toBeInTheDocument();
    
    // Mudar a bomba
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'bc21-r2');
    
    // Verificar que o ponto foi limpo
    await waitFor(() => {
      expect(screen.queryByText('✓ Ponto calculado exibido no gráfico')).not.toBeInTheDocument();
    });
  });

  it('should handle flow and head input changes', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Encontrar inputs de vazão e altura
    const flowInput = screen.getByLabelText('Vazão (m³/h)');
    const headInput = screen.getByLabelText('Altura (m)');
    
    // Alterar valores
    await user.clear(flowInput);
    await user.type(flowInput, '20');
    
    await user.clear(headInput);
    await user.type(headInput, '60');
    
    // Verificar que os valores foram atualizados no ponto de operação
    await waitFor(() => {
      expect(screen.getByText('20.0')).toBeInTheDocument();
      expect(screen.getByText('60.0')).toBeInTheDocument();
    });
  });

  it('should handle negative head values for Bomba Diamante', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Selecionar Bomba Diamante
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'bomba-diamante');
    
    // Aguardar carregamento
    await waitFor(() => {
      expect(screen.getByText('Bomba Diamante - Bomba Personalizada (46.5 cv)')).toBeInTheDocument();
    });
    
    // Alterar altura para valor negativo
    const headInput = screen.getByLabelText('Altura (m)');
    await user.clear(headInput);
    await user.type(headInput, '-5');
    
    // Verificar que o valor negativo é aceito e exibido
    await waitFor(() => {
      const negativeValue = screen.getByText('-5.0');
      expect(negativeValue).toBeInTheDocument();
      expect(negativeValue).toHaveClass('text-red-600');
    });
  });

  it('should display pump specifications correctly', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Verificar especificações da primeira bomba
    expect(screen.getByText('Indústrias Schneider')).toBeInTheDocument();
    expect(screen.getByText('Centrífuga Monoestágio')).toBeInTheDocument();
    
    // Mudar para Bomba Diamante
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'bomba-diamante');
    
    // Verificar especificações da Bomba Diamante
    await waitFor(() => {
      expect(screen.getByText('Bomba Personalizada')).toBeInTheDocument();
      expect(screen.getByText('Centrífuga Industrial')).toBeInTheDocument();
      expect(screen.getByText('46.5 cv')).toBeInTheDocument();
      expect(screen.getByText('1700 rpm')).toBeInTheDocument();
    });
  });

  it('should maintain responsive layout structure', () => {
    render(<App />);
    
    // Verificar estrutura de grid
    const mainGrid = screen.getByRole('main').querySelector('.grid');
    expect(mainGrid).toHaveClass('grid-cols-1', 'xl:grid-cols-3');
    
    // Verificar que os componentes estão presentes
    expect(screen.getByText('Seleção de Bomba')).toBeInTheDocument();
    expect(screen.getByText('Controles de Operação')).toBeInTheDocument();
    expect(screen.getByTestId('pump-chart')).toBeInTheDocument();
  });

  it('should handle edge cases with boundary values', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Testar valor zero
    const flowInput = screen.getByLabelText('Vazão (m³/h)');
    await user.clear(flowInput);
    await user.type(flowInput, '0');
    
    const headInput = screen.getByLabelText('Altura (m)');
    await user.clear(headInput);
    await user.type(headInput, '0');
    
    // Calcular ponto
    const calculateButton = screen.getByText('Calcular');
    await user.click(calculateButton);
    
    // Verificar que o sistema lida com valores zero
    await waitFor(() => {
      expect(screen.getByText('✓ Ponto calculado exibido no gráfico')).toBeInTheDocument();
    });
  });
});