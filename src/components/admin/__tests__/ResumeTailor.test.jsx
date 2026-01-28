import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResumeTailor from '../ResumeTailor';
import JobTracker from '../JobTracker';
import * as firestore from 'firebase/firestore';

// ==========================================
// 1. MOCKS & STUBS
// ==========================================

// 🔥 Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(() => 'mock_doc_ref'),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'test_doc_1' })),
  serverTimestamp: vi.fn(),
  onSnapshot: vi.fn(),
}));

vi.mock('../../lib/db', () => ({ db: {} }));

// 🎥 Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layout, initial, animate, exit, transition, ...props }) => <div {...props}>{children}</div>,
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

// 🧩 Mock Sibling Components for Integration Tests
vi.mock('../AnalysisDashboard', () => ({ default: () => <div data-testid="analysis-dashboard">Analysis Dashboard</div> }));
vi.mock('../CoverLetterGenerator', () => ({ default: () => <div data-testid="cover-letter">Cover Letter</div> }));

describe('Feature: Resume Tailor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // PART 1: RESUME TAILOR (UI Component)
  // ==========================================
  describe('ResumeTailor Component', () => {
    const appId = 'app_123';

    it('renders Idle State correctly', () => {
      const data = { tailor_status: 'idle', tailored_bullets: [] };
      render(<ResumeTailor applicationId={appId} applicationData={data} />);
      
      expect(screen.getByText(/Auto-Tailor Resume/i)).toBeDefined();
      expect(screen.getByText(/Click "Auto-Tailor"/i)).toBeDefined();
    });

    it('renders Processing State correctly', () => {
      const data = { tailor_status: 'processing', tailored_bullets: [] };
      render(<ResumeTailor applicationId={appId} applicationData={data} />);
      
      expect(screen.getByText(/Optimizing History.../i)).toBeDefined();
    });

    it('renders Results State (Diff View)', () => {
      const data = {
        tailor_status: 'complete',
        tailored_bullets: [
          {
            original: 'Managed SQL DB.',
            optimized: 'Orchestrated Azure SQL migration.',
            reasoning: 'Added cloud keywords.',
            confidence: 95
          }
        ]
      };
      render(<ResumeTailor applicationId={appId} applicationData={data} />);

      // Verify Original (Red Context)
      expect(screen.getByText('Managed SQL DB.')).toBeDefined();
      expect(screen.getByText('Original')).toBeDefined();

      // Verify Optimized (Green Context)
      expect(screen.getByText('Orchestrated Azure SQL migration.')).toBeDefined();
      expect(screen.getByText('Optimized')).toBeDefined();

      // Verify Metadata
      expect(screen.getByText('Added cloud keywords.')).toBeDefined();
      expect(screen.getByText('95% Match')).toBeDefined();
    });

    it('copies text to clipboard when copy button is clicked', async () => {
      const data = {
        tailor_status: 'complete',
        tailored_bullets: [{ original: 'Old', optimized: 'New Bullet', reasoning: 'Test', confidence: 90 }]
      };
      render(<ResumeTailor applicationId={appId} applicationData={data} />);

      const copyBtn = screen.getByTitle('Copy to Clipboard');
      fireEvent.click(copyBtn);

      expect(mockWriteText).toHaveBeenCalledWith('New Bullet');
    });

    it('triggers Firestore update when Auto-Tailor is clicked', async () => {
      const data = { tailor_status: 'idle', tailored_bullets: [] };
      render(<ResumeTailor applicationId={appId} applicationData={data} />);

      const generateBtn = screen.getByText(/Auto-Tailor Resume/i);
      fireEvent.click(generateBtn);

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        'mock_doc_ref',
        expect.objectContaining({ tailor_status: 'pending', tailored_bullets: [] })
      );
    });
  });

  // ==========================================
  // PART 2: JOB TRACKER (Integration)
  // ==========================================
  describe('JobTracker Integration', () => {
    it('switches tabs and renders the Resume Tailor component', async () => {
      // 1. Setup Mock Snapshot
      firestore.onSnapshot.mockImplementation((docRef, callback) => {
        callback({
          exists: () => true,
          data: () => ({
            company: 'Test Corp',
            role: 'Dev',
            ai_status: 'complete',
            tailor_status: 'idle',
            tailored_bullets: []
          })
        });
        return vi.fn();
      });

      render(<JobTracker />);

      // 2. Simulate User submitting the form
      fireEvent.change(screen.getByPlaceholderText('Company Name'), { target: { value: 'Test Corp' } });
      fireEvent.change(screen.getByPlaceholderText('Role Title'), { target: { value: 'Dev' } });
      fireEvent.change(screen.getByPlaceholderText('Paste Job Description...'), { target: { value: 'Job Desc' } });
      fireEvent.click(screen.getByText('Analyze Job'));

      // 3. Wait for Dashboard
      await waitFor(() => {
        expect(screen.getByTestId('analysis-dashboard')).toBeDefined();
      });

      // 4. Click the "Resume Tailor" Tab
      const tailorTab = screen.getByText('Resume Tailor');
      fireEvent.click(tailorTab);

      // 5. Verify Resume Tailor is visible
      expect(screen.getByText(/Auto-Tailor Resume/i)).toBeDefined();
    });
  });
});
