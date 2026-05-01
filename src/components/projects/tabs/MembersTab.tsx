import { useState } from 'react';
import type { ProjectMember } from '../../../types/projects';
import { memberService } from '../../../api/projectService';
import { authService } from '../../../api/authService';
import { ConfirmModal } from '../../shared/ConfirmModal';
import styles from './Tabs.module.css';

interface MembersTabProps {
  members: ProjectMember[];
  projectId: number;
  onReload: () => void;
}

export function MembersTab({ members, projectId, onReload }: MembersTabProps) {
  const [username, setUsername]       = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [success, setSuccess]         = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    title: string; message: string; onConfirm: () => void;
  } | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const user = await authService.getUserByUsername(username.trim());
      await memberService.add(projectId, { userId: user.id, userName: user.userName });
      setUsername('');
      setSuccess(`@${user.userName} agregado al proyecto`);
      onReload();
    } catch {
      setError(`Usuario "@${username}" no encontrado`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (member: ProjectMember) => {
    setConfirmModal({
      title: `Eliminar a @${member.userName}`,
      message: 'Esta persona perderá acceso al proyecto.',
      onConfirm: async () => {
        setConfirmModal(null);
        await memberService.remove(projectId, member.userId).catch(() => {});
        onReload();
      },
    });
  };

  return (
    <div className={styles.overview}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>👥 Members</h2>

        {members.length === 0 ? (
          <p className={styles.empty}>No members yet.</p>
        ) : (
          <div className={styles.memberList}>
            {members.map(m => (
              <div key={m.id} className={styles.memberCard}>
                <div className={styles.memberAvatar}>{m.userName.charAt(0).toUpperCase()}</div>
                <div className={styles.memberInfo}>
                  <span className={styles.memberName}>@{m.userName}</span>
                  <span className={styles.memberId}>{m.userId}</span>
                </div>
                <button className={styles.removeBtn} onClick={() => handleRemove(m)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.divider} />

        <h3 className={styles.subTitle}>Invitar miembro</h3>
        <form onSubmit={handleAdd}>
          {error && <p className={styles.errorMsg}>{error}</p>}
          {success && <p className={styles.successMsg}>{success}</p>}
          <div className={styles.addMemberRow}>
            <input
              className={styles.input}
              placeholder="Nombre de usuario (ej: johndoe)"
              value={username}
              onChange={e => {
                setUsername(e.target.value);
                setError(null);
                setSuccess(null);
              }}
              required
            />
            <button className={styles.saveBtn} type="submit" disabled={loading}>
              {loading ? 'Buscando...' : '+ Invitar'}
            </button>
          </div>
        </form>
      </div>

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel="Eliminar"
          danger
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}