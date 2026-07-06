import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export const getDashboardPath = (role) => {
  switch (role) {
    case "DOCTOR":
      return "/doctor/dashboard";

    case "PATIENT":
      return "/patient/dashboard";

    case "ADMIN":
      return "/admin/dashboard";

    default:
      return "/login";
  }
};

export const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const { loading, isAuthenticated, role} = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <Navigate
        to={getDashboardPath(role)}
        replace
      />
    );
  }

  return children;
};
