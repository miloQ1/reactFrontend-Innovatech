import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/shared/Navbar';
import { Sidebar } from '../components/shared/Sidebar';
import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <Sidebar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}