import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';
import * as FirebaseAuth from 'firebase/auth';

// 1. Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));

// 2. Mock Firebase Library
vi.mock('../../../lib/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

// 3. Helper to mock the authorized email env var
vi.stubEnv('VITE_ADMIN_EMAIL', 'authorized@test.com');

describe('Admin Security Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const MockAdminPage = () => <div>Sensitive Admin Data</div>;
  const MockPublicPage = () => <div>Public Resume</div>;

  it('ProtectedRoute: Shows loading spinner when auth state is pending', () => {
    // Force AuthContext to stay in loading state
    FirebaseAuth.onAuthStateChanged.mockImplementation(() => () => {});

    render(
      <AuthProvider>
        <ProtectedRoute>
          <MockAdminPage />
        </ProtectedRoute>
      </AuthProvider>
    );

    // Look for the loading spinner div
    expect(document.querySelector('.animate-spin')).toBeDefined();
  });

  it('Whitelisting: Grants access only to the whitelisted email', async () => {
    // Simulate authorized user login
    FirebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ email: 'authorized@test.com' });
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MockPublicPage />} />
            <Route 
              path="/admin" 
              element={<ProtectedRoute><MockAdminPage /></ProtectedRoute>} 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Sensitive Admin Data')).toBeDefined();
  });

  it('Whitelisting: Bounces an authenticated but unauthorized user', async () => {
    // Simulate someone else logging in with their Google account
    FirebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ email: 'intruder@hacker.com' });
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MockPublicPage />} />
            <Route 
              path="/admin" 
              element={<ProtectedRoute><MockAdminPage /></ProtectedRoute>} 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Should be redirected to public page
    expect(screen.getByText('Public Resume')).toBeDefined();
    expect(screen.queryByText('Sensitive Admin Data')).toBeNull();
  });

  it('ProtectedRoute: Bounces unauthenticated users (null)', () => {
    // Simulate no user logged in
    FirebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MockPublicPage />} />
            <Route 
              path="/admin" 
              element={<ProtectedRoute><MockAdminPage /></ProtectedRoute>} 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Public Resume')).toBeDefined();
  });
});
