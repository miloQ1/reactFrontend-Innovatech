import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService, phaseService, taskService, memberService } from '../api/projectService';
import type { Project, Phase, Task, ProjectMember, PhaseStatus, TaskStatus, TaskPriority } from '../types/project';
import styles from './ProjectDetailPage.module.css';

// ── Helpers de color ──────────────────────────────────
function statusColor(status: string) {
  const map: Record<string, string> = {
    PLANNING: 'blue', IN_PROGRESS: 'indigo', ON_HOLD: 'warning',
    COMPLETED: 'success', CANCELLED: 'danger',
    PENDING: 'blue', DONE: 'success',
  };
  return map[status] ?? 'muted';
}

function priorityColor(priority: TaskPriority) {
  const map: Record<string, string> = {
    LOW: 'success', MEDIUM: 'warning', HIGH: 'danger', CRITICAL: 'critical',
  };
  return map[priority] ?? 'muted';
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [project, setProject]   = useState<Project | null>(null);
  const [phases, setPhases]     = useState<Phase[]>([]);
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [members, setMembers]   = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'phases' | 'tasks' | 'members'>('phases');

  // Formulario fase
  const [showPhaseForm, setShowPhaseForm] = useState(false);
  const [phaseName, setPhaseName]         = useState('');
  const [phaseOrder, setPhaseOrder]       = useState('');
  const [phaseStatus, setPhaseStatus]     = useState<PhaseStatus>('PENDING');
  const [phaseLoading, setPhaseLoading]   = useState(false);

  // Formulario tarea
  const [showTaskForm, setShowTaskForm]   = useState(false);
  const [taskTitle, setTaskTitle]         = useState('');
  const [taskDesc, setTaskDesc]           = useState('');
  const [taskPriority, setTaskPriority]   = useState<TaskPriority>('MEDIUM');
  const [taskStatus, setTaskStatus]       = useState<TaskStatus>('TODO');
  const [taskLoading, setTaskLoading]     = useState(false);

  // Formulario miembro
  const [newUserId, setNewUserId]         = useState('');
  const [newUserName, setNewUserName]     = useState('');
  const [memberError, setMemberError]     = useState<string | null>(null);
  const [memberLoading, setMemberLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    const projectId = Number(id);
    try {
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

  useEffect(() => { loadData(); }, [loadData]);

  // ── Handlers ─────────────────────────────────────────
  const handleAddPhase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setPhaseLoading(true);
    try {
      await phaseService.create(Number(id), {
        name: phaseName,
        sequenceOrder: Number(phaseOrder),
        status: phaseStatus,
      });
      setPhaseName(''); setPhaseOrder(''); setPhaseStatus('PENDING');
      setShowPhaseForm(false);
      loadData();
    } finally {
      setPhaseLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setTaskLoading(true);
    try {
      await taskService.create(Number(id), {
        title: taskTitle,
        description: taskDesc || undefined,
        priority: taskPriority,
        status: taskStatus,
      });
      setTaskTitle(''); setTaskDesc(''); setTaskPriority('MEDIUM'); setTaskStatus('TODO');
      setShowTaskForm(false);
      loadData();
    } finally {
      setTaskLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setMemberLoading(true);
    setMemberError(null);
    try {
      await memberService.add(Number(id), { userId: newUserId, userName: newUserName });
      setNewUserId(''); setNewUserName('');
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

  // ── Render ────────────────────────────────────────────
  if (isLoading) return <div className={styles.loading}>Loading project...</div>;

  if (!project) {
    return (
      <div className={styles.notFound}>
        <h2 className={styles.notFoundTitle}>Project not found</h2>
        <Link to="/clients" className={styles.backLink}>← Back to clients</Link>
      </div>
    );
  }

  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className={styles.page}>
      <Link to={`/clients/${project.client.clientId}`} className={styles.backLink}>
        ← {project.client.name}
      </Link>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.titleRow}>
            <h1 className={styles.projectName}>{project.name}</h1>
            <span className={`${styles.statusBadge} ${styles[`status_${statusColor(project.status)}`]}`}>
              {project.status.replace(/_/g, ' ')}
            </span>
          </div>
          <span className={styles.code}>#{project.code}</span>
          {project.description && (
            <p className={styles.description}>{project.description}</p>
          )}
        </div>
      </div>

      {/* Meta pills */}
      <div className={styles.metaRow}>
        <span className={styles.metaPill}>🏢 {project.client.name}</span>
        <span className={styles.metaPill}>📅 {formattedDate}</span>
        {project.startDate && <span className={styles.metaPill}>🚀 {project.startDate}</span>}
        {project.endDate && <span className={styles.metaPill}>🏁 {project.endDate}</span>}
        {project.budget && <span className={styles.metaPill}>💰 ${project.budget.toLocaleString()}</span>}
      </div>

      {/* Stat cards */}
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
          <span className={styles.statValue}>
            {tasks.filter(t => t.status === 'DONE').length}
          </span>
          <span className={styles.statLabel}>Done</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{members.length}</span>
          <span className={styles.statLabel}>Members</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {(['phases', 'tasks', 'members'] as const).map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'phases' && `📋 Phases (${phases.length})`}
            {tab === 'tasks' && `✅ Tasks (${tasks.length})`}
            {tab === 'members' && `👥 Members (${members.length})`}
          </button>
        ))}
      </div>

      {/* ── Tab: Phases ── */}
      {activeTab === 'phases' && (
        <div className={styles.tabContent}>
          <div className={styles.tabHeader}>
            <h2 className={styles.tabTitle}>Phases</h2>
            <button className={styles.addBtn} onClick={() => setShowPhaseForm(v => !v)}>
              {showPhaseForm ? 'Cancel' : '➕ Add Phase'}
            </button>
          </div>

          {showPhaseForm && (
            <form className={styles.inlineForm} onSubmit={handleAddPhase}>
              <input className={styles.input} placeholder="Phase name" value={phaseName}
                onChange={e => setPhaseName(e.target.value)} required />
              <input className={styles.input} placeholder="Order (1, 2, 3...)" type="number"
                value={phaseOrder} onChange={e => setPhaseOrder(e.target.value)} required />
              <select className={styles.input} value={phaseStatus}
                onChange={e => setPhaseStatus(e.target.value as PhaseStatus)}>
                {['PENDING','IN_PROGRESS','COMPLETED','CANCELLED'].map(s => (
                  <option key={s} value={s}>{s.replace('_',' ')}</option>
                ))}
              </select>
              <button className={styles.submitBtn} type="submit" disabled={phaseLoading}>
                {phaseLoading ? 'Saving...' : 'Save Phase'}
              </button>
            </form>
          )}

          {phases.length === 0 ? (
            <p className={styles.empty}>No phases yet. Add the first one.</p>
          ) : (
            <div className={styles.phaseList}>
              {phases
                .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
                .map((phase) => (
                <div key={phase.phaseId} className={styles.phaseCard}>
                  <div className={styles.phaseNumber}>{phase.sequenceOrder}</div>
                  <div className={styles.phaseInfo}>
                    <span className={styles.phaseName}>{phase.name}</span>
                    {(phase.plannedStart || phase.plannedEnd) && (
                      <span className={styles.phaseDates}>
                        {phase.plannedStart} {phase.plannedEnd && `→ ${phase.plannedEnd}`}
                      </span>
                    )}
                  </div>
                  <span className={`${styles.badge} ${styles[`status_${statusColor(phase.status)}`]}`}>
                    {phase.status.replace('_',' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Tasks ── */}
      {activeTab === 'tasks' && (
        <div className={styles.tabContent}>
          <div className={styles.tabHeader}>
            <h2 className={styles.tabTitle}>Tasks</h2>
            <button className={styles.addBtn} onClick={() => setShowTaskForm(v => !v)}>
              {showTaskForm ? 'Cancel' : '➕ Add Task'}
            </button>
          </div>

          {showTaskForm && (
            <form className={styles.inlineForm} onSubmit={handleAddTask}>
              <input className={styles.input} placeholder="Task title" value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)} required />
              <textarea className={styles.textarea} placeholder="Description (optional)"
                value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
              <div className={styles.formRow}>
                <select className={styles.input} value={taskPriority}
                  onChange={e => setTaskPriority(e.target.value as TaskPriority)}>
                  {['LOW','MEDIUM','HIGH','CRITICAL'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <select className={styles.input} value={taskStatus}
                  onChange={e => setTaskStatus(e.target.value as TaskStatus)}>
                  {['TODO','IN_PROGRESS','IN_REVIEW','DONE','CANCELLED'].map(s => (
                    <option key={s} value={s}>{s.replace('_',' ')}</option>
                  ))}
                </select>
              </div>
              <button className={styles.submitBtn} type="submit" disabled={taskLoading}>
                {taskLoading ? 'Saving...' : 'Save Task'}
              </button>
            </form>
          )}

          {tasks.length === 0 ? (
            <p className={styles.empty}>No tasks yet. Add the first one.</p>
          ) : (
            <div className={styles.taskList}>
              {tasks.map((task) => (
                <div key={task.taskId} className={styles.taskCard}>
                  <div className={styles.taskLeft}>
                    <span className={`${styles.priorityDot} ${styles[`priority_${priorityColor(task.priority)}`]}`} />
                    <div>
                      <span className={styles.taskTitle}>{task.title}</span>
                      {task.description && (
                        <p className={styles.taskDesc}>{task.description}</p>
                      )}
                    </div>
                  </div>
                  <div className={styles.taskRight}>
                    <span className={`${styles.badge} ${styles[`status_${statusColor(task.status)}`]}`}>
                      {task.status.replace(/_/g,' ')}
                    </span>
                    <span className={`${styles.priorityBadge} ${styles[`priority_${priorityColor(task.priority)}`]}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Members ── */}
      {activeTab === 'members' && (
        <div className={styles.tabContent}>
          <div className={styles.tabHeader}>
            <h2 className={styles.tabTitle}>Members</h2>
          </div>

          {members.length === 0 ? (
            <p className={styles.empty}>No members yet.</p>
          ) : (
            <div className={styles.memberList}>
              {members.map((m) => (
                <div key={m.id} className={styles.memberCard}>
                  <div className={styles.memberAvatar}>
                    {m.userName.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.memberName}>@{m.userName}</span>
                  <button className={styles.removeBtn} onClick={() => handleRemoveMember(m.userId)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <form className={styles.inlineForm} onSubmit={handleAddMember}>
            <h3 className={styles.formSubtitle}>Add Member</h3>
            {memberError && <p className={styles.errorMsg}>{memberError}</p>}
            <input className={styles.input} placeholder="User ID (USR-...)"
              value={newUserId} onChange={e => setNewUserId(e.target.value)} required />
            <input className={styles.input} placeholder="Username"
              value={newUserName} onChange={e => setNewUserName(e.target.value)} required />
            <button className={styles.submitBtn} type="submit" disabled={memberLoading}>
              {memberLoading ? 'Adding...' : 'Add Member'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}