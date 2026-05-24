import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { api } from '../api/api';
import { getToken, setUser, clearAuth } from '../store/auth';

interface AuthMe {
  id: number;
  email: string;
  displayName: string;
  role: string;
}

export default function ProtectedRoute() {
  const token = getToken();
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      setValid(false);
      return;
    }
    api
      .get<AuthMe>('/api/v1/auth/me')
      .then((user) => {
        setUser(user);
        setValid(true);
      })
      .catch(() => {
        clearAuth();
        setValid(false);
      })
      .finally(() => setChecking(false));
  }, [token]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!valid) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
