import { useState, type FormEvent } from 'react';
import type { RegisterRequest } from '../../types/auth';
import styles from './AuthForms.module.css';

interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => Promise<void>;
  isLoading: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ userName, firstName, lastName, email, password });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="register-username">
          Username
        </label>
        <input
          id="register-username"
          className={styles.input}
          type="text"
          placeholder="johndoe"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-firstname">
            First Name
          </label>
          <input
            id="register-firstname"
            className={styles.input}
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-lastname">
            Last Name
          </label>
          <input
            id="register-lastname"
            className={styles.input}
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="register-email">
          Email
        </label>
        <input
          id="register-email"
          className={styles.input}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="register-password">
          Password
        </label>
        <input
          id="register-password"
          className={styles.input}
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      <button className={styles.submitBtn} type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
