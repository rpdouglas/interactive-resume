import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import JobTracker from '../JobTracker';
import * as Firestore from 'firebase/firestore';

// ==========================================
// 1. MOCK ENVIRONMENT (The "Codespaces" Fix)
// ==========================================
vi.stubEnv('VITE_API_KEY', 'test_api_key');
vi.stubEnv('VITE_AUTH_DOMAIN', 'test_auth_domain');
vi.stubEnv('VITE_PROJECT_ID', 'test_project_id');

// ==========================================
// 2. MOCK FIREBASE MODULES
// ==========================================
// Correct path to lib/db from components/admin/__tests__
vi.mock('../../../lib/db', () => ({
  db: {} 
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'MOCK_TIMESTAMP')
}));

describe('JobTracker Component', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // --- TEST CASE 1: RENDER & INITIAL STATE ---
  it('renders the form with empty fields and disabled save button', () => {
    render(<JobTracker />);

    expect(screen.getByText(/New Application/i)).toBeInTheDocument();

    const companyInput = screen.getByPlaceholderText(/e.g. Acme Corp/i);
    const roleInput = screen.getByPlaceholderText(/e.g. Senior React Developer/i);
    // ✅ FIX: Match the actual placeholder text
    const rawTextInput = screen.getByPlaceholderText(/Paste the full job description/i);

    expect(companyInput).toHaveValue('');
    expect(roleInput).toHaveValue('');
    expect(rawTextInput).toHaveValue('');

    const saveBtn = screen.getByRole('button', { name: /Save Application/i });
    expect(saveBtn).toBeDisabled();
  });

  // --- TEST CASE 2: INTERACTION & VALIDATION ---
  it('enables the save button only when required fields are filled', () => {
    render(<JobTracker />);

    const saveBtn = screen.getByRole('button', { name: /Save Application/i });
    
    // Fill Company only
    fireEvent.change(screen.getByPlaceholderText(/e.g. Acme Corp/i), { target: { value: 'Google' } });
    expect(saveBtn).toBeDisabled(); 

    // Fill Raw Text
    // ✅ FIX: Match the actual placeholder text
    fireEvent.change(screen.getByPlaceholderText(/Paste the full job description/i), { target: { value: 'Job Description Text' } });
    
    expect(saveBtn).not.toBeDisabled();
  });

  // --- TEST CASE 3: HAPPY PATH SUBMISSION ---
  it('submits data to Firestore and shows success message', async () => {
    Firestore.addDoc.mockResolvedValue({ id: 'new_doc_id' });

    render(<JobTracker />);

    // Fill Form
    fireEvent.change(screen.getByPlaceholderText(/e.g. Acme Corp/i), { target: { value: 'Google' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. Senior React Developer/i), { target: { value: 'Staff Engineer' } });
    // ✅ FIX: Match the actual placeholder text
    fireEvent.change(screen.getByPlaceholderText(/Paste the full job description/i), { target: { value: 'Do cool stuff.' } });

    // Click Save
    const saveBtn = screen.getByRole('button', { name: /Save Application/i });
    fireEvent.click(saveBtn);

    // Verify Loading
    expect(screen.getByText(/Saving.../i)).toBeInTheDocument();
    expect(saveBtn).toBeDisabled();

    // Verify Firestore Call
    await waitFor(() => {
      expect(Firestore.addDoc).toHaveBeenCalledTimes(1);
    });

    const expectedPayload = {
      company: 'Google',
      role: 'Staff Engineer',
      raw_text: 'Do cool stuff.',
      source_url: '',
      status: 'draft',
      ai_status: 'pending',
      ai_analysis: null,
      created_at: 'MOCK_TIMESTAMP',
      updated_at: 'MOCK_TIMESTAMP'
    };
    
    expect(Firestore.addDoc).toHaveBeenCalledWith(undefined, expectedPayload);

    // Verify Success
    expect(await screen.findByText(/Saved to Drafts/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Acme Corp/i)).toHaveValue(''); 
  });

  // --- TEST CASE 4: ERROR HANDLING ---
  it('displays an error message if Firestore fails', async () => {
    const errorMsg = "Permission Denied: Insufficient Privileges";
    Firestore.addDoc.mockRejectedValue(new Error(errorMsg));

    render(<JobTracker />);

    fireEvent.change(screen.getByPlaceholderText(/e.g. Acme Corp/i), { target: { value: 'Google' } });
    // ✅ FIX: Match the actual placeholder text
    fireEvent.change(screen.getByPlaceholderText(/Paste the full job description/i), { target: { value: 'JD Text' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Application/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });

    const saveBtn = screen.getByRole('button', { name: /Save Application/i });
    expect(saveBtn).not.toBeDisabled();
  });
});
