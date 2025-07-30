import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock Data for MerchantStore Component
const mockAdmins = [
	{
		id: 1,
		name: 'John Admin',
		email: 'john@admin.com',
		account_status: 'active',
		store_id: 1,
		created_at: '2024-01-20T00:00:00Z',
		last_login: '2024-07-24T08:15:00Z',
		phone: '+254700123456',
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
		performance: {
			requests_approved: 45,
			requests_declined: 3,
			clerks_managed: 2,
			avg_response_time: '2.5 hours',
		},
		permissions: ['manage_clerks', 'view_entries', 'approve_requests'],
		notes: 'Excellent performance, very responsive to supply requests',
	},
	{
		id: 2,
		name: 'Jane Manager',
		email: 'jane@admin.com',
		account_status: 'disabled',
		store_id: 1,
		created_at: '2024-02-10T00:00:00Z',
		last_login: '2024-07-15T14:30:00Z',
		phone: '+254700987654',
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
		performance: {
			requests_approved: 12,
			requests_declined: 8,
			clerks_managed: 1,
			avg_response_time: '4.2 hours',
		},
		permissions: ['manage_clerks', 'view_entries'],
		notes: 'Currently on probation for performance issues',
	},
	{
		id: 3,
		name: 'Michael Store',
		email: 'michael@admin.com',
		account_status: 'active',
		store_id: 1,
		created_at: '2024-03-01T00:00:00Z',
		last_login: '2024-07-24T07:45:00Z',
		phone: '+254700555777',
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
		performance: {
			requests_approved: 28,
			requests_declined: 2,
			clerks_managed: 3,
			avg_response_time: '1.8 hours',
		},
		permissions: ['manage_clerks', 'view_entries', 'approve_requests', 'view_reports'],
		notes: 'New admin, showing great potential',
	},
];

const mockStoreData = {
	id: 1,
	name: 'Downtown Store',
	location: 'Nairobi CBD',
	merchant_id: 1,
	total_products: 150,
	total_revenue: 250000,
	monthly_sales: 85000,
	pending_requests: 3,
	active_clerks: 5,
	created_at: '2024-01-15T00:00:00Z',
	status: 'active',
};

const mockSalesData = {
	weekly: [
		{ name: 'Mon', sales: 4000, revenue: 24000, orders: 45 },
		{ name: 'Tue', sales: 3000, revenue: 13980, orders: 35 },
		{ name: 'Wed', sales: 2000, revenue: 19800, orders: 28 },
		{ name: 'Thu', sales: 2780, revenue: 39080, orders: 42 },
		{ name: 'Fri', sales: 1890, revenue: 48000, orders: 55 },
		{ name: 'Sat', sales: 2390, revenue: 38000, orders: 48 },
		{ name: 'Sun', sales: 3490, revenue: 43000, orders: 52 },
	],
	monthly: [
		{ name: 'Jan', sales: 40000, revenue: 240000, orders: 450 },
		{ name: 'Feb', sales: 30000, revenue: 139800, orders: 350 },
		{ name: 'Mar', sales: 20000, revenue: 198000, orders: 280 },
		{ name: 'Apr', sales: 27800, revenue: 390800, orders: 420 },
		{ name: 'May', sales: 18900, revenue: 480000, orders: 550 },
		{ name: 'Jun', sales: 23900, revenue: 380000, orders: 480 },
		{ name: 'Jul', sales: 34900, revenue: 430000, orders: 520 },
	],
	yearly: [
		{ name: '2021', sales: 400000, revenue: 2400000, orders: 4500 },
		{ name: '2022', sales: 300000, revenue: 1398000, orders: 3500 },
		{ name: '2023', sales: 200000, revenue: 1980000, orders: 2800 },
		{ name: '2024', sales: 278000, revenue: 3908000, orders: 4200 },
	],
};

