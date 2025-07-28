import React from 'react';
import StoreCard from './StoreCard';
import ReportCard from './ReportCard';
import './dashboard.css';
function MerchantDashboard() {
  return (
    <div className="dashboard">
      <h1>Merchant Dashboard</h1>
      <StoreCard />
      <ReportCard />
    </div>
  );
}

export default MerchantDashboard;