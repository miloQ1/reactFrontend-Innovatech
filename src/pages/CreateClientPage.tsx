import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../api/projectService';
import type { CreateClientRequest, ClientStatus } from '../types/projects';
import styles from './CreateClientPage.module.css';

export function CreateClientPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [status, setStatus] = useState<ClientStatus>('ACTIVE');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data: CreateClientRequest = {
        name,
        industry: industry || undefined,
        contactName: contactName || undefined,
        contactEmail: contactEmail || undefined,
        status,
      };
      const client = await clientService.create(data);
      navigate(`/clients/${client.clientId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>New Client</h1>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-name">Name *</label>
          <input
            id="client-name"
            className={styles.input}
            type="text"
            placeholder="e.g. Acme Corp"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-industry">Industry</label>
          <input
            id="client-industry"
            className={styles.input}
            type="text"
            placeholder="e.g. Fintech, Retail..."
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-contact-name">Contact Name</label>
          <input
            id="client-contact-name"
            className={styles.input}
            type="text"
            placeholder="e.g. Jane Doe"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-contact-email">Contact Email</label>
          <input
            id="client-contact-email"
            className={styles.input}
            type="email"
            placeholder="jane@acme.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-status">Status</label>
          <select
            id="client-status"
            className={styles.input}
            value={status}
            onChange={(e) => setStatus(e.target.value as ClientStatus)}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <button className={styles.submitBtn} type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Client'}
        </button>
      </form>
    </div>
  );
}