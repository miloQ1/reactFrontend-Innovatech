import { useState, useEffect, useCallback } from 'react';
import type {
  Phase, Task, TaskStatus, TaskPriority,
  BoardColumn
} from '../../types/projects';
import { taskService, columnService } from '../../api/projectService';
import styles from './PhaseBoard.module.css';
import { TaskModal } from './TaskModal';

interface PhaseBoardProps {
  phase: Phase;
  tasks: Task[];
  projectId: number;
  onTasksChange: () => void;
}

const PRIORITY_COLOR: Record<string, string> = {
  LOW: '#059669', MEDIUM: '#d97706', HIGH: '#dc2626', CRITICAL: '#be185d',
};

export function PhaseBoard({ phase, tasks, projectId, onTasksChange }: PhaseBoardProps) {
  const [columns, setColumns]         = useState<BoardColumn[]>([]);
  const [draggingId, setDraggingId]   = useState<number | null>(null);
  const [dragOverCol, setDragOverCol] = useState<number | null>(null);

  // Quick add task
  const [addingToColId, setAddingToColId] = useState<number | null>(null);
  const [quickTitle, setQuickTitle]       = useState('');
  const [taskLoading, setTaskLoading]     = useState(false);

  // Add column
  const [showColForm, setShowColForm] = useState(false);
  const [colName, setColName]         = useState('');
  const [colColor, setColColor]       = useState('#6366f1');
  const [colStatus, setColStatus]     = useState('');
  const [colLoading, setColLoading]   = useState(false);

  // Edit column
  const [editingColId, setEditingColId] = useState<number | null>(null);
  const [editName, setEditName]         = useState('');
  const [editColor, setEditColor]       = useState('');

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadColumns = useCallback(async () => {
    const cols = await columnService.getByPhase(phase.phaseId);
    setColumns(cols);
  }, [phase.phaseId]);

  useEffect(() => { loadColumns(); }, [loadColumns]);

  // ── Drag ──────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    setDraggingId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e: React.DragEvent, col: BoardColumn) => {
    e.preventDefault();
    setDragOverCol(null);
    if (!draggingId) return;
    const task = tasks.find(t => t.taskId === draggingId);
    if (!task) return;
    if (col.mappedStatus && task.status !== col.mappedStatus) {
      await taskService.updateStatus(draggingId, col.mappedStatus as TaskStatus).catch(() => {});
      onTasksChange();
    }
    setDraggingId(null);
  };

  // ── Quick add task ────────────────────────────────
  const handleQuickAdd = async (e: React.FormEvent, col: BoardColumn) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    setTaskLoading(true);
    try {
      await taskService.create(projectId, {
        title: quickTitle.trim(),
        priority: null,
        status: (col.mappedStatus as TaskStatus) ?? 'TODO',
        phaseId: phase.phaseId,
      } as any);
      setQuickTitle('');
      setAddingToColId(null);
      onTasksChange();
    } finally {
      setTaskLoading(false);
    }
  };

  // ── Add column ────────────────────────────────────
  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    setColLoading(true);
    try {
      await columnService.create(phase.phaseId, {
        name: colName,
        color: colColor,
        mappedStatus: colStatus || undefined,
      });
      setColName(''); setColColor('#6366f1'); setColStatus('');
      setShowColForm(false);
      loadColumns();
    } finally {
      setColLoading(false);
    }
  };

  // ── Edit column ───────────────────────────────────
  const startEdit = (col: BoardColumn) => {
    setEditingColId(col.columnId);
    setEditName(col.name);
    setEditColor(col.color);
  };

  const handleEditColumn = async (e: React.FormEvent, col: BoardColumn) => {
    e.preventDefault();
    await columnService.update(phase.phaseId, col.columnId, {
      name: editName,
      color: editColor,
    });
    setEditingColId(null);
    loadColumns();
  };

  const handleDeleteColumn = async (col: BoardColumn) => {
    if (!confirm(`Delete column "${col.name}"?`)) return;
    await columnService.delete(phase.phaseId, col.columnId);
    loadColumns();
  };

  // ── Render ────────────────────────────────────────
  const getColTasks = (col: BoardColumn) =>
    col.mappedStatus
      ? tasks.filter(t => t.status === col.mappedStatus)
      : [];

  return (
    <div className={styles.board}>

      {/* Phase header */}
      <div className={styles.phaseHeader}>
        <div className={styles.phaseInfo}>
          <span className={styles.phaseName}>{phase.name}</span>
          {(phase.plannedStart || phase.plannedEnd) && (
            <span className={styles.phaseDates}>
              {phase.plannedStart}{phase.plannedEnd && ` → ${phase.plannedEnd}`}
            </span>
          )}
        </div>
        <div className={styles.phaseActions}>
          <span className={styles.phaseStats}>
            {tasks.length} tasks · {tasks.filter(t => t.status === 'DONE').length} done
          </span>
          <button
            className={styles.addColBtn}
            onClick={() => { setShowColForm(v => !v); setAddingToColId(null); }}
          >
            {showColForm ? '✕' : '⊞ Add column'}
          </button>
        </div>
      </div>

      {/* Add column form */}
      {showColForm && (
        <form className={styles.colForm} onSubmit={handleAddColumn}>
          <input
            className={styles.colInput}
            placeholder="Column name *"
            value={colName}
            onChange={e => setColName(e.target.value)}
            required
            autoFocus
          />
          <div className={styles.colColorRow}>
            <label className={styles.colColorLabel}>Color</label>
            <input
              type="color"
              className={styles.colorPicker}
              value={colColor}
              onChange={e => setColColor(e.target.value)}
            />
            <span className={styles.colColorValue}>{colColor}</span>
          </div>
          <select
            className={styles.colInput}
            value={colStatus}
            onChange={e => setColStatus(e.target.value)}
          >
            <option value="">No status mapping</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="IN_REVIEW">IN_REVIEW</option>
            <option value="DONE">DONE</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <div className={styles.colFormActions}>
            <button className={styles.saveBtn} type="submit" disabled={colLoading}>
              {colLoading ? '...' : 'Add'}
            </button>
            <button type="button" className={styles.cancelBtn}
              onClick={() => setShowColForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Kanban columns */}
      <div className={styles.columns}>
        {columns.map(col => {
          const colTasks = getColTasks(col);
          const isOver = dragOverCol === col.columnId;

          return (
            <div
              key={col.columnId}
              className={`${styles.column} ${isOver ? styles.columnOver : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOverCol(col.columnId); }}
              onDrop={e => handleDrop(e, col)}
              onDragLeave={() => setDragOverCol(null)}
            >
              {/* Column header */}
              {editingColId === col.columnId ? (
                <form className={styles.editColForm} onSubmit={e => handleEditColumn(e, col)}>
                  <input
                    className={styles.colInput}
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    autoFocus
                    required
                  />
                  <input
                    type="color"
                    className={styles.colorPicker}
                    value={editColor}
                    onChange={e => setEditColor(e.target.value)}
                  />
                  <button className={styles.saveBtn} type="submit">✓</button>
                  <button type="button" className={styles.cancelBtn}
                    onClick={() => setEditingColId(null)}>✕</button>
                </form>
              ) : (
                <div className={styles.colHeader}>
                  <div className={styles.colDot} style={{ background: col.color }} />
                  <span className={styles.colName}>{col.name}</span>
                  <span className={styles.colCount}>{colTasks.length}</span>
                  <div className={styles.colMenu}>
                    <button className={styles.colMenuBtn} onClick={() => startEdit(col)}
                      title="Edit">✏️</button>
                    <button className={styles.colMenuBtn} onClick={() => handleDeleteColumn(col)}
                      title="Delete">🗑</button>
                  </div>
                </div>
              )}

              {/* Tasks */}
              <div className={styles.cards}>
                {colTasks.map(task => (
              <div
                key={task.taskId}
                className={`${styles.taskCard} ${draggingId === task.taskId ? styles.dragging : ''}`}
                draggable
                onDragStart={e => handleDragStart(e, task.taskId)}
                onDragEnd={() => { setDraggingId(null); setDragOverCol(null); }}
                onClick={() => setSelectedTask(task)}
              >
                <div
                  className={styles.priorityStripe}
                  style={{ background: task.priority ? PRIORITY_COLOR[task.priority] : '#e2e8f0' }}
                />
                <div className={styles.taskBody}>
                  {task.taskCode && (
                    <span className={styles.taskCode}>{task.taskCode}</span>
                  )}
                  <span className={styles.taskTitle}>{task.title}</span>
                  {task.description && (
                    <p className={styles.taskDesc}>{task.description}</p>
                  )}
                  {task.priority && (
                    <span
                      className={styles.priorityBadge}
                      style={{
                        color: PRIORITY_COLOR[task.priority],
                        background: PRIORITY_COLOR[task.priority] + '18',
                      }}
                    >
                      {task.priority}
                    </span>
                  )}
                </div>
              </div>
            ))}

                {colTasks.length === 0 && (
                  <div className={`${styles.emptyCol} ${isOver ? styles.emptyColOver : ''}`}>
                    drop here
                  </div>
                )}
              </div>

              {/* Quick add */}
              {addingToColId === col.columnId ? (
                <form
                  className={styles.quickForm}
                  onSubmit={e => handleQuickAdd(e, col)}
                >
                  <input
                    className={styles.quickInput}
                    placeholder="¿Qué hay que hacer?"
                    value={quickTitle}
                    onChange={e => setQuickTitle(e.target.value)}
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Escape') {
                        setAddingToColId(null);
                        setQuickTitle('');
                      }
                    }}
                  />
                  <div className={styles.quickActions}>
                    <button className={styles.quickSave} type="submit" disabled={taskLoading}>
                      ↵
                    </button>
                    <button
                      type="button"
                      className={styles.quickCancel}
                      onClick={() => { setAddingToColId(null); setQuickTitle(''); }}
                    >
                      ✕
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className={styles.addTaskBtn}
                  onClick={() => {
                    setAddingToColId(col.columnId);
                    setShowColForm(false);
                  }}
                >
                  ＋ Crear
                </button>
              )}
            </div>
          );
        })}

        {columns.length === 0 && (
          <div className={styles.noColumns}>
            <p>No columns yet.</p>
            <button className={styles.saveBtn} onClick={() => setShowColForm(true)}>
              ⊞ Add your first column
            </button>
          </div>
        )}
      </div>
      
    ´{selectedTask && (
      <TaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={() => { onTasksChange(); setSelectedTask(null); }}
        onDelete={() => { onTasksChange(); setSelectedTask(null); }}
      />
    )}

    </div>
  );
}