import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminOnlyProps {
  children: ReactNode;
}

export function AdminOnly({ children }: AdminOnlyProps): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (token && userType === 'admin') {
      setIsAdmin(true);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
