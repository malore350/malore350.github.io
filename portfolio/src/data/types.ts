export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  shortSummary: string;
  description: string;
  technologies: readonly string[];
  screenshots: readonly ProjectScreenshot[];
  links: readonly ProjectLink[];
  dockLabel: string;
  dockIcon: string;
}

export type Projects = readonly Project[];