import { useState, type FormEvent } from 'react';
import styles from './InviteUserForm.module.css';

interface InviteUserFormProps {
  onSubmit: (userName: string) => Promise<void>;
  isLoading: boolean;
  successMessage?: string | null;
  errorMessage?: string | null;
}

export function InviteUserForm({ onSubmit, isLoading, successMessage, errorMessage }: InviteUserFormProps) {
  const [userName, setUserName] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(userName);
    setUserName('');
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="invite-username">
            Invite by Username
          </label>
          <input
            id="invite-username"
            className={styles.input}
            type="text"
            placeholder="e.g. johndoe"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <button className={styles.inviteBtn} type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Invite'}
        </button>
      </form>

      {successMessage && (
        <div className={`${styles.message} ${styles.success}`}>{successMessage}</div>
      )}
      {errorMessage && (
        <div className={`${styles.message} ${styles.error}`}>{errorMessage}</div>
      )}
    </div>
  );
}
