import React from 'react';
import AdminLayout from './components/AdminLayout';
import DashboardCards from './components/DashboardCards';

const AdminDashboard: React.FC = () => {
    return (
        <AdminLayout>
            <DashboardCards />
        </AdminLayout>
    );
};

export default AdminDashboard;