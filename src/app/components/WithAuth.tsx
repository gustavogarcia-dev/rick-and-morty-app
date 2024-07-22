import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
const WithAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper: React.FC = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
      // Verifica si el token existe en el localStorage
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('auth/login'); // Redirige a la página de login si no hay token
      }
    }, [router]);
    if (isAuthenticated === null) {
      return <div>Loading...</div>; // O un spinner de carga
    }
    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default WithAuth;