import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '';

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <div className={styles.logo}>ET</div>
        <span className={styles.brandName}>EduTech</span>
      </div>

      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{initials}</div>
          <span className={styles.userName}>
            {user?.firstName} {user?.lastName}
          </span>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>
          Log out
        </button>
      </div>
    </nav>
  );
}
