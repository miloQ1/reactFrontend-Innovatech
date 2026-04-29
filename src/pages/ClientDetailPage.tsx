import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { clientService, projectService } from '../api/projectService';
import type { Client, Project } from '../types/projects';
import styles from './ClientDetailPage.module.css';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;
    const clientId = Number(id);
    try {
      const [c, p] = await Promise.all([
        clientService.getById(clientId),
        projectService.getByClient(clientId),
      ]);
      setClient(c);
      setProjects(p);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

      {/* Header del cliente */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.name}>{client.name}</h1>
          {client.industry && <p className={styles.industry}>🏭 {client.industry}</p>}
        </div>
        <span className={`${styles.badge} ${client.status === 'ACTIVE' ? styles.active : styles.inactive}`}>
          {client.status}
        </span>
      </div>

      {/* Info de contacto */}
      {(client.contactName || client.contactEmail) && (
        <div className={styles.contactBox}>
          {client.contactName && <p>👤 {client.contactName}</p>}
          {client.contactEmail && <p>✉️ {client.contactEmail}</p>}
        </div>
      )}

      {/* Proyectos del cliente */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>📁 Projects ({projects.length})</h2>
          <button
            className={styles.createBtn}
            onClick={() => navigate(`/clients/${id}/projects/create`)}
          >
            ➕ New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <p className={styles.empty}>No projects yet for this client.</p>
        ) : (
          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <div
                key={project.projectId}
                className={styles.projectCard}
                onClick={() => navigate(`/projects/${project.projectId}`)}
              >
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
    </div>
  );
}