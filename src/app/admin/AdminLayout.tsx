// src/app/admin/AdminLayout.tsx

import React from "react";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>; // Render only the children for admin layout
};

export default AdminLayout;
