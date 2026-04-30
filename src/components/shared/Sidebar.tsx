import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import type { Client, Project } from "../../types/projects";
import { useState, useEffect } from "react";
import { clientService, projectService } from "../../api/projectService";

export function Sidebar() {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;



  // trae todos los proyectos en una lista
  const [Projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectService.getAll()
    .then(setProjects)
    .catch(() => setProjects([]));
  }, []); //el efecto se activa una vez

  // trae todos los clientes en una lista
  const [Clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    clientService.getAll()
    .then(setClients)
    .catch(() => setClients([]));
  }, []);

  return (
    <aside className={styles.sidebar}>

      {/* General */}
      <span className={styles.sectionLabel}>General</span>

      <NavLink to="/dashboard" className={getLinkClass}>
        <span className={styles.navIcon}>📊</span>
        Dashboard
      </NavLink>

      {/* Proyectos */}
      <span className={styles.sectionLabel}>Proyectos</span>
      
      
      {Projects.map((project)=> (
        <NavLink
        key={project.projectId} 
        to={`/projects/${project.projectId}`} 
        className={getLinkClass}
        >
        
        <span className={styles.navIcon}>📋</span>
        {project.name}
      </NavLink>
      ))}
      
      {/* Clientes */}
      <span className={styles.sectionLabel}>Clientes</span>

      {Clients.map((client) => (
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