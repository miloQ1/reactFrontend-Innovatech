import { useState, type FormEvent } from 'react';
import type { CreateProjectRequest } from '../../types/project';
import styles from './CreateProjectForm.module.css';

interface CreateProjectFormProps {
  onSubmit: (data: CreateProjectRequest) => Promise<void>;
  isLoading: boolean;
  successMessage?: string | null;
  errorMessage?: string | null;
}

export function CreateProjectForm({ onSubmit, isLoading, successMessage, errorMessage }: CreateProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, description });
    setName('');
    setDescription('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {successMessage && <div className={styles.success}>{successMessage}</div>}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="project-name">
          Project Name
        </label>
        <input
          id="project-name"
          className={styles.input}
          type="text"
          placeholder="e.g. Final Year Thesis"
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
          placeholder="Describe the purpose and goals of your project..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <button className={styles.submitBtn} type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
