import React from 'react';
import StoreCard from './StoreCard';
import './dashboard.css';
function ClerkDashboard() {
  return (
    <div className="dashboard">
      <h1>Clerk Dashboard</h1>
      <StoreCard />
    </div>
  );
}
export default ClerkDashboard;