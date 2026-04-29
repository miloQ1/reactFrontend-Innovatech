import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../api/projectService';
import type { Project } from '../types/projects';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectService.getAll().then(setProjects);
  }, []);

  const inProgress = projects.filter((p) => p.status === 'IN_PROGRESS').length;
  const completed = projects.filter((p) => p.status === 'COMPLETED').length;

  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>
        Hello, {user?.firstName} 👋
      </h1>
      <p className={styles.subtitle}>
        Here's an overview of your activity on EduTech.
      </p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📁</div>
          <div className={styles.statValue}>{projects.length}</div>
          <div className={styles.statLabel}>Total Projects</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚙️</div>
          <div className={styles.statValue}>{inProgress}</div>
          <div className={styles.statLabel}>In Progress</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statValue}>{completed}</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>⚡ Quick Actions</h2>
      <div className={styles.quickActions}>
        <button className={styles.actionBtn} onClick={() => navigate('/projects')}>
          📁 View Projects
        </button>
        <button className={styles.actionBtn} onClick={() => navigate('/projects/create')}>
          ➕ Create New Project
        </button>
      </div>
    </div>
  );
}