import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnalysisDashboard from '../AnalysisDashboard';
import CoverLetterGenerator from '../CoverLetterGenerator';
import * as firestore from 'firebase/firestore';

// Mocks
const mockHandlePrint = vi.fn();
vi.mock('react-to-print', () => ({ useReactToPrint: () => mockHandlePrint }));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layout, initial, animate, exit, ...props }) => <div {...props}>{children}</div>,
    circle: ({ children, ...props }) => <circle {...props}>{children}</circle>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

Object.assign(navigator, { clipboard: { writeText: vi.fn() } });

describe('Sprint 19 Features', () => {
  const mockOnReset = vi.fn();
  beforeEach(() => vi.clearAllMocks());

  describe('AnalysisDashboard', () => {
    it('renders structured Gap Analysis after toggling', () => {
      const data = {
        match_score: 75,
        gap_analysis: ["Missing Python", "Need AWS"],
        tailored_summary: "Good fit.",
      };

      render(<AnalysisDashboard data={data} onReset={mockOnReset} />);

      // 1. Find Toggle Button & Click it
      const toggleBtn = screen.getByText(/Strategic Gap Analysis/i);
      fireEvent.click(toggleBtn);

      // 2. NOW check for text
      expect(screen.getByText("Missing Python")).toBeDefined();
      expect(screen.getByText("Need AWS")).toBeDefined();
    });

    it('parses Legacy Gap Analysis string after toggling', () => {
      const data = {
        match_score: 75,
        gap_analysis: "1. Legacy Gap One 2. Legacy Gap Two",
        tailored_summary: "Good fit.",
      };

      render(<AnalysisDashboard data={data} onReset={mockOnReset} />);

      // 1. Find Toggle & Click
      const toggleBtn = screen.getByText(/Strategic Gap Analysis/i);
      fireEvent.click(toggleBtn);

      // 2. Check Text
      expect(screen.getByText(/Legacy Gap One/i)).toBeDefined();
      expect(screen.getByText(/Legacy Gap Two/i)).toBeDefined();
    });

    it('renders Evidence badges', () => {
      const data = {
        match_score: 90,
        suggested_projects: ["proj_a", "proj_b"],
        gap_analysis: [],
      };
      render(<AnalysisDashboard data={data} onReset={mockOnReset} />);
      expect(screen.getByText("proj_a")).toBeDefined();
    });
  });

  describe('CoverLetterGenerator', () => {
    const appId = 'test_123';

    it('displays "Writing..." state', () => {
      render(<CoverLetterGenerator applicationId={appId} applicationData={{ cover_letter_status: 'writing' }} />);
      expect(screen.getByText(/Writing.../i)).toBeDefined();
    });

    it('enters Edit Mode and saves', async () => {
      render(<CoverLetterGenerator applicationId={appId} applicationData={{ cover_letter_status: 'complete', cover_letter_text: 'Draft' }} />);
      
      fireEvent.click(screen.getByText(/Edit Text/i));
      const textarea = screen.getByRole('textbox');
      
      // Wrap updates in act()
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'New Draft' } });
        fireEvent.blur(textarea);
      });

      expect(firestore.updateDoc).toHaveBeenCalled();
    });
  });
});
