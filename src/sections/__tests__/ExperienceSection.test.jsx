import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

// 2. Mock Child Components
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

// 3. Mock Data Source (UPDATED SCHEMA)
vi.mock('../../data/experience.json', () => ({
  default: [
    { 
      id: '1', 
      role: 'React Dev', 
      skills: ['React'], 
      projects: [
        { id: 'p1', title: 'Web App', skills: ['React', 'Redux'], par: {problem:'', action:'', result:''} }
      ] 
    },
    { 
      id: '2', 
      role: 'Power BI Analyst', 
      skills: ['Analysis'], 
      projects: [
        { id: 'p2', title: 'Dashboard', skills: ['Power BI', 'SQL'], par: {problem:'', action:'', result:''} }
      ] 
    },
    { 
      id: '3', 
      role: 'Full Stack', 
      skills: ['Node'], 
      projects: [
        { id: 'p3', title: 'API', skills: ['Node', 'React'], par: {problem:'', action:'', result:''} }
      ] 
    },
  ]
}));

describe('ExperienceSection (Nested Matrix Filter)', () => {
  
  it('shows ALL jobs when no filter is active', () => {
    render(<ExperienceSection activeFilter={null} />);
    expect(screen.getByText('Count: 3')).toBeDefined();
  });

  it('filters jobs correctly (Deep Search)', () => {
    // Filter by "React"
    // Job 1 matches (Top skill + Project skill)
    // Job 2 has NO React
    // Job 3 matches (Project skill)
    render(<ExperienceSection activeFilter="React" />);
    
    expect(screen.getByText('Count: 2')).toBeDefined();
    expect(screen.getByText('React Dev')).toBeDefined();
    expect(screen.getByText('Full Stack')).toBeDefined();
    expect(screen.queryByText('Power BI Analyst')).toBeNull();
  });

  it('displays the Active Filter label', () => {
    render(<ExperienceSection activeFilter="Power BI" />);
    const filterPills = screen.getAllByText('Power BI');
    expect(filterPills.length).toBeGreaterThan(0);
  });
});
