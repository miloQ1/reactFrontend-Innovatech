import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { clientService, projectService } from '../api/projectService';
import type { Client, Project } from '../types/projects';
import { ConfirmModal } from '../components/shared/ConfirmModal';
import styles from './ClientDetailPage.module.css';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient]     = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit
  const [isEditing, setIsEditing]         = useState(false);
  const [editName, setEditName]           = useState('');
  const [editIndustry, setEditIndustry]   = useState('');
  const [editContact, setEditContact]     = useState('');
  const [editEmail, setEditEmail]         = useState('');
  const [editStatus, setEditStatus]       = useState('');
  const [saving, setSaving]               = useState(false);

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState<{
    title: string; message: string; onConfirm: () => void;
  } | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const [c, p] = await Promise.all([
        clientService.getById(Number(id)),
        projectService.getByClient(Number(id)),
      ]);
      setClient(c);
      setProjects(p);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const startEdit = () => {
    if (!client) return;
    setEditName(client.name);
    setEditIndustry(client.industry ?? '');
    setEditContact(client.contactName ?? '');
    setEditEmail(client.contactEmail ?? '');
    setEditStatus(client.status);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await clientService.update(Number(id), {
        name: editName,
        industry: editIndustry || undefined,
        contactName: editContact || undefined,
        contactEmail: editEmail || undefined,
        status: editStatus as any,
      });
      setIsEditing(false);
      loadData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setConfirmModal({
      title: `Eliminar cliente "${client?.name}"`,
      message: 'Esta acción eliminará el cliente permanentemente. Los proyectos asociados también se eliminarán.',
      onConfirm: async () => {
        setConfirmModal(null);
        await clientService.delete(Number(id)).catch(() => {});
        navigate('/clients');
      },
    });
  };

  if (isLoading) return <p>Loading...</p>;

  if (!client) {
    return (
      <div className={styles.notFound}>
        <p>Client not found.</p>
        <Link to="/clients">← Back to clients</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/clients" className={styles.backLink}>← Back to clients</Link>

      {/* Header */}
      {isEditing ? (
        <form className={styles.editForm} onSubmit={handleSave}>
          <div className={styles.editRow}>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Nombre *</label>
              <input className={styles.editInput} value={editName}
                onChange={e => setEditName(e.target.value)} required />
            </div>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Industria</label>
              <input className={styles.editInput} value={editIndustry}
                onChange={e => setEditIndustry(e.target.value)} placeholder="Fintech, Retail..." />
            </div>
          </div>
          <div className={styles.editRow}>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Contacto</label>
              <input className={styles.editInput} value={editContact}
                onChange={e => setEditContact(e.target.value)} />
            </div>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Email</label>
              <input className={styles.editInput} type="email" value={editEmail}
                onChange={e => setEditEmail(e.target.value)} />
            </div>
          </div>
          <div className={styles.editField}>
            <label className={styles.editLabel}>Estado</label>
            <select className={styles.editInput} value={editStatus}
              onChange={e => setEditStatus(e.target.value)}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className={styles.editActions}>
            <button type="button" className={styles.cancelBtn}
              onClick={() => setIsEditing(false)}>Cancelar</button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.header}>
          <div>
            <h1 className={styles.name}>{client.name}</h1>
            {client.industry && <p className={styles.industry}>🏭 {client.industry}</p>}
          </div>
          <div className={styles.headerActions}>
            <span className={`${styles.badge} ${client.status === 'ACTIVE' ? styles.active : styles.inactive}`}>
              {client.status}
            </span>
            <button className={styles.editBtn} onClick={startEdit}>✏️ Editar</button>
            <button className={styles.deleteBtn} onClick={handleDelete}>🗑 Eliminar</button>
          </div>
        </div>
      )}

      {/* Contacto */}
      {!isEditing && (client.contactName || client.contactEmail) && (
        <div className={styles.contactBox}>
          {client.contactName && <p>👤 {client.contactName}</p>}
          {client.contactEmail && <p>✉️ {client.contactEmail}</p>}
        </div>
      )}

      {/* Proyectos */}
      {!isEditing && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>📁 Projects ({projects.length})</h2>
            <button className={styles.createBtn}
              onClick={() => navigate(`/clients/${id}/projects/create`)}>
              ➕ New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <p className={styles.empty}>No projects yet for this client.</p>
          ) : (
            <div className={styles.projectGrid}>
              {projects.map(project => (
                <div key={project.projectId} className={styles.projectCard}
                  onClick={() => navigate(`/projects/${project.projectId}`)}>
                  <div className={styles.projectHeader}>
                    <span className={styles.projectName}>{project.name}</span>
                    <span className={styles.projectStatus}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className={styles.projectCode}>#{project.code}</span>
                  {project.description && (
                    <p className={styles.projectDesc}>{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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