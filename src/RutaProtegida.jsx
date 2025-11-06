import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? children : <Navigate to="/" replace />;
};

export default RutaProtegida;
