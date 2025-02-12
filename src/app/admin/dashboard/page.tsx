"use client"; // Ensure this is at the top of the file

// src/app/admin/dashboard/page.tsx
import withAdminPermission from "../../../components/admin/withAdminPermission";
import AdminDashboard from "../../../components/admin/AdminDashboard";
import AdminLayout from "../AdminLayout"; // Import the Admin Layout

const DashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <AdminDashboard /> {/* Only the admin dashboard will be rendered */}
    </AdminLayout>
  );
};

export default withAdminPermission(DashboardPage);
