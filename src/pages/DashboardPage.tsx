import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../api/projectService';
import { invitationService } from '../api/invitationService';
import type { Project } from '../types/project';
import type { Invitation } from '../types/invitation';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    if (user) {
      projectService.getMyProjects(user.id).then(setProjects);
      invitationService.getMyInvitations(user.userName).then(setInvitations);
    }
  }, [user]);

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
          <div className={styles.statLabel}>My Projects</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✉️</div>
          <div className={styles.statValue}>{invitations.length}</div>
          <div className={styles.statLabel}>Pending Invitations</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statValue}>
            {projects.filter((p) => p.ownerId === user?.id).length}
          </div>
          <div className={styles.statLabel}>Projects as Master</div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>⚡ Quick Actions</h2>
      <div className={styles.quickActions}>
        <button className={styles.actionBtn} onClick={() => navigate('/projects')}>
          📁 View My Projects
        </button>
        <button className={styles.actionBtn} onClick={() => navigate('/projects/create')}>
          ➕ Create New Project
        </button>
        <button className={styles.actionBtn} onClick={() => navigate('/invitations')}>
          ✉️ View Invitations
          {invitations.length > 0 && ` (${invitations.length})`}
        </button>
      </div>
    </div>
  );
}
