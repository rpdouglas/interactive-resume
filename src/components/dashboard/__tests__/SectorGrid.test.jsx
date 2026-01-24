import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SectorGrid from '../SectorGrid';
import sectors from '../../../data/sectors.json';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, className, ...props }) => (
      <button onClick={onClick} className={className} {...props}>
        {children}
      </button>
    ),
  },
}));

describe('SectorGrid Component', () => {
  it('renders all sectors defined in sectors.json', () => {
    render(<SectorGrid activeSector={null} onSectorClick={() => {}} />);
    sectors.forEach(sector => {
      expect(screen.getByText(sector.label)).toBeDefined();
    });
  });

  it('calls onSectorClick when a sector is clicked', () => {
    const mockOnClick = vi.fn();
    render(<SectorGrid activeSector={null} onSectorClick={mockOnClick} />);
    fireEvent.click(screen.getByText('Public Sector'));
    expect(mockOnClick).toHaveBeenCalledWith('Public Sector');
  });

  it('applies active styling for selected sector', () => {
    render(<SectorGrid activeSector="Retail" onSectorClick={() => {}} />);
    const retailBtn = screen.getByText('Retail').closest('button');
    expect(retailBtn.className).toContain('bg-blue-600');
  });
});
