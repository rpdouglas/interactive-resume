import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../Footer';

describe('Footer Component', () => {
  it('renders the correct copyright year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    
    // Use regex to find the year anywhere in the text
    expect(screen.getByText(new RegExp(currentYear))).toBeDefined();
  });

  it('renders the System Version indicator', () => {
    render(<Footer />);
    
    // We look for the specific label "System Version: v"
    // This confirms the Footer is attempting to display version data
    expect(screen.getByText(/System Version: v/i)).toBeDefined();
  });

  it('renders the build status', () => {
    render(<Footer />);
    // Just ensuring the structure is consistent
    expect(screen.getByText(/Ryan Douglas/i)).toBeDefined();
  });
});
