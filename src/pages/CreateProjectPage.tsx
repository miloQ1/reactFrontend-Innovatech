import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../api/projectService';
import { CreateProjectForm } from '../components/projects/CreateProjectForm';
import type { CreateProjectRequest } from '../types/project';
import styles from './CreateProjectPage.module.css';

export function CreateProjectPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: CreateProjectRequest) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const project = await projectService.createProject(data, user.id, user.userName);
      setSuccess('Project created successfully!');
      setTimeout(() => navigate(`/projects/${project.id}`), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create New Project</h1>
      <p className={styles.subtitle}>
        Start a new collaborative project. You'll be assigned as the project Master.
      </p>
      <CreateProjectForm
        onSubmit={handleCreate}
        isLoading={isLoading}
        successMessage={success}
        errorMessage={error}
      />
    </div>
  );
}
