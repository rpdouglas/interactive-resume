import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '../Header';

describe('Header Component', () => {
  it('renders the logo name', () => {
    render(<Header />);
    expect(screen.getByText(/Ryan Douglas/i)).toBeDefined();
  });

  it('renders desktop navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Experience')).toBeDefined();
  });

  it('toggles mobile menu when hamburger is clicked', () => {
    render(<Header />);
    
    // Initially mobile menu is hidden (we can't easily check visibility without styles, 
    // but we can check if the button exists and is clickable)
    const toggleBtn = screen.getByLabelText('Toggle Menu');
    expect(toggleBtn).toBeDefined();

    // Click it
    fireEvent.click(toggleBtn);

    // Now the mobile nav links should be in the DOM
    // (In a real browser, they might be hidden by CSS, but in JSDOM they exist)
    const mobileLinks = screen.getAllByText('Dashboard');
    expect(mobileLinks.length).toBeGreaterThan(1); // One desktop, one mobile
  });
});
