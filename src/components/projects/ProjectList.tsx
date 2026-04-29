import type { Project } from '../../types/projects';
import { ProjectCard } from './ProjectCard';
import styles from './ProjectList.module.css';

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <ProjectCard
          key={project.projectId}
          project={project}
        />
      ))}
    </div>
  );
}