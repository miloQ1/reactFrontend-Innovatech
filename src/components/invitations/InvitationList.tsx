import type { Invitation } from '../../types/invitation';
import styles from './InvitationList.module.css';

interface InvitationListProps {
  invitations: Invitation[];
  showActions?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function InvitationList({ invitations, showActions = false, onAccept, onReject }: InvitationListProps) {
  return (
    <div className={styles.list}>
      {invitations.map((invitation) => {
        const formattedDate = new Date(invitation.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        return (
          <div key={invitation.id} className={styles.item}>
            <div className={styles.icon}>📩</div>
            <div className={styles.info}>
              <div className={styles.projectName}>{invitation.projectName}</div>
              <div className={styles.meta}>
                Invited by @{invitation.invitedBy} · {formattedDate}
              </div>
            </div>

            {showActions && invitation.status === 'PENDING' ? (
              <div className={styles.actions}>
                <button
                  className={styles.acceptBtn}
                  onClick={() => onAccept?.(invitation.id)}
                >
                  Accept
                </button>
                <button
                  className={styles.rejectBtn}
                  onClick={() => onReject?.(invitation.id)}
                >
                  Reject
                </button>
              </div>
            ) : (
              <span
                className={`${styles.statusBadge} ${
                  invitation.status === 'PENDING'
                    ? styles.pending
                    : invitation.status === 'ACCEPTED'
                    ? styles.accepted
                    : styles.rejected
                }`}
              >
                {invitation.status}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
