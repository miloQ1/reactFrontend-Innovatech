import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService, clientService } from '../api/projectService';
import { ProjectList } from '../components/projects/ProjectList';
import { EmptyState } from '../components/shared/EmptyState';
import type {
  Project, Client, CreateProjectRequest,
  CreateClientRequest, ProjectStatus, ClientStatus
} from '../types/project';
import styles from './MyProjectsPage.module.css';

const STATUS_OPTIONS: ProjectStatus[] = [
  'PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'
];

export function MyProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects]   = useState<Project[]>([]);
  const [clients, setClients]     = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Formulario proyecto
  const [showForm, setShowForm]         = useState(false);
  const [withClient, setWithClient]     = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [projCode, setProjCode]         = useState('');
  const [projName, setProjName]         = useState('');
  const [projDesc, setProjDesc]         = useState('');
  const [projStatus, setProjStatus]     = useState<ProjectStatus>('PLANNING');
  const [projStart, setProjStart]       = useState('');
  const [projEnd, setProjEnd]           = useState('');
  const [projLoading, setProjLoading]   = useState(false);
  const [projError, setProjError]       = useState<string | null>(null);

  // Modal cliente
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientName, setClientName]           = useState('');
  const [clientIndustry, setClientIndustry]   = useState('');
  const [clientContact, setClientContact]     = useState('');
  const [clientEmail, setClientEmail]         = useState('');
  const [clientStatus, setClientStatus]       = useState<ClientStatus>('ACTIVE');
  const [clientLoading, setClientLoading]     = useState(false);
  const [clientError, setClientError]         = useState<string | null>(null);

  const loadData = () => {
    Promise.all([
      projectService.getAll(),
      clientService.getAll(),
    ]).then(([projs, clts]) => {
      setProjects(projs);
      setClients(clts);
    }).finally(() => setIsLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const resetProjectForm = () => {
    setProjCode(''); setProjName(''); setProjDesc('');
    setProjStatus('PLANNING'); setProjStart(''); setProjEnd('');
    setSelectedClientId(null); setWithClient(false);
    setProjError(null); setShowForm(false);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withClient && !selectedClientId) {
      setProjError('Selecciona un cliente o crea uno nuevo.');
      return;
    }
    setProjLoading(true);
    setProjError(null);
    try {
      const data: CreateProjectRequest = {
        code: projCode,
        name: projName,
        description: projDesc || undefined,
        status: projStatus,
        startDate: projStart || undefined,
        endDate: projEnd || undefined,
      };
      const clientId = withClient && selectedClientId ? selectedClientId : 1; // sin cliente usa default
      const project = await projectService.create(clientId, data);
      resetProjectForm();
      navigate(`/projects/${project.projectId}`);
    } catch (err) {
      setProjError(err instanceof Error ? err.message : 'Error al crear el proyecto');
    } finally {
      setProjLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientLoading(true);
    setClientError(null);
    try {
      const data: CreateClientRequest = {
        name: clientName,
        industry: clientIndustry || undefined,
        contactName: clientContact || undefined,
        contactEmail: clientEmail || undefined,
        status: clientStatus,
      };
      const newClient = await clientService.create(data);
      setClients(prev => [...prev, newClient]);
      setSelectedClientId(newClient.clientId);
      setShowClientModal(false);
      // reset modal
      setClientName(''); setClientIndustry('');
      setClientContact(''); setClientEmail('');
      setClientStatus('ACTIVE');
    } catch (err) {
      setClientError(err instanceof Error ? err.message : 'Error al crear cliente');
    } finally {
      setClientLoading(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Projects</h1>
          {showForm && (
            <p className={styles.subtitle}>Fill in the details to create a new project.</p>
          )}
        </div>
        <button
          className={styles.createBtn}
          onClick={() => { setShowForm(v => !v); }}
        >
          {showForm ? '✕ Cancel' : '➕ New Project'}
        </button>
      </div>

      {/* Formulario de proyecto */}
      {showForm && (
        <form className={styles.projectForm} onSubmit={handleCreateProject}>

          {projError && <p className={styles.errorMsg}>{projError}</p>}

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Code *</label>
              <input className={styles.input} placeholder="e.g. PROJ-001"
                value={projCode} onChange={e => setProjCode(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Name *</label>
              <input className={styles.input} placeholder="Project name"
                value={projName} onChange={e => setProjName(e.target.value)} required />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea className={styles.textarea} placeholder="Describe the project..."
              value={projDesc} onChange={e => setProjDesc(e.target.value)} />
          </div>

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select className={styles.input} value={projStatus}
                onChange={e => setProjStatus(e.target.value as ProjectStatus)}>
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Start Date</label>
              <input className={styles.input} type="date"
                value={projStart} onChange={e => setProjStart(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>End Date</label>
              <input className={styles.input} type="date"
                value={projEnd} onChange={e => setProjEnd(e.target.value)} />
            </div>
          </div>

          {/* Toggle cliente */}
          <div className={styles.clientToggle}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={withClient}
                onChange={e => {
                  setWithClient(e.target.checked);
                  if (!e.target.checked) setSelectedClientId(null);
                }}
              />
              Associate with a client
            </label>
          </div>

          {/* Selector de cliente */}
          {withClient && (
            <div className={styles.clientSelector}>
              <div className={styles.field}>
                <label className={styles.label}>Client</label>
                <div className={styles.clientRow}>
                  <select
                    className={styles.input}
                    value={selectedClientId ?? ''}
                    onChange={e => setSelectedClientId(Number(e.target.value))}
                  >
                    <option value="">Select a client...</option>
                    {clients.map(c => (
                      <option key={c.clientId} value={c.clientId}>{c.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={styles.newClientBtn}
                    onClick={() => setShowClientModal(true)}
                  >
                    ➕ New Client
                  </button>
                </div>
                {selectedClientId && (
                  <p className={styles.clientSelected}>
                    ✅ {clients.find(c => c.clientId === selectedClientId)?.name} selected
                  </p>
                )}
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={resetProjectForm}>
              Cancel
            </button>
            <button type="submit" className={styles.createBtn} disabled={projLoading}>
              {projLoading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de proyectos */}
      {!showForm && (
        projects.length === 0 ? (
          <EmptyState
            icon="📁"
            title="No projects yet"
            description="Create your first project to get started."
            actionLabel="➕ Create Project"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <ProjectList projects={projects} />
        )
      )}

      {/* Modal crear cliente */}
      {showClientModal && (
        <div className={styles.modalOverlay} onClick={() => setShowClientModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>New Client</h2>
              <button className={styles.modalClose} onClick={() => setShowClientModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateClient}>
              {clientError && <p className={styles.errorMsg}>{clientError}</p>}

              <div className={styles.field}>
                <label className={styles.label}>Name *</label>
                <input className={styles.input} placeholder="e.g. Acme Corp"
                  value={clientName} onChange={e => setClientName(e.target.value)} required />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Industry</label>
                <input className={styles.input} placeholder="e.g. Fintech, Retail..."
                  value={clientIndustry} onChange={e => setClientIndustry(e.target.value)} />
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Contact Name</label>
                  <input className={styles.input} placeholder="Jane Doe"
                    value={clientContact} onChange={e => setClientContact(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Contact Email</label>
                  <input className={styles.input} type="email" placeholder="jane@acme.com"
                    value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select className={styles.input} value={clientStatus}
                  onChange={e => setClientStatus(e.target.value as ClientStatus)}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn}
                  onClick={() => setShowClientModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.createBtn} disabled={clientLoading}>
                  {clientLoading ? 'Creating...' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}