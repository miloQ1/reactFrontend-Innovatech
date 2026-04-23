import type { Project } from '../../types/project';
import { ProjectCard } from './ProjectCard';
import styles from './ProjectList.module.css';

interface ProjectListProps {
  projects: Project[];
  currentUserId: string;
}

export function ProjectList({ projects, currentUserId }: ProjectListProps) {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          userRole={project.ownerId === currentUserId ? 'MASTER' : 'MEMBER'}
        />
      ))}
    </div>
  );
}
