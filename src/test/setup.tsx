import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: {},
  LinearScale: {},
  PointElement: {},
  LineElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
}));

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Line: vi.fn().mockImplementation(({ data, options }) => {
    return (
      <div 
        data-testid="chart" 
        data-chart-data={JSON.stringify(data)} 
        data-chart-options={JSON.stringify(options)}
      >
        Chart Component
      </div>
    );
  }),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));