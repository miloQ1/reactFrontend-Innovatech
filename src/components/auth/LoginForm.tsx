import { useState, type FormEvent } from 'react';
import type { LoginRequest } from '../../types/auth';
import styles from './AuthForms.module.css';

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ email, password });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
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
        <label className={styles.label} htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          className={styles.input}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <button className={styles.submitBtn} type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
