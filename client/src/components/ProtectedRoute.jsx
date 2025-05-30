import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
