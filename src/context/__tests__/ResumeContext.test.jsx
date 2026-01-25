import React from 'react';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResumeProvider } from '../ResumeContext';
import { useResumeData } from '../../hooks/useResumeData';
import * as Firestore from 'firebase/firestore';

// =============================================================================
// 1. MOCK DATA & IMPORTS
// We inline the mock data inside the factory to avoid hoisting ReferenceErrors.
// =============================================================================

vi.mock('../../data/profile.json', () => ({ 
  default: { basics: { name: "Local Fallback Ryan" }, metrics: {} } 
}));
vi.mock('../../data/skills.json', () => ({ default: [] }));
vi.mock('../../data/sectors.json', () => ({ default: [] }));
vi.mock('../../data/experience.json', () => ({ 
  default: [{ id: "local_job", role: "Local Dev", projects: [] }] 
}));

// Mock Firebase Service
vi.mock('../../lib/db', () => ({ db: {} }));

// Mock Firestore SDK methods
vi.mock('firebase/firestore', () => ({
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
}));

// =============================================================================
// 2. HELPER COMPONENTS
// =============================================================================

const TestConsumer = () => {
  const { profile, experience, loading } = useResumeData();

  if (loading) return <div data-testid="loading">Loading...</div>;
  
  return (
    <div>
      <div data-testid="profile-name">{profile?.basics?.name}</div>
      <div data-testid="job-role">{experience?.[0]?.role}</div>
      <div data-testid="project-count">{experience?.[0]?.projects?.length || 0}</div>
    </div>
  );
};

// =============================================================================
// 3. TEST SUITE
// =============================================================================

describe('ResumeContext & Data Layer', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('fetches and merges deep data from Firestore on success', async () => {
    // 1. Mock Profile
    Firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ basics: { name: "Firestore Ryan" }, metrics: {} })
    });

    // 2. Mock Collections (Sequence: Skills, Sectors, Experience, Projects)
    const mockJobDoc = { 
      id: 'cloud_job', 
      data: () => ({ role: "Cloud Architect" }),
      ref: 'mock_ref' 
    };

    Firestore.getDocs
      .mockResolvedValueOnce({ docs: [] }) // Skills
      .mockResolvedValueOnce({ docs: [] }) // Sectors
      .mockResolvedValueOnce({ docs: [mockJobDoc] }) // Experience Parent
      .mockResolvedValueOnce({ docs: [{ id: 'p1', data: () => ({ title: 'Cloud Project' }) }] }); // Projects Sub

    render(
      <ResumeProvider>
        <TestConsumer />
      </ResumeProvider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('profile-name')).toHaveTextContent('Firestore Ryan');
    expect(screen.getByTestId('job-role')).toHaveTextContent('Cloud Architect');
    expect(screen.getByTestId('project-count')).toHaveTextContent('1');
  });

  it('falls back to Local JSON seamlessly if Firestore fails', async () => {
    // Force fail first call
    Firestore.getDoc.mockRejectedValue(new Error("Simulated Network Crash"));

    render(
      <ResumeProvider>
        <TestConsumer />
      </ResumeProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Verify Error Log
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("Firestore Fetch Failed"), 
      expect.any(Error)
    );

    // Verify Fallback Data
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Local Fallback Ryan');
    expect(screen.getByTestId('job-role')).toHaveTextContent('Local Dev');
  });

  it('provides isLoading=true initially', () => {
    Firestore.getDoc.mockReturnValue(new Promise(() => {}));
    render(
      <ResumeProvider>
        <TestConsumer />
      </ResumeProvider>
    );
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('throws an error if hook is used outside Provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useResumeData());
    }).toThrow('useResumeData must be used within a ResumeProvider');
    consoleSpy.mockRestore();
  });
});
