import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '@frontend/components/ui/button';
import { Input } from '@frontend/components/ui/input';
import { useAdmin } from '@frontend/hooks/useAdmin';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, checkingAuth, isLoggingIn, login } = useAdmin();
  const navigate = useNavigate();

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Неверный пароль');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass-panel p-8 w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Lock className="w-8 h-8 text-primary mx-auto" />
          <h1 className="font-heading font-bold text-xl text-text-primary">Admin</h1>
          <p className="text-sm text-text-secondary">Войдите для управления сайтом</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="text-xs text-live">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoggingIn || !password}>
            {isLoggingIn ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
}
