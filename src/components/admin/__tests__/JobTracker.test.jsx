import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import JobTracker from '../JobTracker';
import * as firestore from 'firebase/firestore';

// ==========================================
// 1. MOCKS
// ==========================================

// Mock Firebase Logic
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(),
    addDoc: vi.fn(),
    doc: vi.fn(),
    onSnapshot: vi.fn(),
    serverTimestamp: vi.fn(),
  };
});

vi.mock('../../lib/db', () => ({ db: {} }));

// Mock the Child Component (Dashboard)
// We don't want to test the Dashboard here (it has its own test),
// we just want to prove that JobTracker renders it when 'complete'.
vi.mock('../AnalysisDashboard', () => ({
  default: () => <div data-testid="analysis-dashboard">Dashboard Loaded</div>
}));

// Mock Framer Motion to avoid animation delays
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('JobTracker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits data, listens for AI updates, and transitions to dashboard', async () => {
    // 1. Setup API Mocks
    const mockAddDoc = vi.fn().mockResolvedValue({ id: 'test-doc-123' });
    vi.spyOn(firestore, 'addDoc').mockImplementation(mockAddDoc);

    // Capture the onSnapshot callback so we can fire it manually
    let snapshotCallback;
    const mockUnsubscribe = vi.fn();
    vi.spyOn(firestore, 'onSnapshot').mockImplementation((docRef, callback) => {
      snapshotCallback = callback;
      return mockUnsubscribe;
    });

    render(<JobTracker />);

    // 2. Fill Out Form
    fireEvent.change(screen.getByPlaceholderText(/e.g. Acme Corp/i), { target: { value: 'Cyberdyne Systems' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. Senior React Developer/i), { target: { value: 'AI Architect' } });
    fireEvent.change(screen.getByPlaceholderText(/Paste the full job description/i), { target: { value: 'Build Skynet.' } });

    // 3. Click "Analyze Job" (Updated Button Text)
    const analyzeBtn = screen.getByRole('button', { name: /Analyze Job/i });
    expect(analyzeBtn).toBeDefined();
    fireEvent.click(analyzeBtn);

    // 4. Verify Firestore Write
    expect(mockAddDoc).toHaveBeenCalled();
    
    // 5. Wait for Listener to Attach
    await waitFor(() => expect(snapshotCallback).toBeDefined());

    // --- PHASE A: PROCESSING ---
    // Simulate Firestore update: ai_status = 'processing'
    act(() => {
      snapshotCallback({
        exists: () => true,
        data: () => ({ ai_status: 'processing' })
      });
    });

    // Check for "Pulsing Brain" UI
    expect(await screen.findByText(/Analyzing Vectors.../i)).toBeInTheDocument();

    // --- PHASE B: COMPLETE ---
    // Simulate Firestore update: ai_status = 'complete'
    act(() => {
      snapshotCallback({
        exists: () => true,
        data: () => ({ 
          ai_status: 'complete',
          match_score: 95,
          tailored_summary: 'Perfect match.'
        })
      });
    });

    // Check that Dashboard is rendered
    expect(await screen.findByTestId('analysis-dashboard')).toBeInTheDocument();
  });

  it('displays error message if submission fails', async () => {
    // Force addDoc to fail
    vi.spyOn(firestore, 'addDoc').mockRejectedValue(new Error('Permission Denied'));

    render(<JobTracker />);

    // Fill minimal data
    fireEvent.change(screen.getByPlaceholderText(/e.g. Acme Corp/i), { target: { value: 'Fail Corp' } });
    fireEvent.change(screen.getByPlaceholderText(/Paste the full job description/i), { target: { value: 'Test' } });

    // Click Analyze
    fireEvent.click(screen.getByRole('button', { name: /Analyze Job/i }));

    // Verify Error Message
    expect(await screen.findByText(/Permission Denied/i)).toBeInTheDocument();
  });
});
