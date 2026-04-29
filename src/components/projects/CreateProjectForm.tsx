import { useState, type FormEvent } from 'react';
import type { CreateProjectRequest, ProjectStatus } from '../../types/projects';
import styles from './CreateProjectForm.module.css';

interface CreateProjectFormProps {
  onSubmit: (data: CreateProjectRequest) => Promise<void>;
  isLoading: boolean;
  errorMessage?: string | null;
}

const STATUS_OPTIONS: ProjectStatus[] = [
  'PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'
];

export function CreateProjectForm({ onSubmit, isLoading, errorMessage }: CreateProjectFormProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('PLANNING');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({
      code,
      name,
      description,
      status,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="project-code">
          Code
        </label>
        <input
          id="project-code"
          className={styles.input}
          type="text"
          placeholder="e.g. PROJ-001"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="project-name">
          Project Name
        </label>
        <input
          id="project-name"
          className={styles.input}
          type="text"
          placeholder="e.g. Website Redesign"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="project-description">
          Description
        </label>
        <textarea
          id="project-description"
          className={styles.textarea}
          placeholder="Describe the purpose and goals..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="project-status">
          Status
        </label>
        <select
          id="project-status"
          className={styles.input}
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="project-start">
          Start Date
        </label>
        <input
          id="project-start"
          className={styles.input}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="project-end">
          End Date
        </label>
        <input
          id="project-end"
          className={styles.input}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <button className={styles.submitBtn} type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}