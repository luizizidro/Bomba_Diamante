import { describe, it, expect } from 'vitest';
import { pumpModels } from '../pumpModels';

describe('pumpModels', () => {
  it('should contain all required pump models', () => {
    expect(pumpModels).toHaveLength(3);
    
    const pumpIds = pumpModels.map(pump => pump.id);
    expect(pumpIds).toContain('bc21-r1');
    expect(pumpIds).toContain('bc21-r2');
    expect(pumpIds).toContain('bomba-diamante');
  });

  it('should have valid pump properties', () => {
    pumpModels.forEach(pump => {
      expect(pump.id).toBeTruthy();
      expect(pump.name).toBeTruthy();
      expect(pump.manufacturer).toBeTruthy();
      expect(pump.type).toBeTruthy();
      expect(pump.efficiency).toBeGreaterThan(0);
      expect(pump.efficiency).toBeLessThanOrEqual(100);
      expect(pump.npshr).toBeGreaterThan(0);
      expect(pump.power).toBeGreaterThan(0);
      expect(pump.rotation).toBeGreaterThan(0);
      expect(pump.maxFlow).toBeGreaterThan(0);
      expect(pump.maxHead).toBeGreaterThan(0);
    });
  });

  it('should have Bomba Diamante with negative minHead', () => {
    const bombaDiamante = pumpModels.find(pump => pump.id === 'bomba-diamante');
    
    expect(bombaDiamante).toBeDefined();
    expect(bombaDiamante?.minHead).toBe(-10);
    expect(bombaDiamante?.maxHead).toBe(200);
    expect(bombaDiamante?.maxFlow).toBe(180);
  });

  it('should have BC-21 models with correct specifications', () => {
    const bc21r1 = pumpModels.find(pump => pump.id === 'bc21-r1');
    const bc21r2 = pumpModels.find(pump => pump.id === 'bc21-r2');
    
    expect(bc21r1).toBeDefined();
    expect(bc21r2).toBeDefined();
    
    expect(bc21r1?.manufacturer).toBe('Indústrias Schneider');
    expect(bc21r2?.manufacturer).toBe('Indústrias Schneider');
    
    expect(bc21r1?.type).toBe('Centrífuga Monoestágio');
    expect(bc21r2?.type).toBe('Centrífuga Monoestágio');
    
    expect(bc21r1?.rotation).toBe(3500);
    expect(bc21r2?.rotation).toBe(3500);
  });

  it('should have unique pump IDs', () => {
    const ids = pumpModels.map(pump => pump.id);
    const uniqueIds = [...new Set(ids)];
    
    expect(ids).toHaveLength(uniqueIds.length);
  });

  it('should have realistic pump specifications', () => {
    pumpModels.forEach(pump => {
      // Eficiência deve estar em uma faixa realista
      expect(pump.efficiency).toBeGreaterThan(30);
      expect(pump.efficiency).toBeLessThan(90);
      
      // NPSH deve ser positivo e realista
      expect(pump.npshr).toBeGreaterThan(0);
      expect(pump.npshr).toBeLessThan(50);
      
      // Potência deve ser positiva
      expect(pump.power).toBeGreaterThan(0);
      expect(pump.power).toBeLessThan(100);
      
      // Rotação deve estar em faixas típicas
      expect(pump.rotation).toBeGreaterThan(1000);
      expect(pump.rotation).toBeLessThan(4000);
      
      // Vazão e altura máximas devem ser positivas
      expect(pump.maxFlow).toBeGreaterThan(0);
      expect(pump.maxHead).toBeGreaterThan(0);
    });
  });
});