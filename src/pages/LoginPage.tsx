import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthFormContainer } from '../components/auth/AuthFormContainer';
import { LoginForm } from '../components/auth/LoginForm';
import type { LoginRequest } from '../types/auth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginRequest) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormContainer
      title="Welcome back"
      subtitle="Sign in to your EduTech account"
      error={error}
      footer={
        <>
          Don't have an account? <Link to="/register">Create one</Link>
        </>
      }
    >
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </AuthFormContainer>
  );
}
