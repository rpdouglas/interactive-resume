import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnalysisDashboard from '../AnalysisDashboard';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layout, initial, animate, exit, ...props }) => <div {...props}>{children}</div>,
    circle: ({ children, initial, animate, transition, ...props }) => <circle {...props}>{children}</circle>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock Clipboard
const mockWriteText = vi.fn();
Object.assign(navigator, { clipboard: { writeText: mockWriteText } });

describe('AnalysisDashboard Component', () => {
  const mockOnReset = vi.fn();
  const fullMockData = {
    match_score: 85,
    keywords_missing: ['TypeScript', 'Docker', 'AWS'],
    suggested_projects: ['pwc_proj_1'],
    tailored_summary: 'This is a tailored summary.',
    gap_analysis: ['You need more cloud experience.']
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders correct gauge color based on score', () => {
    const { rerender } = render(<AnalysisDashboard data={{ match_score: 85 }} />);
    let gauge = screen.getByTestId('gauge-circle'); // ✅ Now exists
    expect(gauge).toHaveAttribute('stroke', '#10b981');
  });

  it('copies summary to clipboard', async () => {
    render(<AnalysisDashboard data={fullMockData} onReset={mockOnReset} />);
    const copyBtn = screen.getByText(/Copy Summary/i); // ✅ Text matched
    fireEvent.click(copyBtn);
    expect(mockWriteText).toHaveBeenCalledWith(fullMockData.tailored_summary);
    expect(await screen.findByText(/Copied!/i)).toBeDefined();
  });

  it('toggles the Gap Analysis section visibility', () => {
    render(<AnalysisDashboard data={fullMockData} onReset={mockOnReset} />);
    
    // 1. Initially hidden (logic: AnimatePresence children are null)
    expect(screen.queryByText(/You need more cloud experience/i)).toBeNull();

    // 2. Click Toggle
    const toggleBtn = screen.getByText(/Strategic Gap Analysis/i);
    fireEvent.click(toggleBtn);

    // 3. Now Visible
    expect(screen.getByText(/You need more cloud experience/i)).toBeDefined();
  });
});
