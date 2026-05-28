import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const hostData = localStorage.getItem('host');

  if (!hostData) {
    // Redirección a login si no hay datos de host en localStorage
    return <Navigate to="/login" replace />;
  }

  try {
    const host = JSON.parse(hostData);
    if (!host.nombre || !host.turno) {
      localStorage.removeItem('host'); // Borar datos inválidos
      return <Navigate to="/login" replace />;
    }
  } catch (e) {
    localStorage.removeItem('host'); // Borrar JSON inválido
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
