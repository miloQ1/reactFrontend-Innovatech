import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService, phaseService, taskService, memberService } from '../api/projectService';
import type { Project, Phase, Task, ProjectMember } from '../types/project';
import styles from './ProjectDetailPage.module.css';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add member form
  const [newUserId, setNewUserId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [memberError, setMemberError] = useState<string | null>(null);
  const [memberLoading, setMemberLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const projectId = Number(id);
      const [proj, phs, tsks, mems] = await Promise.all([
        projectService.getById(projectId),
        phaseService.getByProject(projectId),
        taskService.getByProject(projectId),
        memberService.getByProject(projectId),
      ]);
      setProject(proj);
      setPhases(phs);
      setTasks(tsks);
      setMembers(mems);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newUserId || !newUserName) return;
    setMemberLoading(true);
    setMemberError(null);
    try {
      await memberService.add(Number(id), { userId: newUserId, userName: newUserName });
      setNewUserId('');
      setNewUserName('');
      loadData();
    } catch (err) {
      setMemberError(err instanceof Error ? err.message : 'Error al agregar miembro');
    } finally {
      setMemberLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!id) return;
    await memberService.remove(Number(id), userId).catch(() => {});
    loadData();
  };

  if (isLoading) return <div className={styles.loading}>Loading project...</div>;

  if (!project) {
    return (
      <div className={styles.notFound}>
        <h2 className={styles.notFoundTitle}>Project not found</h2>
        <Link to="/projects" className={styles.backLink}>← Back to projects</Link>
      </div>
    );
  }

  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className={styles.page}>
      <Link to="/projects" className={styles.backLink}>← Back to projects</Link>

      <div className={styles.header}>
        <div>
          <h1 className={styles.projectName}>{project.name}</h1>
          <span className={styles.code}>#{project.code}</span>
        </div>
        <span className={styles.statusBadge}>{project.status.replace('_', ' ')}</span>
      </div>

      {project.description && <p className={styles.description}>{project.description}</p>}

      <div className={styles.meta}>
        <span>🏢 {project.client.name}</span>
        <span>📅 Created {formattedDate}</span>
        {project.startDate && <span>🚀 Starts {project.startDate}</span>}
        {project.endDate && <span>🏁 Ends {project.endDate}</span>}
      </div>

      {/* Miembros */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>👥 Members ({members.length})</h2>
        {members.length === 0 ? (
          <p className={styles.empty}>No members yet.</p>
        ) : (
          <div className={styles.memberList}>
            {members.map((m) => (
              <div key={m.id} className={styles.memberCard}>
                <span className={styles.memberName}>@{m.userName}</span>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveMember(m.userId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <form className={styles.addMemberForm} onSubmit={handleAddMember}>
          <h3 className={styles.addMemberTitle}>➕ Add Member</h3>
          {memberError && <p className={styles.error}>{memberError}</p>}
          <input
            className={styles.input}
            type="text"
            placeholder="User ID (e.g. USR-...)"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Username"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            required
          />
          <button className={styles.submitBtn} type="submit" disabled={memberLoading}>
            {memberLoading ? 'Adding...' : 'Add Member'}
          </button>
        </form>
      </div>

      {/* Fases */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📋 Phases ({phases.length})</h2>
        {phases.length === 0 ? (
          <p className={styles.empty}>No phases yet.</p>
        ) : (
          <div className={styles.phaseList}>
            {phases.map((phase) => (
              <div key={phase.phaseId} className={styles.phaseCard}>
                <span className={styles.phaseOrder}>#{phase.sequenceOrder}</span>
                <span className={styles.phaseName}>{phase.name}</span>
                <span className={styles.phaseStatus}>{phase.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tareas */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>✅ Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p className={styles.empty}>No tasks yet.</p>
        ) : (
          <div className={styles.taskList}>
            {tasks.map((task) => (
              <div key={task.taskId} className={styles.taskCard}>
                <div className={styles.taskHeader}>
                  <span className={styles.taskTitle}>{task.title}</span>
                  <span className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}>
                    {task.priority}
                  </span>
                </div>
                <span className={styles.taskStatus}>{task.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}