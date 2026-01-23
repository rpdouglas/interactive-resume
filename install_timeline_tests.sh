#!/bin/bash

# ==========================================
# 🧪 Install Tests: Timeline Feature
# ==========================================

echo "Step 1: Creating Test Directory..."
mkdir -p src/components/timeline/__tests__

echo "Step 2: Generating TimelineCard.test.jsx..."
cat << 'EOF' > src/components/timeline/__tests__/TimelineCard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TimelineCard from '../TimelineCard';

// 1. Mock Framer Motion
// We replace the animated component with a standard div so tests run instantly
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
  },
}));

describe('TimelineCard Component', () => {
  // 2. Define Mock Data (The "Fixture")
  const mockData = {
    id: "test_1",
    role: "Senior Developer",
    company: "Tech Corp",
    date: "2020 - Present",
    logo: "🚀",
    skills: ["React", "Vitest", "Node.js"],
    summary: "A test summary.",
    par: {
      problem: "Legacy code was slow.",
      action: "Refactored to React 19.",
      result: "Performance improved by 50%."
    }
  };

  it('renders the role, company, and date correctly', () => {
    render(<TimelineCard data={mockData} index={0} />);
    
    expect(screen.getByText('Senior Developer')).toBeDefined();
    expect(screen.getByText('Tech Corp')).toBeDefined();
    expect(screen.getByText('2020 - Present')).toBeDefined();
  });

  it('renders the PAR (Problem, Action, Result) narrative', () => {
    render(<TimelineCard data={mockData} index={0} />);

    // Check for the labels
    expect(screen.getByText('Problem:')).toBeDefined();
    expect(screen.getByText('Action:')).toBeDefined();
    expect(screen.getByText('Result:')).toBeDefined();

    // Check for the content
    expect(screen.getByText(/Legacy code was slow/i)).toBeDefined();
    expect(screen.getByText(/Refactored to React 19/i)).toBeDefined();
    expect(screen.getByText(/Performance improved by 50%/i)).toBeDefined();
  });

  it('renders the correct number of skill chips', () => {
    render(<TimelineCard data={mockData} index={0} />);
    
    const chip1 = screen.getByText('React');
    const chip2 = screen.getByText('Vitest');
    const chip3 = screen.getByText('Node.js');

    expect(chip1).toBeDefined();
    expect(chip2).toBeDefined();
    expect(chip3).toBeDefined();
  });
});
EOF

echo "=========================================="
echo "✅ Test File Created: src/components/timeline/__tests__/TimelineCard.test.jsx"
echo "👉 Run 'npm run test' to verify."
echo "=========================================="