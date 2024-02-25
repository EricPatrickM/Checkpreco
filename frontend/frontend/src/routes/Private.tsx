import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateProps {
  children: ReactNode;
}

export function Private({ children }: PrivateProps): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (token && userType === 'colaborator' || userType === 'admin') {
      setIsAuth(true);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
