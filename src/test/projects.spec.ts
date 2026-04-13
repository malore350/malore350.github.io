import { describe, it, expect } from 'vitest';
import { projects } from '../data/projects';
import type { Project, ProjectScreenshot, ProjectLink } from '../data/types';

describe('projects data', () => {
  it('should have exactly 4 projects', () => {
    expect(projects).toHaveLength(4);
  });

  it('should have all required fields for each project', () => {
    projects.forEach((project: Project) => {
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('title');
      expect(project).toHaveProperty('shortSummary');
      expect(project).toHaveProperty('description');
      expect(project).toHaveProperty('technologies');
      expect(project).toHaveProperty('screenshots');
      expect(project).toHaveProperty('links');
      expect(project).toHaveProperty('dockLabel');
      expect(project).toHaveProperty('dockIcon');
    });
  });

  it('should have non-empty string id for each project', () => {
    projects.forEach((project: Project) => {
      expect(typeof project.id).toBe('string');
      expect(project.id.length).toBeGreaterThan(0);
    });
  });

  it('should have non-empty title for each project', () => {
    projects.forEach((project: Project) => {
      expect(typeof project.title).toBe('string');
      expect(project.title.length).toBeGreaterThan(0);
    });
  });

  it('should have non-empty shortSummary for each project', () => {
    projects.forEach((project: Project) => {
      expect(typeof project.shortSummary).toBe('string');
      expect(project.shortSummary.length).toBeGreaterThan(0);
    });
  });

  it('should have at least one technology for each project', () => {
    projects.forEach((project: Project) => {
      expect(project.technologies.length).toBeGreaterThan(0);
    });
  });

  it('should have at least one screenshot for each project', () => {
    projects.forEach((project: Project) => {
      expect(project.screenshots.length).toBeGreaterThan(0);
    });
  });

  it('should have at least one link for each project', () => {
    projects.forEach((project: Project) => {
      expect(project.links.length).toBeGreaterThan(0);
    });
  });

  it('should have correct screenshot structure', () => {
    projects.forEach((project: Project) => {
      project.screenshots.forEach((screenshot: ProjectScreenshot) => {
        expect(screenshot).toHaveProperty('src');
        expect(screenshot).toHaveProperty('alt');
        expect(screenshot).toHaveProperty('caption');
        expect(typeof screenshot.src).toBe('string');
        expect(typeof screenshot.alt).toBe('string');
        expect(typeof screenshot.caption).toBe('string');
      });
    });
  });

  it('should have correct link structure', () => {
    projects.forEach((project: Project) => {
      project.links.forEach((link: ProjectLink) => {
        expect(link).toHaveProperty('label');
        expect(link).toHaveProperty('url');
        expect(typeof link.label).toBe('string');
        expect(typeof link.url).toBe('string');
      });
    });
  });

  it('should contain the expected project IDs', () => {
    const projectIds = projects.map((p: Project) => p.id);
    expect(projectIds).toContain('gamehub');
    expect(projectIds).toContain('cryptopro');
    expect(projectIds).toContain('unigo');
    expect(projectIds).toContain('ttyt');
  });

  it('should have no duplicate IDs', () => {
    const ids = projects.map((p: Project) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});