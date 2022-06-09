import React from "react";
import { Navigate } from "react-router-dom";


function ProtectedRoute({ component: Component, role }) {
  return (
    role ?
          <Component role={role} />
        : <Navigate to="/login" />

  );
}

export default ProtectedRoute;
