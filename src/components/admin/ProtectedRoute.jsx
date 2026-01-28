import React from 'react';
// We don't even check AuthContext here anymore.
// We just let the user through.

const ProtectedRoute = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;
