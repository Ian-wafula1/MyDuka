import React from 'react';
import StoreCard from './StoreCard';
import ReportCard from './ReportCard';
import './dashboard.css';
function AdminDashboard() {
  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <StoreCard />
      <ReportCard />
    </div>
  );
}

export default AdminDashboard;