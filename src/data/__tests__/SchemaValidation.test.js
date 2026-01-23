import { describe, it, expect } from 'vitest';
import profile from '../profile.json';
import skills from '../skills.json';
import experience from '../experience.json';

describe('Data Integrity (Schema Validation)', () => {

  // 1. PROFILE TEST
  it('Profile Data has required structure', () => {
    expect(profile.basics).toBeDefined();
    expect(profile.basics.name).toBeTypeOf('string');
    expect(profile.basics.label).toBeTypeOf('string');
    expect(profile.metrics).toBeDefined();
    expect(profile.metrics.yearsExperience).toBeTypeOf('number');
  });

  // 2. SKILLS TEST
  it('Skills Data is structured correctly for Radar Chart', () => {
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);

    skills.forEach(category => {
      // Check Category Structure
      expect(category.id).toBeDefined();
      expect(category.label).toBeDefined();
      expect(Array.isArray(category.data)).toBe(true);
      
      // Check individual skills
      category.data.forEach(skill => {
        expect(skill.subject).toBeTypeOf('string');
        expect(skill.A).toBeTypeOf('number');
        expect(skill.fullMark).toBe(100);
      });
    });
  });

  // 3. EXPERIENCE TEST
  it('Experience Data follows the PAR Framework', () => {
    expect(Array.isArray(experience)).toBe(true);
    expect(experience.length).toBeGreaterThan(0);

    experience.forEach(job => {
      // Check Core Fields
      expect(job.id).toBeDefined();
      expect(job.role).toBeTypeOf('string');
      expect(job.company).toBeTypeOf('string');
      expect(Array.isArray(job.skills)).toBe(true);
      
      // Check PAR Structure (Crucial for the component)
      expect(job.par).toBeDefined();
      expect(job.par.problem).toBeTypeOf('string');
      expect(job.par.action).toBeTypeOf('string');
      expect(job.par.result).toBeTypeOf('string');
      
      // Ensure no fields are empty strings (Quality Check)
      expect(job.par.problem.length).toBeGreaterThan(5);
    });
  });
});
