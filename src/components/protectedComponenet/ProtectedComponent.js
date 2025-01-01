import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedComponent = ({ user, children }) => {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return children;
};

export default ProtectedComponent;
