import { useState } from 'react';
import type { Phase, Task } from '../../../types/projects';
import { phaseService, taskService } from '../../../api/projectService';
import { TaskModal } from '../TaskModal';
import { ConfirmModal } from '../../shared/ConfirmModal';
import styles from './Tabs.module.css';

const PRIORITY_COLOR: Record<string, string> = {
  LOW: '#059669', MEDIUM: '#d97706', HIGH: '#dc2626', CRITICAL: '#be185d',
};

interface PhasesTabProps {
  phases: Phase[];
  tasks: Task[];
  projectId: number;
  onReload: () => void;
  onTabChange: (tab: string) => void;
}

export function PhasesTab({ phases, tasks, projectId, onReload, onTabChange }: PhasesTabProps) {
  const [selectedTask, setSelectedTask]       = useState<Task | null>(null);
  const [editingPhaseId, setEditingPhaseId]   = useState<number | null>(null);
  const [editPhaseName, setEditPhaseName]     = useState('');
  const [editPhaseStart, setEditPhaseStart]   = useState('');
  const [editPhaseEnd, setEditPhaseEnd]       = useState('');
  const [editPhaseLoading, setEditPhaseLoading] = useState(false);
  const [addingTaskToPhase, setAddingTaskToPhase] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle]           = useState('');
  const [newTaskLoading, setNewTaskLoading]       = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    title: string; message: string; onConfirm: () => void;
  } | null>(null);

  const startEditPhase = (phase: Phase) => {
    setEditingPhaseId(phase.phaseId);
    setEditPhaseName(phase.name);
    setEditPhaseStart(phase.plannedStart ?? '');
    setEditPhaseEnd(phase.plannedEnd ?? '');
  };

  const handleEditPhase = async (e: React.FormEvent, phase: Phase) => {
    e.preventDefault();
    setEditPhaseLoading(true);
    try {
      await phaseService.update(phase.phaseId, {
        name: editPhaseName,
        sequenceOrder: phase.sequenceOrder,
        plannedStart: editPhaseStart || undefined,
        plannedEnd: editPhaseEnd || undefined,
      });
      setEditingPhaseId(null);
      onReload();
    } finally {
      setEditPhaseLoading(false);
    }
  };

  const handleDeletePhase = (phase: Phase) => {
    setConfirmModal({
      title: `Eliminar fase "${phase.name}"`,
      message: 'Esta acción eliminará la fase y todas sus tareas. No se puede deshacer.',
      onConfirm: async () => {
        setConfirmModal(null);
        await phaseService.delete(phase.phaseId).catch(() => {});
        onReload();
      },
    });
  };

  const handleQuickAddTask = async (e: React.FormEvent, phaseId: number) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setNewTaskLoading(true);
    try {
      await taskService.create(projectId, {
        title: newTaskTitle.trim(),
        priority: null,
        status: 'TODO',
        phaseId,
      } as any);
      setNewTaskTitle('');
      setAddingTaskToPhase(null);
      onReload();
    } finally {
      setNewTaskLoading(false);
    }
  };

  const handleDeleteTask = (task: Task) => {
    setConfirmModal({
      title: `Eliminar tarea "${task.title}"`,
      message: 'Esta acción eliminará la tarea permanentemente.',
      onConfirm: async () => {
        setConfirmModal(null);
        await taskService.deleteTask(task.taskId).catch(() => {});
        onReload();
      },
    });
  };

  if (phases.length === 0) {
    return (
      <div className={styles.overview}>
        <div className={styles.card}>
          <p className={styles.empty}>No phases yet — use "+ Add Phase" above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overview}>
      {phases.map(phase => {
        const pTasks = tasks.filter(t => t.phaseId === phase.phaseId);
        const done = pTasks.filter(t => t.status === 'DONE').length;
        const pct = pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0;
        const isEditing = editingPhaseId === phase.phaseId;

        return (
          <div key={phase.phaseId} className={styles.card}>

            {isEditing ? (
              <form className={styles.editPhaseForm} onSubmit={e => handleEditPhase(e, phase)}>
                <input className={styles.input} value={editPhaseName}
                  onChange={e => setEditPhaseName(e.target.value)}
                  placeholder="Phase name *" autoFocus required />
                <input className={styles.input} type="date"
                  value={editPhaseStart} onChange={e => setEditPhaseStart(e.target.value)} />
                <input className={styles.input} type="date"
                  value={editPhaseEnd} onChange={e => setEditPhaseEnd(e.target.value)} />
                <button className={styles.saveBtn} type="submit" disabled={editPhaseLoading}>
                  {editPhaseLoading ? '...' : '✓ Save'}
                </button>
                <button type="button" className={styles.cancelBtn}
                  onClick={() => setEditingPhaseId(null)}>Cancel</button>
              </form>
            ) : (
              <div className={styles.phaseListHeader}>
                <div>
                  <span className={styles.phaseListName}>{phase.name}</span>
                  {(phase.plannedStart || phase.plannedEnd) && (
                    <span className={styles.phaseListDates}>
                      {phase.plannedStart}{phase.plannedEnd && ` → ${phase.plannedEnd}`}
                    </span>
                  )}
                </div>
                <div className={styles.phaseListRight}>
                  <span className={styles.pct}>{pct}%</span>
                  <button className={styles.boardBtn}
                    onClick={() => onTabChange(String(phase.phaseId))}>
                    Ver board →
                  </button>
                  <button className={styles.iconBtn}
                    onClick={() => startEditPhase(phase)}>✏️</button>
                  <button className={styles.iconBtnDanger}
                    onClick={() => handleDeletePhase(phase)}>🗑</button>
                </div>
              </div>
            )}

            {!isEditing && (
              <>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                </div>

                <div className={styles.taskList}>
                  {pTasks.length === 0 ? (
                    <p className={styles.empty}>No tasks yet.</p>
                  ) : (
                    pTasks.map(task => (
                      <div key={task.taskId} className={styles.taskRow}
                        onClick={() => setSelectedTask(task)}>
                        <div className={styles.taskDot}
                          style={{ background: task.status === 'DONE' ? '#059669' : '#94a3b8' }} />
                        {task.taskCode && (
                          <span className={styles.taskCode}>{task.taskCode}</span>
                        )}
                        <span className={styles.taskTitle}>{task.title}</span>
                        <span className={styles.taskStatus}>
                          {task.status.replace(/_/g, ' ')}
                        </span>
                        {task.priority && (
                          <span className={styles.taskPriority}
                            style={{ color: PRIORITY_COLOR[task.priority] }}>
                            {task.priority}
                          </span>
                        )}
                        <button className={styles.iconBtnDanger}
                          onClick={e => { e.stopPropagation(); handleDeleteTask(task); }}>
                          🗑
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {addingTaskToPhase === phase.phaseId ? (
                  <form className={styles.quickForm}
                    onSubmit={e => handleQuickAddTask(e, phase.phaseId)}>
                    <input className={styles.quickInput}
                      placeholder="¿Qué hay que hacer?"
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Escape') {
                          setAddingTaskToPhase(null);
                          setNewTaskTitle('');
                        }
                      }}
                    />
                    <button className={styles.quickSave} type="submit" disabled={newTaskLoading}>↵</button>
                    <button type="button" className={styles.quickCancel}
                      onClick={() => { setAddingTaskToPhase(null); setNewTaskTitle(''); }}>✕</button>
                  </form>
                ) : (
                  <button className={styles.addTaskBtn}
                    onClick={() => setAddingTaskToPhase(phase.phaseId)}>
                    ＋ Agregar tarea
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={() => { onReload(); setSelectedTask(null); }}
          onDelete={() => { onReload(); setSelectedTask(null); }}
        />
      )}

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