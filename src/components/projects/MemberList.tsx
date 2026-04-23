import type { ProjectMember } from '../../types/project';
import styles from './MemberList.module.css';

interface MemberListProps {
  members: ProjectMember[];
}

export function MemberList({ members }: MemberListProps) {
  return (
    <div className={styles.list}>
      {members.map((member) => {
        const initials = member.userName.substring(0, 2).toUpperCase();
        const formattedDate = new Date(member.joinedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        return (
          <div key={member.id} className={styles.memberItem}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.info}>
              <span className={styles.userName}>@{member.userName}</span>
              <span className={styles.joinedAt}>Joined {formattedDate}</span>
            </div>
            <span
              className={`${styles.roleBadge} ${
                member.role === 'MASTER' ? styles.master : styles.member
              }`}
            >
              {member.role}
            </span>
          </div>
        );
      })}
    </div>
  );
}
