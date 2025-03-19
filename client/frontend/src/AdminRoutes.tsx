import * as React from "react";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({
  isAuthenticated,
  children,
}) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAuthenticated || !isAdmin) {
    return React.createElement(Navigate, { to: "/login", replace: true });
  }
  return React.createElement(React.Fragment, null, children);
};

export default AdminRoute;
