import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../Header';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Header Component', () => {
  it('renders the logo name', () => {
    render(<Header onBookClick={() => {}} />);
    expect(screen.getByText(/Ryan Douglas/i)).toBeDefined();
  });

  it('renders primary call-to-action and nav links', () => {
    render(<Header onBookClick={() => {}} />);
    // Check for the new "Let's Talk" CTA
    expect(screen.getByText(/Let's Talk/i)).toBeDefined();
    // Check for the Experience link
    expect(screen.getByText(/Experience/i)).toBeDefined();
  });

  it('toggles mobile menu and triggers booking from mobile', () => {
    const mockBookClick = vi.fn();
    render(<Header onBookClick={mockBookClick} />);
    
    // 1. Find and click the toggle button (Verified via restored aria-label)
    const toggleBtn = screen.getByLabelText('Toggle Menu');
    fireEvent.click(toggleBtn);

    // 2. Click the mobile booking button
    const mobileBookBtn = screen.getByText('Book a Consultation');
    fireEvent.click(mobileBookBtn);

    expect(mockBookClick).toHaveBeenCalled();
  });
});
