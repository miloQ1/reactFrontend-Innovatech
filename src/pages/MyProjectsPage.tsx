import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../api/projectService';
import { ProjectList } from '../components/projects/ProjectList';
import { EmptyState } from '../components/shared/EmptyState';
import type { Project } from '../types/project';
import styles from './MyProjectsPage.module.css';

export function MyProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      projectService
        .getMyProjects(user.id)
        .then(setProjects)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  if (isLoading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Projects</h1>
        <button className={styles.createBtn} onClick={() => navigate('/projects/create')}>
          ➕ New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon="📁"
          title="No projects yet"
          description="Create your first project to get started collaborating with your team."
          actionLabel="Create Project"
          onAction={() => navigate('/projects/create')}
        />
      ) : (
        <ProjectList projects={projects} currentUserId={user?.id || ''} />
      )}
    </div>
  );
}
