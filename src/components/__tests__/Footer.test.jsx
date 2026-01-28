import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

// Mock Auth Context
const mockUseAuth = vi.fn();
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('Footer Component', () => {
  it('renders the correct copyright year', () => {
    mockUseAuth.mockReturnValue({ user: null });
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText(new RegExp(new Date().getFullYear().toString()))).toBeDefined();
  });

  it('renders the System Version indicator', () => {
    mockUseAuth.mockReturnValue({ user: null });
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText(/System Version/i)).toBeDefined();
  });

  it('renders the Dashboard link (Dev Mode)', () => {
    mockUseAuth.mockReturnValue({ user: null }); // Even if logged out
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    
    // ✅ Updated: Looks for the link text instead of a lock button
    const dashboardLink = screen.getByText(/Go to Dashboard/i);
    expect(dashboardLink).toBeDefined();
    expect(dashboardLink.closest('a')).toHaveAttribute('href', '/admin');
  });
});
