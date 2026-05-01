import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService, clientService } from '../api/projectService';
import type { CreateProjectRequest, ProjectStatus, Client } from '../types/projects';
import styles from './CreateProjectPage.module.css';

const STATUS_OPTIONS: ProjectStatus[] = [
  'PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'
];

const generateCode = (tag: string, count: number) => {
  const base = tag.trim().toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '');
  const num = String(count + 1).padStart(3, '0');
  return base ? `${base}-${num}` : '';
};

export function CreateProjectPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const [client, setClient]             = useState<Client | null>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const [name, setName]             = useState('');
  const [tag, setTag]               = useState('');
  const [code, setCode]             = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus]         = useState<ProjectStatus>('PLANNING');
  const [startDate, setStartDate]   = useState('');
  const [endDate, setEndDate]       = useState('');

  useEffect(() => {
    if (!clientId) return;
    clientService.getById(Number(clientId)).then(setClient);
    projectService.getByClient(Number(clientId))
      .then(p => setProjectCount(p.length))
      .catch(() => setProjectCount(0));
  }, [clientId]);

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTag(value);
    setCode(generateCode(value, projectCount));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data: CreateProjectRequest = {
        code,
        name,
        description: description || undefined,
        status,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      const project = await projectService.create(Number(clientId), data);
      navigate(`/projects/${project.projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Link to={`/clients/${clientId}`} className={styles.backLink}>
        ← Back to {client?.name ?? 'client'}
      </Link>

      <h1 className={styles.title}>New Project</h1>
      {client && (
        <p className={styles.subtitle}>
          For client: <strong>{client.name}</strong>
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>

        <div className={styles.field}>
          <label className={styles.label}>Name *</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Project name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Tag *</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. BITA"
              value={tag}
              onChange={handleTagChange}
              maxLength={8}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Code</label>
            <input
              className={`${styles.input} ${styles.inputReadonly}`}
              type="text"
              value={code}
              readOnly
              placeholder="Se genera automáticamente"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            placeholder="Describe the project..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select
            className={styles.input}
            value={status}
            onChange={e => setStatus(e.target.value as ProjectStatus)}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Start Date</label>
            <input
              className={styles.input}
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>End Date</label>
            <input
              className={styles.input}
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button className={styles.submitBtn} type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}