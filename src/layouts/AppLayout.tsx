import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/shared/Navbar';
import { Sidebar } from '../components/shared/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { invitationService } from '../api/invitationService';
import styles from './AppLayout.module.css';

export function AppLayout() {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user) {
      invitationService
        .getMyInvitations(user.userName)
        .then((invitations) => setPendingCount(invitations.length))
        .catch(() => setPendingCount(0));
    }
  }, [user]);

  return (
    <div className={styles.layout}>
      <Navbar />
      <Sidebar pendingInvitationsCount={pendingCount} />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
