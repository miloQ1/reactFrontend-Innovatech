import { useState, type FormEvent } from 'react';
import type { LoginRequest } from '../../types/auth';
import styles from './AuthForms.module.css';

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ identifier, password });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-identifier">
          Email o nombre de usuario
        </label>
        <input
          id="login-identifier"
          className={styles.input}
          type="text"
          placeholder="you@example.com o johndoe"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          autoComplete="username"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-password">
          Contraseña
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
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}