const mockProductData = [
	{ name: 'Electronics', value: 35, quantity: 450, revenue: 125000, color: '#0088FE' },
	{ name: 'Clothing', value: 25, quantity: 320, revenue: 85000, color: '#00C49F' },
	{ name: 'Food Items', value: 20, quantity: 280, revenue: 45000, color: '#FFBB28' },
	{ name: 'Books', value: 15, quantity: 150, revenue: 28000, color: '#FF8042' },
	{ name: 'Others', value: 5, quantity: 80, revenue: 12000, color: '#8884D8' },
];

const mockPaymentData = [
	{ name: 'Paid', value: 75, amount: 187500, count: 67, color: '#00C49F' },
	{ name: 'Unpaid', value: 25, amount: 62500, count: 22, color: '#FF8042' },
];

// Create Context
const MerchantStoreContext = createContext();

// Custom hook to use the context
export const useMerchantStore = () => {
	const context = useContext(MerchantStoreContext);
	if (!context) {
		throw new Error('useMerchantStore must be used within a MerchantStoreProvider');
	}
	return context;
};

// Provider Component
export const MerchantStoreProvider = ({ children }) => {
	const [store, setStore] = useState(null);
	const [admins, setAdmins] = useState([]);
	const [salesData, setSalesData] = useState([]);
	const [productData, setProductData] = useState([]);
	const [paymentData, setPaymentData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Simulate API delay
	const simulateApiDelay = (ms = 1000) => {
		return new Promise((resolve) => setTimeout(resolve, ms));
	};

	// Fetch store data
	const fetchStoreData = async (storeId) => {
		try {
			setLoading(true);
			setError('');

			// Simulate API call
			await simulateApiDelay(800);

			setStore(mockStoreData);
			setLoading(false);
		} catch (error) {
			setError('Failed to fetch store data');
			setLoading(false);
		}
	};

	// Fetch admins data
	const fetchAdmins = async (storeId) => {
		try {
			// Simulate API call
			await simulateApiDelay(1000);

			const storeAdmins = mockAdmins.filter((admin) => admin.store_id === parseInt(storeId));
			setAdmins(storeAdmins);
		} catch (error) {
			console.error('Failed to fetch admins:', error);
		}
	};

	// Fetch reports data
	const fetchReportsData = async (period = 'monthly') => {
		try {
			setLoading(true);

			// Simulate API call
			await simulateApiDelay(500);

			setSalesData(mockSalesData[period]);
			setProductData(mockProductData);
			setPaymentData(mockPaymentData);

			setLoading(false);
		} catch (error) {
			console.error('Failed to fetch reports data:', error);
			setLoading(false);
		}
	};

	// Invite admin
	const inviteAdmin = async (email) => {
		try {
			// Simulate API call
			await simulateApiDelay(1500);

			// For demo purposes, just show success
			return { success: true, message: 'Admin invitation sent successfully!' };
		} catch (error) {
			throw new Error('Failed to send invitation');
		}
	};

	// Update admin status
	const updateAdminStatus = async (adminId, newStatus) => {
		try {
			// Simulate API call
			await simulateApiDelay(500);

			setAdmins((prevAdmins) => prevAdmins.map((admin) => (admin.id === adminId ? { ...admin, account_status: newStatus } : admin)));

			return { success: true, message: `Admin ${newStatus} successfully!` };
		} catch (error) {
			throw new Error('Failed to update admin status');
		}
	};

	// Delete admin
	const deleteAdmin = async (adminId) => {
		try {
			// Simulate API call
			await simulateApiDelay(500);

			setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== adminId));

			return { success: true, message: 'Admin deleted successfully!' };
		} catch (error) {
			throw new Error('Failed to delete admin');
		}
	};

	const value = {
		// State
		store,
		admins,
		salesData,
		productData,
		paymentData,
		loading,
		error,

		// Actions
		fetchStoreData,
		fetchAdmins,
		fetchReportsData,
		inviteAdmin,
		updateAdminStatus,
		deleteAdmin,
		setError,

		// Helpers
		formatCurrency: (amount) => `KSh ${amount.toLocaleString()}`,
		formatDate: (dateString) =>
			new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			}),
	};

	return <MerchantStoreContext.Provider value={value}>{children}</MerchantStoreContext.Provider>;
};

export default MerchantStoreContext;
