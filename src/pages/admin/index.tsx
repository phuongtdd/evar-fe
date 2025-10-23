import React from 'react';
import AdminLayout from './components/layout/AdminLayout';
import DashboardCards from './components/ui/DashboardCards';

const AdminDashboard: React.FC = () => {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <DashboardCards />
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;