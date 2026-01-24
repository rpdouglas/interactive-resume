import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from '../Footer';
import { AuthProvider } from '../../context/AuthContext';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(() => () => {}),
}));

// Mock the Firebase library
vi.mock('../../lib/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

describe('Footer Component', () => {
  it('renders the correct copyright year', () => {
    render(
      <AuthProvider>
        <Footer />
      </AuthProvider>
    );
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeDefined();
  });

  it('renders the System Version indicator', () => {
    render(
      <AuthProvider>
        <Footer />
      </AuthProvider>
    );
    expect(screen.getByText(/System Version: v/i)).toBeDefined();
  });

  it('renders the admin lock icon when not logged in', () => {
    render(
      <AuthProvider>
        <Footer />
      </AuthProvider>
    );
    // The Lock icon is inside a button
    const lockBtn = screen.getByRole('button');
    expect(lockBtn).toBeDefined();
  });
});
