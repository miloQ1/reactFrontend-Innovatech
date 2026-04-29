import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import type { Project } from "../../types/projects";
import { useState, useEffect } from "react";
import { projectService } from "../../api/projectService";

export function Sidebar() {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;


  const [Projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectService.getAll()
    .then(setProjects)
    .catch(() => setProjects([]));
  }, []); //el efecto se activa una vez

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

      <NavLink to="/clients" className={getLinkClass}>
        <span className={styles.navIcon}>🏢</span>
        Clientes
      </NavLink>

      <NavLink to="/clients/create" className={getLinkClass}>
        <span className={styles.navIcon}>➕</span>
        Nuevo cliente
      </NavLink>
    </aside>
  );
}