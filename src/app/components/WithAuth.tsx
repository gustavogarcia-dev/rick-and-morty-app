'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent: React.ComponentType) => {

  const Wrapper = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      // Verifica si el token existe en el localStorage
      const token = localStorage.getItem('token');

      if (!null) {
        // Si no hay token, redirige a la página de login
        router.push('/auth/login');
      }
    }, [router]);

    // Si el token existe, renderiza el componente envuelto
    return localStorage.getItem('token') ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withAuth;