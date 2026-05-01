import type { Project, Phase, Task } from '../../../types/projects';
import styles from './Tabs.module.css';

const PRIORITY_COLOR: Record<string, string> = {
  LOW: '#059669', MEDIUM: '#d97706', HIGH: '#dc2626', CRITICAL: '#be185d',
};

function statusColor(status: string) {
  const map: Record<string, string> = {
    PLANNING: 'blue', IN_PROGRESS: 'indigo', ON_HOLD: 'warning',
    COMPLETED: 'success', CANCELLED: 'danger', PENDING: 'blue', DONE: 'success',
  };
  return map[status] ?? 'muted';
}

interface OverviewTabProps {
  project: Project;
  phases: Phase[];
  tasks: Task[];
  onTabChange: (tab: string) => void;
}

export function OverviewTab({ project, phases, tasks, onTabChange }: OverviewTabProps) {
  return (
    <div className={styles.overview}>

      {/* Project Info */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>📋 Project Info</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Name</span>
            <span className={styles.infoValue}>{project.name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Code</span>
            <span className={styles.infoValue}>#{project.code}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Client</span>
            <span className={styles.infoValue}>{project.client.name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Status</span>
            <span className={`${styles.badge} ${styles[`status_${statusColor(project.status)}`]}`}>
              {project.status.replace(/_/g, ' ')}
            </span>
          </div>
          {project.startDate && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Start</span>
              <span className={styles.infoValue}>{project.startDate}</span>
            </div>
          )}
          {project.endDate && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>End</span>
              <span className={styles.infoValue}>{project.endDate}</span>
            </div>
          )}
          {project.budget && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Budget</span>
              <span className={styles.infoValue}>${project.budget.toLocaleString()}</span>
            </div>
          )}
          {project.description && (
            <div className={`${styles.infoItem} ${styles.infoFull}`}>
              <span className={styles.infoLabel}>Description</span>
              <span className={styles.infoValue}>{project.description}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{phases.length}</span>
          <span className={styles.statLabel}>Phases</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{tasks.length}</span>
          <span className={styles.statLabel}>Tasks</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{tasks.filter(t => t.status === 'DONE').length}</span>
          <span className={styles.statLabel}>Done</span>
        </div>
      </div>

      {/* Phase progress */}
      {phases.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>📊 Phase Progress</h2>
          <div className={styles.phaseProgressList}>
            {phases.map(phase => {
              const pTasks = tasks.filter(t => t.phaseId === phase.phaseId);
              const done = pTasks.filter(t => t.status === 'DONE').length;
              const pct = pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0;
              return (
                <div key={phase.phaseId} className={styles.phaseProgressCard}
                  onClick={() => onTabChange(String(phase.phaseId))}>
                  <div className={styles.phaseProgressHeader}>
                    <span className={styles.phaseProgressName}>{phase.name}</span>
                    <span className={styles.phaseProgressPct}>{pct}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                  </div>
                  <div className={styles.phaseProgressMeta}>
                    <span>{done}/{pTasks.length} tasks done</span>
                    <span className={`${styles.minibadge} ${styles[`status_${statusColor(phase.computedStatus ?? phase.status)}`]}`}>
                      {(phase.computedStatus ?? phase.status).replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}