import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService, clientService } from '../api/projectService';
import type { Project, Client } from '../types/projects';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients]   = useState<Client[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      projectService.getAll(),
      clientService.getAll(),
    ]).then(([projs, clts]) => {
      setProjects(projs);
      setClients(clts);
    }).finally(() => setLoading(false));
  }, []);

  const inProgress = projects.filter(p => p.status === 'IN_PROGRESS').length;
  const completed  = projects.filter(p => p.status === 'COMPLETED').length;

  const noClients  = !loading && clients.length === 0;
  const noProjects = !loading && clients.length > 0 && projects.length === 0;
  const hasData    = !loading && projects.length > 0;

  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>
        Hola, {user?.firstName} 👋
      </h1>
      <p className={styles.subtitle}>
        {hasData
          ? 'Aquí tienes un resumen de tu actividad en Innovatech.'
          : 'Comencemos a configurar tu espacio de trabajo.'}
      </p>

      {/* ── Estado vacío: sin clientes ── */}
      {noClients && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏢</div>
          <h2 className={styles.emptyTitle}>Primero, crea un cliente</h2>
          <p className={styles.emptyDesc}>
            Los proyectos pertenecen a clientes. Crea tu primer cliente para poder
            crear proyectos y empezar a trabajar.
          </p>
          <div className={styles.emptySteps}>
            <div className={styles.emptyStep}>
              <span className={styles.emptyStepNum}>1</span>
              <span>Crear un cliente</span>
            </div>
            <div className={styles.emptyStepArrow}>→</div>
            <div className={styles.emptyStep}>
              <span className={styles.emptyStepNum}>2</span>
              <span>Crear un proyecto</span>
            </div>
            <div className={styles.emptyStepArrow}>→</div>
            <div className={styles.emptyStep}>
              <span className={styles.emptyStepNum}>3</span>
              <span>Agregar fases y tareas</span>
            </div>
          </div>
          <button
            className={styles.emptyBtn}
            onClick={() => navigate('/clients/create')}
          >
            ＋ Crear primer cliente
          </button>
        </div>
      )}

      {/* ── Estado vacío: tiene clientes pero sin proyectos ── */}
      {noProjects && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h2 className={styles.emptyTitle}>Ahora crea tu primer proyecto</h2>
          <p className={styles.emptyDesc}>
            Ya tienes {clients.length} cliente{clients.length > 1 ? 's' : ''} registrado{clients.length > 1 ? 's' : ''}.
            El siguiente paso es crear un proyecto y comenzar a organizar tu trabajo.
          </p>
          <div className={styles.emptyActions}>
            <button
              className={styles.emptyBtn}
              onClick={() => navigate('/projects/create')}
            >
              ＋ Crear primer proyecto
            </button>
            <button
              className={styles.emptyBtnSecondary}
              onClick={() => navigate('/clients')}
            >
              Ver clientes
            </button>
          </div>
        </div>
      )}

      {/* ── Stats (solo si hay proyectos) ── */}
      {hasData && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📁</div>
              <div className={styles.statValue}>{projects.length}</div>
              <div className={styles.statLabel}>Total Proyectos</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚙️</div>
              <div className={styles.statValue}>{inProgress}</div>
              <div className={styles.statLabel}>En Progreso</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statValue}>{completed}</div>
              <div className={styles.statLabel}>Completados</div>
            </div>
          </div>

          <h2 className={styles.sectionTitle}>⚡ Acciones rápidas</h2>
          <div className={styles.quickActions}>
            <button className={styles.actionBtn} onClick={() => navigate('/projects')}>
              📁 Ver proyectos
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/projects/create')}>
              ➕ Nuevo proyecto
            </button>
          </div>
        </>
      )}
    </div>
  );
}