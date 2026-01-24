import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookingModal from '../BookingModal';
import * as Analytics from '../../../hooks/useAnalytics';

// 1. Mock Framer Motion (Immediate Render)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, role, ...props }) => (
      <div className={className} onClick={onClick} role={role} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// 2. Mock Analytics Hook
vi.mock('../../../hooks/useAnalytics', () => ({
  logUserInteraction: vi.fn(),
}));

describe('BookingModal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset body style before each test
    document.body.style.overflow = 'unset';
  });

  it('renders correctly when isOpen is true', () => {
    render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText(/Schedule a Consultation/i)).toBeDefined();
    expect(screen.getByTitle(/Scheduling Calendar/i)).toBeDefined();
  });

  it('does not render when isOpen is false', () => {
    render(<BookingModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onClose and logs analytics when close button is clicked', () => {
    render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    
    const closeBtn = screen.getByLabelText(/Close Modal/i);
    fireEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(Analytics.logUserInteraction).toHaveBeenCalledWith('booking_close');
  });

  it('closes when the Escape key is pressed', () => {
    render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('locks body scroll when open and restores it when closed', () => {
    const { rerender } = render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<BookingModal isOpen={false} onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('contains an accessible iframe for the booking tool', () => {
    render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    const iframe = screen.getByTitle(/Scheduling Calendar/i);
    
    expect(iframe).toBeDefined();
    expect(iframe.tagName).toBe('IFRAME');
  });
});
