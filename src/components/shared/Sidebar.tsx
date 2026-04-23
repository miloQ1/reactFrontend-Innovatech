import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface SidebarProps {
  pendingInvitationsCount?: number;
}

export function Sidebar({ pendingInvitationsCount = 0 }: SidebarProps) {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

  return (
    <aside className={styles.sidebar}>
      <span className={styles.sectionLabel}>General</span>

      <NavLink to="/dashboard" className={getLinkClass}>
        <span className={styles.navIcon}>📊</span>
        Dashboard
      </NavLink>

      <span className={styles.sectionLabel}>Projects</span>

      <NavLink to="/projects" className={getLinkClass}>
        <span className={styles.navIcon}>📁</span>
        My Projects
      </NavLink>

      <NavLink to="/projects/create" className={getLinkClass}>
        <span className={styles.navIcon}>➕</span>
        Create Project
      </NavLink>

      <span className={styles.sectionLabel}>Collaboration</span>

      <NavLink to="/invitations" className={getLinkClass}>
        <span className={styles.navIcon}>✉️</span>
        Invitations
        {pendingInvitationsCount > 0 && (
          <span className={styles.badge}>{pendingInvitationsCount}</span>
        )}
      </NavLink>
    </aside>
  );
}
