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
  });

  // 2. SKILLS TEST
  it('Skills Data is structured correctly for Radar Chart', () => {
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);

    skills.forEach(category => {
      expect(category.id).toBeDefined();
      expect(Array.isArray(category.data)).toBe(true);
      
      category.data.forEach(skill => {
        expect(skill.subject).toBeTypeOf('string');
        expect(skill.A).toBeTypeOf('number');
        expect(skill.fullMark).toBe(100);
      });
    });
  });

  // 3. EXPERIENCE TEST (UPDATED FOR NESTED PROJECTS)
  it('Experience Data follows the Project-Based Architecture', () => {
    expect(Array.isArray(experience)).toBe(true);
    expect(experience.length).toBeGreaterThan(0);

    experience.forEach(job => {
      // Check Job Wrapper
      expect(job.id).toBeDefined();
      expect(job.role).toBeTypeOf('string');
      expect(job.company).toBeTypeOf('string');
      expect(Array.isArray(job.projects)).toBe(true);
      
      // Check Nested Projects
      job.projects.forEach(project => {
        expect(project.id).toBeDefined();
        expect(project.title).toBeTypeOf('string');
        expect(Array.isArray(project.skills)).toBe(true);
        
        // Check PAR Structure (Now inside the project)
        expect(project.par).toBeDefined();
        expect(project.par.problem).toBeTypeOf('string');
        expect(project.par.action).toBeTypeOf('string');
        expect(project.par.result).toBeTypeOf('string');
        
        // Quality Check
        expect(project.par.problem.length).toBeGreaterThan(5);
      });
    });
  });
});
