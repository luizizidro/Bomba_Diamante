import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ControlPanel } from '../ControlPanel';
import { PumpModel } from '../../types/pump';

describe('ControlPanel', () => {
  const mockPump: PumpModel = {
    id: 'test-pump',
    name: 'Test Pump',
    manufacturer: 'Test Manufacturer',
    type: 'Centrífuga',
    efficiency: 75,
    npshr: 5,
    power: 10,
    rotation: 3500,
    maxFlow: 50,
    maxHead: 100,
  };

  const mockBombaDiamante: PumpModel = {
    id: 'bomba-diamante',
    name: 'Bomba Diamante',
    manufacturer: 'Test Manufacturer',
    type: 'Centrífuga Industrial',
    efficiency: 75,
    npshr: 25,
    power: 46.5,
    rotation: 1700,
    maxFlow: 180,
    maxHead: 200,
    minHead: -10,
  };

  const defaultProps = {
    pump: mockPump,
    flow: 25,
    head: 50,
    onFlowChange: vi.fn(),
    onHeadChange: vi.fn(),
    onCalculate: vi.fn(),
    onClearPoint: vi.fn(),
    hasCalculatedPoint: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render control panel with correct title', () => {
    render(<ControlPanel {...defaultProps} />);
    
    expect(screen.getByText('Controles de Operação')).toBeInTheDocument();
  });

  it('should display current flow and head values', () => {
    render(<ControlPanel {...defaultProps} />);
    
    const flowInput = screen.getByDisplayValue('25');
    const headInput = screen.getByDisplayValue('50');
    
    expect(flowInput).toBeInTheDocument();
    expect(headInput).toBeInTheDocument();
  });

  it('should call onFlowChange when flow input changes', async () => {
    const user = userEvent.setup();
    render(<ControlPanel {...defaultProps} />);
    
    const flowInput = screen.getByDisplayValue('25');
    await user.clear(flowInput);
    await user.type(flowInput, '30');
    
    expect(defaultProps.onFlowChange).toHaveBeenCalledWith(30);
  });

  it('should call onHeadChange when head input changes', async () => {
    const user = userEvent.setup();
    render(<ControlPanel {...defaultProps} />);
    
    const headInput = screen.getByDisplayValue('50');
    await user.clear(headInput);
    await user.type(headInput, '75');
    
    expect(defaultProps.onHeadChange).toHaveBeenCalledWith(75);
  });

  it('should call onCalculate when calculate button is clicked', async () => {
    const user = userEvent.setup();
    render(<ControlPanel {...defaultProps} />);
    
    const calculateButton = screen.getByText('Calcular');
    await user.click(calculateButton);
    
    expect(defaultProps.onCalculate).toHaveBeenCalledTimes(1);
  });

  it('should show clear button when hasCalculatedPoint is true', () => {
    render(<ControlPanel {...defaultProps} hasCalculatedPoint={true} />);
    
    const clearButton = screen.getByTitle('Limpar ponto do gráfico');
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when hasCalculatedPoint is false', () => {
    render(<ControlPanel {...defaultProps} hasCalculatedPoint={false} />);
    
    const clearButton = screen.queryByTitle('Limpar ponto do gráfico');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should call onClearPoint when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<ControlPanel {...defaultProps} hasCalculatedPoint={true} />);
    
    const clearButton = screen.getByTitle('Limpar ponto do gráfico');
    await user.click(clearButton);
    
    expect(defaultProps.onClearPoint).toHaveBeenCalledTimes(1);
  });

  it('should show success message when point is calculated', () => {
    render(<ControlPanel {...defaultProps} hasCalculatedPoint={true} />);
    
    expect(screen.getByText('✓ Ponto calculado exibido no gráfico')).toBeInTheDocument();
  });

  it('should handle negative head values for Bomba Diamante', () => {
    render(<ControlPanel {...defaultProps} pump={mockBombaDiamante} head={-5} />);
    
    const headInput = screen.getByDisplayValue('-5');
    expect(headInput).toBeInTheDocument();
    expect(headInput).toHaveAttribute('min', '-10');
  });

  it('should display correct min/max values for Bomba Diamante', () => {
    render(<ControlPanel {...defaultProps} pump={mockBombaDiamante} />);
    
    expect(screen.getByText('Mínimo: -10 m, Máximo: 200 m')).toBeInTheDocument();
  });

  it('should display correct max value for regular pump', () => {
    render(<ControlPanel {...defaultProps} />);
    
    expect(screen.getByText('Máximo: 100 m')).toBeInTheDocument();
  });

  it('should display current operation point values', () => {
    render(<ControlPanel {...defaultProps} flow={30.5} head={-2.5} />);
    
    expect(screen.getByText('30.5')).toBeInTheDocument();
    expect(screen.getByText('-2.5')).toBeInTheDocument();
    expect(screen.getByText('Vazão')).toBeInTheDocument();
    expect(screen.getByText('Altura')).toBeInTheDocument();
  });

  it('should apply red color to negative head values', () => {
    render(<ControlPanel {...defaultProps} head={-5} />);
    
    const headValue = screen.getByText('-5.0');
    expect(headValue).toHaveClass('text-red-600');
  });

  it('should apply blue color to positive head values', () => {
    render(<ControlPanel {...defaultProps} head={50} />);
    
    const headValue = screen.getByText('50.0');
    expect(headValue).toHaveClass('text-blue-600');
  });
});