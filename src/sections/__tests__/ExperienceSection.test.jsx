import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExperienceSection from '../ExperienceSection';

// 1. Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
    p: ({ children, className }) => <p className={className}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// 2. Mock useResumeData Hook with COMPLETE Data Structure
const mockExperienceData = [
  {
    id: "job1",
    role: "Consultant",
    company: "PwC Canada LLP",
    date: "2020",
    summary: "Work stuff",
    skills: ["Power BI", "SQL"],
    projects: [
      { 
        id: "p1", 
        title: "Project A",
        sector: "Public Sector", 
        skills: ["Power BI"],
        // ✅ FIX: Added missing PAR object required by TimelineCard
        par: { 
          problem: "Test problem", 
          action: "Test action", 
          result: "Test result" 
        }
      }
    ]
  },
  {
    id: "job2",
    role: "Dev",
    company: "Biond Consulting",
    date: "2019",
    summary: "Old job",
    skills: ["SSIS"],
    projects: [
      { 
        id: "p2", 
        title: "Project B",
        sector: "Retail", 
        skills: ["SSIS"],
        // ✅ FIX: Added missing PAR object
        par: { 
          problem: "Retail problem", 
          action: "Retail action", 
          result: "Retail result" 
        }
      }
    ]
  }
];

vi.mock('../../hooks/useResumeData', () => ({
  useResumeData: vi.fn(() => ({
    experience: mockExperienceData,
    loading: false
  }))
}));

describe('ExperienceSection Filter Logic', () => {
  it('filters by technical skill (e.g., Power BI)', () => {
    render(<ExperienceSection activeFilter="Power BI" />);
    // PwC project uses Power BI
    expect(screen.getByText(/PwC Canada LLP/i)).toBeDefined();
    // Biond should be filtered out (it has SSIS)
    expect(screen.queryByText(/Biond Consulting/i)).toBeNull();
  });

  it('filters by industry sector (e.g., Public Sector)', () => {
    render(<ExperienceSection activeFilter="Public Sector" />);
    expect(screen.getByText(/PwC Canada LLP/i)).toBeDefined();
    expect(screen.queryByText(/Biond Consulting/i)).toBeNull();
  });

  it('shows empty state for non-matching filters', () => {
    render(<ExperienceSection activeFilter="Rocket Science" />);
    expect(screen.getByText(/No specific engagements found matching/i)).toBeDefined();
  });
});
