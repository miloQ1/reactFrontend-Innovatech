import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { invitationService } from '../api/invitationService';
import { InvitationList } from '../components/invitations/InvitationList';
import { EmptyState } from '../components/shared/EmptyState';
import type { Invitation } from '../types/invitation';
import styles from './InvitationsPage.module.css';

export function InvitationsPage() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInvitations = useCallback(async () => {
    if (!user) return;
    try {
      const data = await invitationService.getMyInvitations(user.userName);
      setInvitations(data);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const handleAccept = async (id: string) => {
    await invitationService.acceptInvitation(id);
    loadInvitations();
  };

  const handleReject = async (id: string) => {
    await invitationService.rejectInvitation(id);
    loadInvitations();
  };

  if (isLoading) {
    return <p>Loading invitations...</p>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Invitations</h1>
      <p className={styles.subtitle}>
        Review and respond to project invitations from other users.
      </p>

      {invitations.length === 0 ? (
        <EmptyState
          icon="✉️"
          title="No pending invitations"
          description="You don't have any pending project invitations at the moment."
        />
      ) : (
        <InvitationList
          invitations={invitations}
          showActions
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
