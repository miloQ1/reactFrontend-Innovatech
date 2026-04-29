import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '';

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <div className={styles.logo}>I</div>
        <span className={styles.brandName}>Innovatech</span>
      </div>

      <div className= {styles.navLinks}>
        <button className= {styles.navBtn} onClick={() => navigate('/projects')}> 
          Mis Proyectos
        </button>
        <button className= {styles.navBtn} onClick={() => navigate('')}> 
          Boton 2
        </button>
        <button className= {styles.navBtn} onClick={() => navigate('')}> 
          Boton 3
        </button>
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
