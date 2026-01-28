import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JobTracker from '../JobTracker';
import * as firestore from 'firebase/firestore';

// Mock Firebase with ALL required exports
vi.mock('../../lib/db', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(), // 👈 THIS WAS MISSING
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'test_doc_1' })),
  serverTimestamp: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn()
}));

// Mock Children to isolate JobTracker logic
vi.mock('../AnalysisDashboard', () => ({ default: () => <div>Analysis Dashboard</div> }));
vi.mock('../CoverLetterGenerator', () => ({ default: () => <div>Cover Letter Generator</div> }));

describe('JobTracker Component', () => {
  it('submits data and handles state', async () => {
    render(<JobTracker />);

    // 1. Check Initial Render
    expect(screen.getByText(/New Application/i)).toBeDefined();

    // 2. Fill Form
    fireEvent.change(screen.getByPlaceholderText('Company Name'), { target: { value: 'Acme' } });
    fireEvent.change(screen.getByPlaceholderText('Role Title'), { target: { value: 'Dev' } });
    fireEvent.change(screen.getByPlaceholderText('Paste Job Description...'), { target: { value: 'React Job' } });

    // 3. Submit
    const submitBtn = screen.getByText(/Analyze Job/i);
    fireEvent.click(submitBtn);

    // 4. Verify Firestore Call
    expect(firestore.addDoc).toHaveBeenCalled();
  });
});
