import { describe, it, expect } from 'vitest';
import { generatePumpCurves, calculatePumpPoint } from '../pumpCalculations';
import { PumpModel } from '../../types/pump';

describe('pumpCalculations', () => {
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

  describe('generatePumpCurves', () => {
    it('should generate curves with correct number of points', () => {
      const curves = generatePumpCurves(mockPump);
      
      expect(curves.flow).toHaveLength(21);
      expect(curves.head).toHaveLength(21);
      expect(curves.power).toHaveLength(21);
      expect(curves.npsh).toHaveLength(21);
      expect(curves.efficiency).toHaveLength(21);
    });

    it('should generate flow points from 0 to maxFlow', () => {
      const curves = generatePumpCurves(mockPump);
      
      expect(curves.flow[0]).toBe(0);
      expect(curves.flow[curves.flow.length - 1]).toBe(mockPump.maxFlow);
    });

    it('should generate head curve starting at maxHead for zero flow', () => {
      const curves = generatePumpCurves(mockPump);
      
      expect(curves.head[0]).toBeCloseTo(mockPump.maxHead, 1);
    });

    it('should handle Bomba Diamante with negative head values', () => {
      const curves = generatePumpCurves(mockBombaDiamante);
      
      // Primeiro ponto deve ser próximo ao maxHead
      expect(curves.head[0]).toBeCloseTo(mockBombaDiamante.maxHead, 1);
      
      // Último ponto deve ser próximo ao minHead
      expect(curves.head[curves.head.length - 1]).toBeCloseTo(mockBombaDiamante.minHead || 0, 5);
    });

    it('should generate efficiency values within valid range', () => {
      const curves = generatePumpCurves(mockPump);
      
      curves.efficiency.forEach(eff => {
        expect(eff).toBeGreaterThanOrEqual(0);
        expect(eff).toBeLessThanOrEqual(mockPump.efficiency);
      });
    });

    it('should generate power values starting low and increasing', () => {
      const curves = generatePumpCurves(mockPump);
      
      expect(curves.power[0]).toBeLessThan(curves.power[curves.power.length - 1]);
    });

    it('should generate NPSH values that increase with flow', () => {
      const curves = generatePumpCurves(mockPump);
      
      expect(curves.npsh[0]).toBeLessThan(curves.npsh[curves.npsh.length - 1]);
    });
  });

  describe('calculatePumpPoint', () => {
    it('should calculate pump point with valid values', () => {
      const flow = 25;
      const head = 75;
      const result = calculatePumpPoint(mockPump, flow, head);
      
      expect(result.flow).toBe(flow);
      expect(result.head).toBe(head);
      expect(result.power).toBeGreaterThan(0);
      expect(result.npsh).toBeGreaterThan(0);
      expect(result.efficiency).toBeGreaterThan(0);
      expect(result.efficiency).toBeLessThanOrEqual(100);
    });

    it('should handle edge case with zero flow', () => {
      const flow = 0;
      const head = 100;
      const result = calculatePumpPoint(mockPump, flow, head);
      
      expect(result.flow).toBe(flow);
      expect(result.head).toBe(head);
      expect(result.power).toBeGreaterThanOrEqual(0);
      expect(result.npsh).toBeGreaterThanOrEqual(0);
    });

    it('should handle maximum flow case', () => {
      const flow = mockPump.maxFlow;
      const head = 20;
      const result = calculatePumpPoint(mockPump, flow, head);
      
      expect(result.flow).toBe(flow);
      expect(result.head).toBe(head);
      expect(result.power).toBeGreaterThan(0);
    });

    it('should handle Bomba Diamante with negative head', () => {
      const flow = 150;
      const head = -5;
      const result = calculatePumpPoint(mockBombaDiamante, flow, head);
      
      expect(result.flow).toBe(flow);
      expect(result.head).toBe(head);
      expect(result.power).toBeGreaterThan(0);
      expect(result.npsh).toBeGreaterThan(0);
    });
  });

  describe('interpolateValue function (internal)', () => {
    it('should interpolate values correctly between points', () => {
      // Testando indiretamente através de calculatePumpPoint
      const flow1 = 10;
      const flow2 = 15;
      const result1 = calculatePumpPoint(mockPump, flow1, 80);
      const result2 = calculatePumpPoint(mockPump, flow2, 80);
      const resultMid = calculatePumpPoint(mockPump, 12.5, 80);
      
      // O valor interpolado deve estar entre os dois pontos
      expect(resultMid.power).toBeGreaterThan(Math.min(result1.power, result2.power));
      expect(resultMid.power).toBeLessThan(Math.max(result1.power, result2.power));
    });
  });
});