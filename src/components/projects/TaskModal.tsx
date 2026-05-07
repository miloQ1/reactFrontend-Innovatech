import { useState, useEffect } from 'react';
import type { Task, TaskPriority, TaskStatus } from '../../types/projects';
import { taskService, professionalService, threadService, commentService } from '../../api/projectService';
import { useAuth } from '../../hooks/useAuth';
import styles from './TaskModal.module.css';

const PRIORITY_COLOR: Record<string, string> = {
  LOW: '#059669', MEDIUM: '#d97706', HIGH: '#dc2626', CRITICAL: '#be185d',
};

interface TaskModalProps {
  task: Task;
  projectId: number;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

export function TaskModal({ task, projectId, onClose, onUpdate, onDelete }: TaskModalProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing]     = useState(false);
  const [title, setTitle]             = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [priority, setPriority]       = useState<TaskPriority | null>(task.priority);
  const [status, setStatus]           = useState<TaskStatus>(task.status);
  const [dueDate, setDueDate]         = useState(task.dueDate ?? '');
  const [assignedResourceId, setAssignedResourceId] = useState<number | null>(
    task.assignedResourceId ?? null
  );
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Comentarios
  const [thread, setThread]           = useState<any | null>(null);
  const [comments, setComments]       = useState<any[]>([]);
  const [newComment, setNewComment]   = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    professionalService.getAll()
      .then(setProfessionals)
      .catch(() => setProfessionals([]));
  }, []);

  // Cargar thread y comentarios de la tarea
  useEffect(() => {
    loadComments();
  }, [task.taskId]);

  const loadComments = async () => {
    try {
      const threads = await threadService.getByProject(projectId);
      const taskThread = threads.find((t: any) => t.taskId === task.taskId);
      if (taskThread) {
        setThread(taskThread);
        const cms = await commentService.getByThread(taskThread.threadId);
        setComments(cms);
      }
    } catch {
      setComments([]);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSendingComment(true);
    try {
      let currentThread = thread;

      // Si no hay thread, crear uno
      if (!currentThread) {
        currentThread = await threadService.create({
          projectId,
          taskId: task.taskId,
          title: task.title,
          status: 'OPEN',
          createdByResourceId: 1,
        });
        setThread(currentThread);
      }

      await commentService.create({
        threadId: currentThread.threadId,
        content: newComment.trim(),
        authorResourceId: 1,
      });

      setNewComment('');
      loadComments();
    } finally {
      setSendingComment(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await taskService.updateTask(task.taskId, {
        title,
        description: description || undefined,
        priority: priority ?? undefined,
        status,
        dueDate: dueDate || undefined,
        assignedResourceId: assignedResourceId ?? undefined,
      });
      setIsEditing(false);
      onUpdate();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await taskService.deleteTask(task.taskId);
      onDelete();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const assignedPro = professionals.find(p => p.resourceId === assignedResourceId);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {task.taskCode && (
              <span className={styles.taskCode}>{task.taskCode}</span>
            )}
            {isEditing ? (
              <input className={styles.titleInput} value={title}
                onChange={e => setTitle(e.target.value)} autoFocus />
            ) : (
              <h2 className={styles.title}>{task.title}</h2>
            )}
          </div>
          <div className={styles.headerActions}>
            {!confirmDelete ? (
              <>
                <button className={styles.editBtn} onClick={() => setIsEditing(v => !v)}>
                  {isEditing ? 'Cancel' : '✏️ Edit'}
                </button>
                <button className={styles.deleteBtn} onClick={() => setConfirmDelete(true)}>
                  🗑
                </button>
              </>
            ) : (
              <div className={styles.confirmDelete}>
                <span>¿Eliminar tarea?</span>
                <button className={styles.confirmYes} onClick={handleDelete} disabled={deleting}>
                  {deleting ? '...' : 'Sí, eliminar'}
                </button>
                <button className={styles.confirmNo} onClick={() => setConfirmDelete(false)}>
                  Cancelar
                </button>
              </div>
            )}
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>

          {/* Campos */}
          <div className={styles.fields}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Status</span>
              {isEditing ? (
                <select className={styles.fieldSelect} value={status}
                  onChange={e => setStatus(e.target.value as TaskStatus)}>
                  {(['TODO','IN_PROGRESS','IN_REVIEW','DONE','CANCELLED'] as TaskStatus[]).map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              ) : (
                <span className={styles.fieldValue}>{status.replace(/_/g, ' ')}</span>
              )}
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>Priority</span>
              {isEditing ? (
                <select className={styles.fieldSelect} value={priority ?? ''}
                  onChange={e => setPriority(e.target.value as TaskPriority || null)}>
                  <option value="">— Sin prioridad —</option>
                  {(['LOW','MEDIUM','HIGH','CRITICAL'] as TaskPriority[]).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              ) : priority ? (
                <span className={styles.priorityBadge}
                  style={{ color: PRIORITY_COLOR[priority], background: PRIORITY_COLOR[priority] + '18' }}>
                  {priority}
                </span>
              ) : (
                <span className={styles.fieldEmpty}>Sin prioridad</span>
              )}
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>Due date</span>
              {isEditing ? (
                <input className={styles.fieldInput} type="date" value={dueDate}
                  onChange={e => setDueDate(e.target.value)} />
              ) : (
                <span className={styles.fieldValue}>{dueDate || '—'}</span>
              )}
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>Asignado a</span>
              {isEditing ? (
                <select className={styles.fieldSelect} value={assignedResourceId ?? ''}
                  onChange={e => setAssignedResourceId(e.target.value ? Number(e.target.value) : null)}>
                  <option value="">— Sin asignar —</option>
                  {professionals.filter(p => p.status === 'ACTIVE').map(p => (
                    <option key={p.resourceId} value={p.resourceId}>
                      {p.firstName} {p.lastName} — {p.roleName ?? 'Sin rol'}
                    </option>
                  ))}
                </select>
              ) : assignedPro ? (
                <div className={styles.assignedPro}>
                  <div className={styles.assignedAvatar}>
                    {assignedPro.firstName?.charAt(0)}{assignedPro.lastName?.charAt(0)}
                  </div>
                  <div>
                    <span className={styles.assignedName}>{assignedPro.firstName} {assignedPro.lastName}</span>
                    {assignedPro.roleName && (
                      <span className={styles.assignedRole}>{assignedPro.roleName}</span>
                    )}
                  </div>
                </div>
              ) : (
                <span className={styles.fieldEmpty}>Sin asignar</span>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className={styles.descSection}>
            <span className={styles.fieldLabel}>Description</span>
            {isEditing ? (
              <textarea className={styles.descTextarea}
                placeholder="Agrega una descripción..."
                value={description} onChange={e => setDescription(e.target.value)} />
            ) : description ? (
              <p className={styles.descText}>{description}</p>
            ) : (
              <p className={styles.fieldEmpty}>Sin descripción.</p>
            )}
          </div>

          {/* ── Comentarios ── */}
          <div className={styles.commentsSection}>
            <span className={styles.fieldLabel}>💬 Comentarios ({comments.length})</span>

            <div className={styles.commentsList}>
              {comments.length === 0 ? (
                <p className={styles.fieldEmpty}>No hay comentarios aún.</p>
              ) : (
                comments.map((c: any) => (
                  <div key={c.commentId} className={styles.commentCard}>
                    <div className={styles.commentAvatar}>
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div className={styles.commentBody}>
                      <span className={styles.commentAuthor}>
                        {user?.firstName} {user?.lastName}
                      </span>
                      <p className={styles.commentContent}>{c.content}</p>
                      {c.createdAt && (
                        <span className={styles.commentDate}>
                          {new Date(c.createdAt).toLocaleString('es-CL')}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className={styles.commentForm} onSubmit={handleSendComment}>
              <div className={styles.commentAvatar}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <input
                className={styles.commentInput}
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendComment(e as any);
                  }
                }}
              />
              <button className={styles.commentSend} type="submit" disabled={sendingComment || !newComment.trim()}>
                ↵
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        {isEditing && (
          <div className={styles.footer}>
            <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
            <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}