import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import AdminDashboard from './AdminDashboard';
import MerchantDashboard from './MerchantDashboard';
import ClerkDashboard from './ClerkDashboard';
const Dashboard = () => {
  const { role } = useContext(UserContext);
  if (role === 'admin') return <AdminDashboard />;
  if (role === 'merchant') return <MerchantDashboard />;
  if (role === 'clerk') return <ClerkDashboard />;
  return <div>No role assigned</div>;
};
export default Dashboard;