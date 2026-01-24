import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ProjectArchitect from '../ProjectArchitect';
import * as FirebaseLib from '../../../lib/firebase';

// 1. Mock the Firebase Library
vi.mock('../../../lib/firebase', () => ({
  architectProject: vi.fn(),
  auth: {},
  googleProvider: {},
  analytics: {},
  app: {}
}));

// 2. Mock the Complex TimelineCard Component
// ✅ FIX: Path corrected from ../../ to ../../../
vi.mock('../../../components/timeline/TimelineCard', () => ({
  default: ({ data }) => (
    <div data-testid="mock-timeline-card">
      <h2>{data.projects[0].title}</h2>
      <p>{data.projects[0].par.result}</p>
    </div>
  )
}));

// 3. Mock Clipboard API
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('ProjectArchitect (AI Sandbox)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockSuccessResponse = {
    data: {
      id: "ai_generated_1",
      title: "AI Optimized Title",
      skills: ["Gemini", "React"],
      par: {
        problem: "Manual resumes are slow.",
        action: "Implemented AI agent.",
        result: "Efficiency increased by 100%."
      },
      diagram: "graph TD; A-->B;"
    }
  };

  // --- TEST CASE 1: EMPTY STATE ---
  it('initializes with disabled button and empty instructions', () => {
    render(<ProjectArchitect />);
    
    expect(screen.getByText(/Raw Project Notes/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter notes on the left/i)).toBeInTheDocument();

    const architectBtn = screen.getByRole('button', { name: /Architect with Gemini/i });
    expect(architectBtn).toBeDisabled();
  });

  // --- TEST CASE 2: LOADING STATE ---
  it('shows loading state while AI is thinking', async () => {
    FirebaseLib.architectProject.mockReturnValue(new Promise(() => {}));

    render(<ProjectArchitect />);
    
    const input = screen.getByPlaceholderText(/e.g. I worked at PwC/i);
    fireEvent.change(input, { target: { value: 'I built a cool app.' } });

    const architectBtn = screen.getByRole('button', { name: /Architect with Gemini/i });
    expect(architectBtn).not.toBeDisabled();
    fireEvent.click(architectBtn);

    expect(await screen.findByText(/Architecting.../i)).toBeInTheDocument();
    expect(architectBtn).toBeDisabled();
  });

  // --- TEST CASE 3: SUCCESS STATE ---
  it('renders the mocked TimelineCard upon successful API response', async () => {
    FirebaseLib.architectProject.mockResolvedValue(mockSuccessResponse);

    render(<ProjectArchitect />);
    
    const input = screen.getByPlaceholderText(/e.g. I worked at PwC/i);
    fireEvent.change(input, { target: { value: 'Successfully built AI.' } });
    
    const architectBtn = screen.getByRole('button', { name: /Architect with Gemini/i });
    fireEvent.click(architectBtn);

    await waitFor(() => {
      expect(screen.getByTestId('mock-timeline-card')).toBeInTheDocument();
    });

    expect(screen.getByText('AI Optimized Title')).toBeInTheDocument();
    expect(screen.getByText('Efficiency increased by 100%.')).toBeInTheDocument();
  });

  // --- TEST CASE 4: ERROR STATE ---
  it('displays a user-friendly error if the Cloud Function fails', async () => {
    // Note: We use a string error here to match what the UI might expect if it renders error.message
    FirebaseLib.architectProject.mockRejectedValue(new Error('Quota exceeded'));

    render(<ProjectArchitect />);
    
    const input = screen.getByPlaceholderText(/e.g. I worked at PwC/i);
    fireEvent.change(input, { target: { value: 'This will fail.' } });
    fireEvent.click(screen.getByRole('button', { name: /Architect with Gemini/i }));

    // The UI renders the error message string
    await waitFor(() => {
      expect(screen.getByText(/Quota exceeded/i)).toBeInTheDocument();
    });
  });

  // --- TEST CASE 5: CLIPBOARD INTERACTION ---
  it('copies JSON to clipboard when "Copy JSON" is clicked', async () => {
    FirebaseLib.architectProject.mockResolvedValue(mockSuccessResponse);

    render(<ProjectArchitect />);
    
    const input = screen.getByPlaceholderText(/e.g. I worked at PwC/i);
    fireEvent.change(input, { target: { value: 'Copy this.' } });
    fireEvent.click(screen.getByRole('button', { name: /Architect with Gemini/i }));

    await waitFor(() => {
      expect(screen.getByText('AI Optimized Title')).toBeInTheDocument();
    });

    const copyBtn = screen.getByText(/Copy JSON/i);
    fireEvent.click(copyBtn);

    expect(mockWriteText).toHaveBeenCalledWith(
      JSON.stringify(mockSuccessResponse.data, null, 2)
    );
  });
});
