import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExperienceSection from '../ExperienceSection';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
    p: ({ children, className }) => <p className={className}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('ExperienceSection Filter Logic', () => {
  it('filters by technical skill (e.g., Power BI)', () => {
    render(<ExperienceSection activeFilter="Power BI" />);
    // PwC project uses Power BI
    expect(screen.getByText(/PwC Canada LLP/i)).toBeDefined();
    // Teleperformance should be filtered out
    expect(screen.queryByText(/Teleperformance/i)).toBeNull();
  });

  it('filters by industry sector (e.g., Public Sector)', () => {
    render(<ExperienceSection activeFilter="Public Sector" />);
    expect(screen.getByText(/PwC Canada LLP/i)).toBeDefined();
    // Biond is Retail/Distribution, should be hidden
    expect(screen.queryByText(/Biond Consulting/i)).toBeNull();
  });

  it('shows empty state for non-matching filters', () => {
    render(<ExperienceSection activeFilter="Rocket Science" />);
    expect(screen.getByText(/No specific engagements found matching/i)).toBeDefined();
  });
});
