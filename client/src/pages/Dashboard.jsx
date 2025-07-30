import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
	const {
		currentUser: { account_type: role },
	} = useContext(AppContext);
	return (
		<>
			<Sidebar />
			{/* <div>{role === 'admin' ? <AdminDashboard /> : role === 'merchant' ? <MerchantDashboard /> : role === 'clerk' ? <ClerkDashboard /> : <div>No role assigned</div>}</div> */}
			<div>Dashboard</div>
		</>
	);
};
export default Dashboard;
