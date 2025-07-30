import React, { useContext } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import MerchantDashboard from '../components/MerchantDashboard';
import ClerkDashboard from '../components/ClerkDashboard';
import Sidebar from '../components/Sidebar';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
	const {
		currentUser: { account_type: role },
	} = useContext(AppContext);
	return (
		<>
			<Sidebar />
			<div>{role === 'admin' ? <AdminDashboard /> : role === 'merchant' ? <MerchantDashboard /> : role === 'clerk' ? <ClerkDashboard /> : <div>No role assigned</div>}</div>
		</>
	);
};
export default Dashboard;
