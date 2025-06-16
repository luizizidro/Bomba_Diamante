import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PumpSelector } from '../PumpSelector';
import { pumpModels } from '../../data/pumpModels';

describe('PumpSelector', () => {
  const mockOnPumpSelect = vi.fn();

  const defaultProps = {
    pumps: pumpModels,
    selectedPump: pumpModels[0],
    onPumpSelect: mockOnPumpSelect,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render pump selector with correct title', () => {
    render(<PumpSelector {...defaultProps} />);
    
    expect(screen.getByText('Seleção de Bomba')).toBeInTheDocument();
  });

  it('should display all pump options in select', () => {
    render(<PumpSelector {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    // Verificar se todas as bombas estão nas opções
    pumpModels.forEach(pump => {
      const optionText = `${pump.name} - ${pump.manufacturer} (${pump.power} cv)`;
      expect(screen.getByText(optionText)).toBeInTheDocument();
    });
  });

  it('should show selected pump as current value', () => {
    render(<PumpSelector {...defaultProps} />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe(pumpModels[0].id);
  });

  it('should call onPumpSelect when selection changes', async () => {
    const user = userEvent.setup();
    render(<PumpSelector {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, pumpModels[1].id);
    
    expect(mockOnPumpSelect).toHaveBeenCalledWith(pumpModels[1]);
  });

  it('should display selected pump specifications', () => {
    render(<PumpSelector {...defaultProps} />);
    
    const selectedPump = pumpModels[0];
    
    expect(screen.getByText(selectedPump.manufacturer)).toBeInTheDocument();
    expect(screen.getByText(selectedPump.type)).toBeInTheDocument();
    expect(screen.getByText(`${selectedPump.efficiency}%`)).toBeInTheDocument();
    expect(screen.getByText(`${selectedPump.npshr} mca`)).toBeInTheDocument();
    expect(screen.getByText(`${selectedPump.power} cv`)).toBeInTheDocument();
    expect(screen.getByText(`${selectedPump.rotation} rpm`)).toBeInTheDocument();
  });

  it('should update specifications when pump selection changes', async () => {
    const user = userEvent.setup();
    render(<PumpSelector {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, pumpModels[2].id); // Bomba Diamante
    
    expect(mockOnPumpSelect).toHaveBeenCalledWith(pumpModels[2]);
  });

  it('should render specifications section', () => {
    render(<PumpSelector {...defaultProps} />);
    
    expect(screen.getByText('Especificações')).toBeInTheDocument();
    expect(screen.getByText('Fabricante:')).toBeInTheDocument();
    expect(screen.getByText('Tipo:')).toBeInTheDocument();
    expect(screen.getByText('Rendimento:')).toBeInTheDocument();
    expect(screen.getByText('NPSHr:')).toBeInTheDocument();
    expect(screen.getByText('Potência:')).toBeInTheDocument();
    expect(screen.getByText('Rotação:')).toBeInTheDocument();
  });

  it('should handle empty pump list gracefully', () => {
    render(<PumpSelector {...defaultProps} pumps={[]} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select.children).toHaveLength(0);
  });
});