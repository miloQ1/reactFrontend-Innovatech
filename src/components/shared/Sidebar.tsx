import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import type { Client, Project } from "../../types/projects";
import { useState, useEffect } from "react";
import { clientService, projectService } from "../../api/projectService";

export function Sidebar() {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

  const [Projects, setProjects] = useState<Project[]>([]);
  const [Clients, setClients]   = useState<Client[]>([]);

  useEffect(() => {
    projectService.getAll()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    clientService.getAll()
      .then(setClients)
      .catch(() => setClients([]));
  }, []);

  // Solo clientes activos
  const activeClients = Clients.filter(c => c.status === 'ACTIVE');

  return (
    <aside className={styles.sidebar}>

      {/* General */}
      <span className={styles.sectionLabel}>General</span>

      <NavLink to="/dashboard" className={getLinkClass}>
        <span className={styles.navIcon}>📊</span>
        Dashboard
      </NavLink>

      <NavLink to="/resources" className={getLinkClass}>
        <span className={styles.navIcon}>👥</span>
        Recursos
      </NavLink>

      {/* Proyectos */}
      <NavLink to="/projects" className={styles.sectionLabelLink}>
  Proyectos
</NavLink>

{Projects.map(project => (
  <NavLink
    key={project.projectId}
    to={`/projects/${project.projectId}`}
    className={getLinkClass}
  >
    <span className={styles.navIcon}>📋</span>
    {project.name}
  </NavLink>
))}

      {/* Clientes — solo activos, label clickeable */}
      <NavLink to="/clients" className={styles.sectionLabelLink}>
        Clientes
      </NavLink>

      {activeClients.map(client => (
        <NavLink
          key={client.clientId}
          to={`/clients/${client.clientId}`}
          className={getLinkClass}
        >
          <span className={styles.navIcon}>🏢</span>
          {client.name}
        </NavLink>
      ))}

    </aside>
  );
}