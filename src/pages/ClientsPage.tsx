import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../api/projectService';
import { EmptyState } from '../components/shared/EmptyState';
import type { Client } from '../types/projects';
import styles from './ClientsPage.module.css';

export function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    clientService.getAll()
      .then(setClients)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>Loading clients...</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Clients</h1>
        <button className={styles.createBtn} onClick={() => navigate('/clients/create')}>
          ➕ New Client
        </button>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          icon="🏢"
          title="No clients yet"
          description="Create your first client to start managing projects."
          actionLabel="Create Client"
          onAction={() => navigate('/clients/create')}
        />
      ) : (
        <div className={styles.grid}>
          {clients.map((client) => (
            <div
              key={client.clientId}
              className={styles.card}
              onClick={() => navigate(`/clients/${client.clientId}`)}
            >
              <div className={styles.cardHeader}>
                <h2 className={styles.clientName}>{client.name}</h2>
                <span className={`${styles.badge} ${client.status === 'ACTIVE' ? styles.active : styles.inactive}`}>
                  {client.status}
                </span>
              </div>
              {client.industry && (
                <p className={styles.industry}>🏭 {client.industry}</p>
              )}
              {client.contactName && (
                <p className={styles.contact}>👤 {client.contactName}</p>
              )}
              {client.contactEmail && (
                <p className={styles.contact}>✉️ {client.contactEmail}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}