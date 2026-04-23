import { useNavigate } from 'react-router-dom';
import type { Project, MemberRole } from '../../types/project';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  userRole?: MemberRole;
}

export function ProjectCard({ project, userRole }: ProjectCardProps) {
  const navigate = useNavigate();

  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={styles.card} onClick={() => navigate(`/projects/${project.id}`)}>
      <div className={styles.header}>
        <h3 className={styles.name}>{project.name}</h3>
        {userRole && (
          <span
            className={`${styles.roleBadge} ${
              userRole === 'MASTER' ? styles.master : styles.member
            }`}
          >
            {userRole}
          </span>
        )}
      </div>

      <p className={styles.description}>{project.description}</p>

      <div className={styles.meta}>
        <span className={styles.metaItem}>📅 {formattedDate}</span>
      </div>
    </div>
  );
}
