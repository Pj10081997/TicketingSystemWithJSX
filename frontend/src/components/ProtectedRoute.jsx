import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Handle single role or multiple allowed roles
  const roleAllowed = Array.isArray(allowedRole)
    ? allowedRole.includes(user.role)
    : user.role === allowedRole;

  if (!roleAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
