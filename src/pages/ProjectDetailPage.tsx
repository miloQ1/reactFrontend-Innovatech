import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService, phaseService, taskService, memberService } from '../api/projectService';
import type { Project, Phase, Task, ProjectMember } from '../types/projects';
import { OverviewTab } from '../components/projects/tabs/OverviewTab';
import { PhasesTab }   from '../components/projects/tabs/PhasesTab';
import { MembersTab }  from '../components/projects/tabs/MembersTab';
import { PhaseBoard }  from '../components/projects/PhaseBoard';
import { ConfirmModal } from '../components/shared/ConfirmModal';
import styles from './ProjectDetailPage.module.css';

function statusColor(status: string) {
  const map: Record<string, string> = {
    PLANNING: 'blue', IN_PROGRESS: 'indigo', ON_HOLD: 'warning',
    COMPLETED: 'success', CANCELLED: 'danger', PENDING: 'blue', DONE: 'success',
  };
  return map[status] ?? 'muted';
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [project, setProject]     = useState<Project | null>(null);
  const [phases, setPhases]       = useState<Phase[]>([]);
  const [tasks, setTasks]         = useState<Task[]>([]);
  const [members, setMembers]     = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Form nueva fase
  const [showPhaseForm, setShowPhaseForm] = useState(false);
  const [phaseName, setPhaseName]         = useState('');
  const [phaseStart, setPhaseStart]       = useState('');
  const [phaseEnd, setPhaseEnd]           = useState('');
  const [phaseLoading, setPhaseLoading]   = useState(false);

  // Confirm modal (para eliminar fase desde topbar si se quiere)
  const [confirmModal, setConfirmModal] = useState<{
    title: string; message: string; onConfirm: () => void;
  } | null>(null);

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
      setPhases(phs.sort((a, b) => a.sequenceOrder - b.sequenceOrder));
      setTasks(tsks);
      setMembers(mems);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAddPhase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setPhaseLoading(true);
    try {
      const newPhase = await phaseService.create(Number(id), {
        name: phaseName,
        sequenceOrder: phases.length + 1,
        plannedStart: phaseStart || undefined,
        plannedEnd: phaseEnd || undefined,
      });
      setPhaseName(''); setPhaseStart(''); setPhaseEnd('');
      setShowPhaseForm(false);
      await loadData();
      setActiveTab(String(newPhase.phaseId));
    } finally {
      setPhaseLoading(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;

  if (!project) {
    return (
      <div className={styles.notFound}>
        <Link to="/clients" className={styles.backLink}>← Back to clients</Link>
        <h2>Project not found</h2>
      </div>
    );
  }

  const activePhase = phases.find(p => String(p.phaseId) === activeTab);
  const phaseTasks  = activePhase ? tasks.filter(t => t.phaseId === activePhase.phaseId) : [];

  return (
    <div className={styles.page}>

      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <Link to={`/clients/${project.client.clientId}`} className={styles.backLink}>
          ← {project.client.name}
        </Link>
        <div className={styles.topBarCenter}>
          <span className={styles.topBarName}>{project.name}</span>
          <span className={styles.topBarCode}>#{project.code}</span>
          <span className={`${styles.topBarBadge} ${styles[`status_${statusColor(project.status)}`]}`}>
            {project.status.replace(/_/g, ' ')}
          </span>
        </div>
        <div className={styles.topBarRight}>
          <span className={styles.topBarMeta}>{tasks.length} tasks</span>
          <span className={styles.topBarMeta}>{tasks.filter(t => t.status === 'DONE').length} done</span>
          <span className={styles.topBarMeta}>{members.length} members</span>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >🗂 Resumen</button>

        <button
          className={`${styles.tab} ${activeTab === 'phases' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('phases')}
        >📋 Fases ({phases.length})</button>

        {phases.map(phase => (
          <button
            key={phase.phaseId}
            className={`${styles.tab} ${activeTab === String(phase.phaseId) ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(String(phase.phaseId))}
          >
            <span className={`${styles.phaseDot} ${styles[`status_${statusColor(phase.computedStatus ?? phase.status)}`]}`} />
            {phase.name}
          </button>
        ))}

        <button
          className={`${styles.tab} ${activeTab === 'members' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('members')}
        >👥 Miembros ({members.length})</button>

        {!showPhaseForm && (
          <button className={styles.addPhaseBtn} onClick={() => setShowPhaseForm(true)}>
            ＋ Add Phase
          </button>
        )}
      </div>

      {/* ── Form nueva fase ── */}
      {showPhaseForm && (
        <form className={styles.phaseForm} onSubmit={handleAddPhase}>
          <input className={styles.phaseInput} placeholder="Phase name *"
            value={phaseName} onChange={e => setPhaseName(e.target.value)} autoFocus required />
          <input className={styles.phaseInput} type="date"
            value={phaseStart} onChange={e => setPhaseStart(e.target.value)} />
          <input className={styles.phaseInput} type="date"
            value={phaseEnd} onChange={e => setPhaseEnd(e.target.value)} />
          <button className={styles.phaseSaveBtn} type="submit" disabled={phaseLoading}>
            {phaseLoading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className={styles.phaseCancelBtn}
            onClick={() => { setShowPhaseForm(false); setPhaseName(''); }}>
            Cancel
          </button>
        </form>
      )}

      {/* ── Tab content ── */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <OverviewTab
            project={project}
            phases={phases}
            tasks={tasks}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === 'phases' && (
          <PhasesTab
            phases={phases}
            tasks={tasks}
            projectId={Number(id)}
            onReload={loadData}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === 'members' && (
          <MembersTab
            members={members}
            projectId={Number(id)}
            onReload={loadData}
          />
        )}

        {activePhase && (
          <PhaseBoard
            phase={activePhase}
            tasks={phaseTasks}
            onTasksChange={loadData}
            projectId={Number(id)}
          />
        )}
      </div>

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel="Eliminar"
          danger
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

    </div>
  );
}