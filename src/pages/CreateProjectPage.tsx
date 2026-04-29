import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService, clientService } from '../api/projectService';
import { CreateProjectForm } from '../components/projects/CreateProjectForm';
import type { CreateProjectRequest } from '../types/projects';
import type { Client } from '../types/projects';
import styles from './CreateProjectPage.module.css';

export function CreateProjectPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar clientes al montar
  useEffect(() => {
    clientService.getAll().then(setClients);
  }, []);

  const handleCreate = async (data: CreateProjectRequest) => {
    if (!selectedClientId) {
      setError('Debes seleccionar un cliente');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const project = await projectService.create(selectedClientId, data);
      navigate(`/projects/${project.projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create New Project</h1>

      {/* Selector de cliente */}
      <div className={styles.field}>
        <label className={styles.label}>Client</label>
        <select
          className={styles.select}
          value={selectedClientId ?? ''}
          onChange={(e) => setSelectedClientId(Number(e.target.value))}
        >
          <option value="">Select a client...</option>
          {clients.map((c) => (
            <option key={c.clientId} value={c.clientId}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <CreateProjectForm
        onSubmit={handleCreate}
        isLoading={isLoading}
      />
    </div>
  );
}