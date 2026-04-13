import type { Project } from '../data/types';

interface ProjectSectionProps {
  project: Project;
  sectionId: string;
}

function ProjectSection({ project, sectionId }: ProjectSectionProps) {
  return (
    <section id={sectionId} aria-labelledby={`${sectionId}-heading`}>
      <div className="section-content project-section">
        <div className="project-header">
          <h2 id={`${sectionId}-heading`}>{project.title}</h2>
          <p className="project-summary">{project.shortSummary}</p>
        </div>

        <div className="project-body">
          <div className="tech-badges">
            {project.technologies.map((tech) => (
              <span key={tech} className="tech-badge">
                {tech}
              </span>
            ))}
          </div>

          <div className="project-screenshots">
            {project.screenshots.map((screenshot) => (
              <div key={screenshot.src} className="screenshot-wrapper">
                <img
                  src={screenshot.src}
                  alt={screenshot.alt}
                  className="project-screenshot"
                  loading="lazy"
                />
                {screenshot.caption && (
                  <span className="screenshot-caption">{screenshot.caption}</span>
                )}
              </div>
            ))}
          </div>

          {project.links.length > 0 && (
            <div className="project-links">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProjectSection;