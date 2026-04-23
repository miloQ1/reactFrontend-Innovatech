import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthFormContainer } from '../components/auth/AuthFormContainer';
import { RegisterForm } from '../components/auth/RegisterForm';
import type { RegisterRequest } from '../types/auth';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: RegisterRequest) => {
    setError(null);
    setIsLoading(true);
    try {
      await register(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormContainer
      title="Create account"
      subtitle="Join EduTech and start collaborating"
      error={error}
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
    </AuthFormContainer>
  );
}
