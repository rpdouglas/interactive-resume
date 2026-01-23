import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TimelineCard from '../TimelineCard';

// 1. Mock Framer Motion
// We MUST include AnimatePresence now that we use it for the Accordion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick }) => (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('TimelineCard Component', () => {
  // 2. Define Mock Data (UPDATED NESTED STRUCTURE)
  const mockData = {
    id: "test_1",
    role: "Senior Developer",
    company: "Tech Corp",
    date: "2020 - Present",
    logo: "🚀",
    skills: ["React", "Node.js"],
    summary: "A test summary.",
    projects: [
      {
        id: "p1",
        title: "Legacy Refactor",
        skills: ["React", "Vitest"],
        par: {
          problem: "Legacy code was slow.",
          action: "Refactored to React 19.",
          result: "Performance improved by 50%."
        }
      }
    ]
  };

  it('renders the job header (role, company) by default', () => {
    render(<TimelineCard data={mockData} index={0} />);
    
    expect(screen.getByText('Senior Developer')).toBeDefined();
    expect(screen.getByText('Tech Corp')).toBeDefined();
    expect(screen.getByText('2020 - Present')).toBeDefined();
  });

  it('expands to show Projects when clicked', () => {
    render(<TimelineCard data={mockData} index={0} />);
    
    // 1. Check that project title is NOT visible initially (Logic: AnimatePresence would hide it, 
    // but in our mock AnimatePresence renders children immediately if isOpen is true. 
    // Since isOpen is false by default, it shouldn't be there.)
    expect(screen.queryByText('Legacy Refactor')).toBeNull();

    // 2. Click the Card Header to expand
    // We target the role text to simulate clicking the header area
    fireEvent.click(screen.getByText('Senior Developer'));

    // 3. Now the Project Title should be visible
    expect(screen.getByText('Legacy Refactor')).toBeDefined();
  });

  it('renders the PAR narrative inside the expanded project', () => {
    render(<TimelineCard data={mockData} index={0} />);
    
    // Open the accordion
    fireEvent.click(screen.getByText('Senior Developer'));

    // Check PAR content
    expect(screen.getByText(/Legacy code was slow/i)).toBeDefined();
    expect(screen.getByText(/Refactored to React 19/i)).toBeDefined();
    expect(screen.getByText(/Performance improved by 50%/i)).toBeDefined();
  });

  it('auto-expands if activeFilter matches a project skill', () => {
    // We pass "Vitest" as the active filter. 
    // The Project "Legacy Refactor" uses "Vitest", so it should auto-open.
    render(<TimelineCard data={mockData} index={0} activeFilter="Vitest" />);
    
    // Should be visible WITHOUT clicking
    expect(screen.getByText('Legacy Refactor')).toBeDefined();
  });
});
