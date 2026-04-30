import { useState } from 'react';
import type { Task, TaskStatus, Phase } from '../../types/projects';
import { taskService } from '../../api/projectService';
import styles from './KanbanBoard.module.css';

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'TODO',        label: 'To Do',      color: 'col_todo' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'col_progress' },
  { status: 'IN_REVIEW',   label: 'In Review',   color: 'col_review' },
  { status: 'DONE',        label: 'Done',        color: 'col_done' },
];

const PRIORITY_COLOR: Record<string, string> = {
  LOW: '#059669', MEDIUM: '#d97706', HIGH: '#dc2626', CRITICAL: '#be185d',
};

interface KanbanBoardProps {
  phase: Phase;
  tasks: Task[];
  onTasksChange: () => void;
}

export function KanbanBoard({ phase, tasks, onTasksChange }: KanbanBoardProps) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    setDraggingId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(status);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    if (!draggingId) return;

    const task = tasks.find(t => t.taskId === draggingId);
    if (!task || task.status === newStatus) return;

    await taskService.updateStatus(draggingId, newStatus).catch(() => {});
    onTasksChange();
    setDraggingId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverCol(null);
  };

  return (
    <div className={styles.board}>
      {/* Phase header */}
      <div className={styles.phaseHeader}>
        <div className={styles.phaseNumber}>{phase.sequenceOrder}</div>
        <div className={styles.phaseInfo}>
          <span className={styles.phaseName}>{phase.name}</span>
          {(phase.plannedStart || phase.plannedEnd) && (
            <span className={styles.phaseDates}>
              {phase.plannedStart} {phase.plannedEnd && `→ ${phase.plannedEnd}`}
            </span>
          )}
        </div>
        <span className={styles.taskCount}>{tasks.length} tasks</span>
      </div>

      {/* Columns */}
      <div className={styles.columns}>
        {COLUMNS.map(({ status, label, color }) => {
          const colTasks = tasks.filter(t => t.status === status);
          const isOver = dragOverCol === status;

          return (
            <div
              key={status}
              className={`${styles.column} ${isOver ? styles.columnOver : ''}`}
              onDragOver={e => handleDragOver(e, status)}
              onDrop={e => handleDrop(e, status)}
              onDragLeave={() => setDragOverCol(null)}
            >
              <div className={styles.colHeader}>
                <div className={`${styles.colDot} ${styles[color]}`} />
                <span className={styles.colLabel}>{label}</span>
                <span className={styles.colCount}>{colTasks.length}</span>
              </div>

              <div className={styles.cards}>
                {colTasks.map(task => (
                  <div
                    key={task.taskId}
                    className={`${styles.card} ${draggingId === task.taskId ? styles.cardDragging : ''}`}
                    draggable
                    onDragStart={e => handleDragStart(e, task.taskId)}
                    onDragEnd={handleDragEnd}
                  >
                    <div
                      className={styles.priorityStripe}
                      style={{ background: PRIORITY_COLOR[task.priority] }}
                    />
                    <div className={styles.cardBody}>
                      <span className={styles.cardTitle}>{task.title}</span>
                      {task.description && (
                        <p className={styles.cardDesc}>{task.description}</p>
                      )}
                      <div className={styles.cardFooter}>
                        <span
                          className={styles.priorityBadge}
                          style={{
                            color: PRIORITY_COLOR[task.priority],
                            background: PRIORITY_COLOR[task.priority] + '18',
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className={`${styles.emptyCol} ${isOver ? styles.emptyColOver : ''}`}>
                    drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}