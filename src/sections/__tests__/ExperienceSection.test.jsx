import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExperienceSection from '../ExperienceSection';

// 1. Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => <div className={className} {...props}>{children}</div>,
    p: ({ children, className }) => <p className={className}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// 2. Mock Child Components (CORRECTED PATHS)
// Note the '../../' to escape the __tests__ folder AND the sections folder
vi.mock('../../components/timeline/TimelineContainer', () => ({
  default: ({ experienceData }) => (
    <div data-testid="timeline-container">
      Count: {experienceData.length}
      <ul>
        {experienceData.map(job => <li key={job.id}>{job.role}</li>)}
      </ul>
    </div>
  ),
}));

// 3. Mock Data Source (CORRECTED PATHS)
vi.mock('../../data/experience.json', () => ({
  default: [
    { id: '1', role: 'React Dev', skills: ['React', 'JavaScript'] },
    { id: '2', role: 'Power BI Analyst', skills: ['Power BI', 'SQL'] },
    { id: '3', role: 'Full Stack', skills: ['React', 'Node.js'] },
  ]
}));

describe('ExperienceSection (Matrix Filter)', () => {
  
  it('shows ALL jobs when no filter is active', () => {
    render(<ExperienceSection activeFilter={null} />);
    
    // Should see all 3 mock jobs
    expect(screen.getByText('Count: 3')).toBeDefined();
    expect(screen.getByText('React Dev')).toBeDefined();
    expect(screen.getByText('Power BI Analyst')).toBeDefined();
  });

  it('filters jobs correctly when activeFilter is provided', () => {
    // Filter by "React" -> Should show Job 1 & 3, hide Job 2
    render(<ExperienceSection activeFilter="React" />);
    
    expect(screen.getByText('Count: 2')).toBeDefined();
    expect(screen.getByText('React Dev')).toBeDefined();
    expect(screen.getByText('Full Stack')).toBeDefined();
    
    // Power BI Analyst should NOT be there
    expect(screen.queryByText('Power BI Analyst')).toBeNull();
  });

  it('displays the Active Filter label and Clear button', () => {
    render(<ExperienceSection activeFilter="Power BI" />);
    
    // Check for "Filtering by: Power BI"
    // We use getAllByText because "Power BI" might exist in the mock data chips too
    // We specifically look for the one in the filter UI
    const filterPills = screen.getAllByText('Power BI');
    expect(filterPills.length).toBeGreaterThan(0);
    
    // Check for Clear Button (X icon)
    expect(screen.getByLabelText('Clear Filter')).toBeDefined();
  });

  it('calls onClear when the X button is clicked', () => {
    const handleClear = vi.fn();
    render(<ExperienceSection activeFilter="Power BI" onClear={handleClear} />);
    
    const button = screen.getByLabelText('Clear Filter');
    fireEvent.click(button);
    
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('shows a message if no jobs match the filter', () => {
    render(<ExperienceSection activeFilter="Cobol" />);
    
    expect(screen.getByText('Count: 0')).toBeDefined();
    expect(screen.getByText(/No specific roles found/i)).toBeDefined();
  });
});
