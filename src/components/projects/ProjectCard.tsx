import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/projects';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={styles.card} onClick={() => navigate(`/projects/${project.projectId}`)}>
      <div className={styles.header}>
        <h3 className={styles.name}>{project.name}</h3>
        <span className={`${styles.roleBadge} ${styles[project.status.toLowerCase()]}`}>
          {project.status}
        </span>
      </div>

      <p className={styles.description}>{project.description}</p>

      <div className={styles.meta}>
        <span className={styles.metaItem}>🏢 {project.client.name}</span>
        <span className={styles.metaItem}>📅 {formattedDate}</span>
      </div>
    </div>
  );
}