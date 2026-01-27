#!/bin/bash

# ==========================================
# 🧪 SPRINT 17.3: TEST SUITE INSTALLER
# ==========================================

echo "🧪 Installing Analysis Dashboard Tests..."

# Ensure directory exists
mkdir -p src/components/admin/__tests__

# Write the Test File
cat << 'JSX' > src/components/admin/__tests__/AnalysisDashboard.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AnalysisDashboard from '../AnalysisDashboard';

// ==========================================
// 1. ENVIRONMENT MOCKING
// ==========================================

// 🎥 Mock Framer Motion
// We replace animated components with standard HTML elements to avoid 
// animation delays and JS-based styling issues in JSDOM.
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layout, initial, animate, exit, ...props }) => (
      <div {...props}>{children}</div>
    ),
    circle: ({ children, initial, animate, transition, ...props }) => (
      <circle {...props}>{children}</circle>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// 📋 Mock Navigator Clipboard
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('AnalysisDashboard Component', () => {
  const mockOnReset = vi.fn();
  
  const fullMockData = {
    match_score: 85,
    keywords_missing: ['TypeScript', 'Docker', 'AWS'],
    suggested_projects: ['pwc_proj_1'],
    tailored_summary: 'This is a tailored summary for the candidate.',
    gap_analysis: 'You need more cloud experience.'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- TEST CASE 1: HAPPY PATH ---
  it('renders the dashboard with correct data', () => {
    render(<AnalysisDashboard data={fullMockData} onReset={mockOnReset} />);

    // Check Score
    expect(screen.getByText('85%')).toBeDefined();
    
    // Check Summary
    expect(screen.getByText(fullMockData.tailored_summary)).toBeDefined();
    
    // Check Missing Keywords
    expect(screen.getByText('TypeScript')).toBeDefined();
    expect(screen.getByText('Docker')).toBeDefined();
    expect(screen.getByText('AWS')).toBeDefined();
  });

  // --- TEST CASE 2: VISUAL LOGIC (GAUGE COLOR) ---
  it('renders correct gauge color based on score thresholds', () => {
    const { rerender } = render(<AnalysisDashboard data={{ match_score: 85 }} />); // Green (>80)
    let gauge = screen.getByTestId('gauge-circle');
    expect(gauge).toHaveAttribute('stroke', '#10b981');

    rerender(<AnalysisDashboard data={{ match_score: 70 }} />); // Yellow (60-79)
    gauge = screen.getByTestId('gauge-circle');
    expect(gauge).toHaveAttribute('stroke', '#f59e0b');

    rerender(<AnalysisDashboard data={{ match_score: 40 }} />); // Red (<60)
    gauge = screen.getByTestId('gauge-circle');
    expect(gauge).toHaveAttribute('stroke', '#ef4444');
  });

  // --- TEST CASE 3: INTERACTION (COPY) ---
  it('copies summary to clipboard and updates button text temporarily', async () => {
    render(<AnalysisDashboard data={fullMockData} onReset={mockOnReset} />);

    const copyBtn = screen.getByRole('button', { name: /Copy Summary/i });
    
    // Initial state
    expect(screen.getByText(/Copy Text/i)).toBeDefined();

    // Click
    fireEvent.click(copyBtn);

    // Verify Mock Call
    expect(mockWriteText).toHaveBeenCalledWith(fullMockData.tailored_summary);

    // Verify UI Feedback
    expect(await screen.findByText(/Copied!/i)).toBeDefined();
  });

  // --- TEST CASE 4: INTERACTION (EXPAND GAP ANALYSIS) ---
  it('toggles the Gap Analysis section visibility', () => {
    render(<AnalysisDashboard data={fullMockData} onReset={mockOnReset} />);

    // 1. Initially hidden
    expect(screen.queryByText(fullMockData.gap_analysis)).toBeNull();

    // 2. Click Toggle
    const toggleBtn = screen.getByText(/VIEW STRATEGIC GAP ANALYSIS/i);
    fireEvent.click(toggleBtn);

    // 3. Now Visible
    expect(screen.getByText(fullMockData.gap_analysis)).toBeDefined();

    // 4. Click Toggle again
    fireEvent.click(toggleBtn);

    // 5. Hidden again
    expect(screen.queryByText(fullMockData.gap_analysis)).toBeNull();
  });

  // --- TEST CASE 5: DEFENSIVE RENDERING ---
  it('renders gracefully with empty or missing data', () => {
    // Pass empty object to simulate fresh/broken DB record
    render(<AnalysisDashboard data={{}} onReset={mockOnReset} />);

    // Should default to 0%
    expect(screen.getByText('0%')).toBeDefined();
    
    // Should not crash on missing array maps
    const keywords = screen.queryByText('TypeScript');
    expect(keywords).toBeNull();

    // Summary might be empty but shouldn't throw error
    const copyBtn = screen.getByRole('button', { name: /Copy Summary/i });
    expect(copyBtn).toBeDefined();
  });

  // --- TEST CASE 6: RESET ACTION ---
  it('calls onReset when the start over button is clicked', () => {
    render(<AnalysisDashboard data={fullMockData} onReset={mockOnReset} />);
    
    const resetBtn = screen.getByText(/Start New Application/i);
    fireEvent.click(resetBtn);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});
JSX

echo "✅ Test file created at: src/components/admin/__tests__/AnalysisDashboard.test.jsx"
echo "👉 Run 'npm test' to verify."
