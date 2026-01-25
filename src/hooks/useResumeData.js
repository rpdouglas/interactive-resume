import { useContext } from 'react';
import { ResumeContext } from '../context/ResumeContext';

// Custom Hook to consume the Resume Context
// This abstracts the useContext logic from components
export const useResumeData = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeData must be used within a ResumeProvider');
  }
  return context;
};
