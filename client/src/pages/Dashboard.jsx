import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MyTextInput } from '../utils/formElements';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';

const Dashboard = () => {
	const { currentUser, setCurrentUser } = useContext(AppContext);
	const [selectedPeriod, setSelectedPeriod] = useState('week');
	const [selectedStore, setSelectedStore] = useState(null);
	const [showCreateStoreModal, setShowCreateStoreModal] = useState(false);
	const [dashboardData, setDashboardData] = useState({
		totalRevenue: 0,
		monthlyGrowth: 0,
		totalProducts: 0,
		lowStockItems: 0,
		recentTransactions: [],
		salesData: [],
		categoryData: [],
		performanceMetrics: {},
	});

	const mockSalesData = [
		{ name: 'Mon', sales: 4000, revenue: 2400 },
		{ name: 'Tue', sales: 3000, revenue: 1398 },
		{ name: 'Wed', sales: 2000, revenue: 9800 },
		{ name: 'Thu', sales: 2780, revenue: 3908 },
		{ name: 'Fri', sales: 1890, revenue: 4800 },
		{ name: 'Sat', sales: 2390, revenue: 3800 },
		{ name: 'Sun', sales: 3490, revenue: 4300 },
	];

	const mockCategoryData = [
		{ name: 'Electronics', value: 35, color: '#8884d8' },
		{ name: 'Clothing', value: 25, color: '#82ca9d' },
		{ name: 'Food', value: 20, color: '#ffc658' },
		{ name: 'Books', value: 10, color: '#ff7300' },
		{ name: 'Others', value: 10, color: '#00ff88' },
	];

	const mockRecentTransactions = [
		{ id: 1, product: 'iPhone 13', customer: 'John Doe', amount: 999, date: '2024-01-15', status: 'completed' },
		{ id: 2, product: 'Samsung TV', customer: 'Jane Smith', amount: 799, date: '2024-01-15', status: 'pending' },
		{ id: 3, product: 'Nike Shoes', customer: 'Bob Johnson', amount: 129, date: '2024-01-14', status: 'completed' },
		{ id: 4, product: 'Dell Laptop', customer: 'Alice Brown', amount: 1299, date: '2024-01-14', status: 'completed' },
		{ id: 5, product: 'Coffee Maker', customer: 'Charlie Wilson', amount: 89, date: '2024-01-13', status: 'cancelled' },
	];

	const createStoreValidationSchema = Yup.object({
		name: Yup.string().min(2, 'Store name must be at least 2 characters').max(50, 'Store name must be less than 50 characters').required('Store name is required'),
		location: Yup.string().min(2, 'Location must be at least 2 characters').max(100, 'Location must be less than 100 characters').required('Location is required'),
		description: Yup.string().max(500, 'Description must be less than 500 characters'),
		phone: Yup.string()
			.matches(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number')
			.min(10, 'Phone number must be at least 10 digits'),
		email: Yup.string().email('Please enter a valid email address'),
	});

	useEffect(() => {
		if (currentUser?.stores?.length > 0 && !selectedStore) {
			setSelectedStore(currentUser.stores[0]);
		}
	}, [currentUser, selectedStore]);

	useEffect(() => {
		const fetchDashboardData = async () => {
			const data = {
				totalRevenue: selectedStore?.total_revenue || 125000,
				monthlyGrowth: 12.5,
				totalProducts: selectedStore?.total_products || 156,
				lowStockItems: selectedStore?.products?.filter((p) => p.quantity_in_stock < 10).length || 8,
				recentTransactions: mockRecentTransactions,
				salesData: mockSalesData,
				categoryData: mockCategoryData,
				performanceMetrics: {
					averageOrderValue: 185,
					conversionRate: 3.2,
					customerSatisfaction: 4.7,
					returnRate: 2.1,
				},
			};
			setDashboardData(data);
		};

		fetchDashboardData();
	}, [selectedStore, selectedPeriod]);

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency: 'KES',
		}).format(amount);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'completed':
				return '#28a745';
			case 'pending':
				return '#ffc107';
			case 'cancelled':
				return '#dc3545';
			default:
				return '#6c757d';
		}
	};

	const handleCreateStore = async (values, { setSubmitting, resetForm, setFieldError }) => {
		try {
			setSubmitting(true);
			const response = await axios.post('/api/stores', {
				...values,
				merchant_id: currentUser.id,
			});

			if (response.data) {
				setCurrentUser((prevUser) => ({
					...prevUser,
					stores: [...(prevUser.stores || []), response.data],
				}));

				setShowCreateStoreModal(false);
				resetForm();
				alert('Store created successfully!');
				setSelectedStore(response.data);
			}
		} catch (error) {
			console.error('Error creating store:', error);
			if (error.response?.data?.errors) {
				Object.keys(error.response.data.errors).forEach((field) => {
					setFieldError(field, error.response.data.errors[field][0]);
				});
			} else {
				alert('Failed to create store. Please try again.');
			}
		} finally {
			setSubmitting(false);
		}
	};

	const closeModal = () => {
		setShowCreateStoreModal(false);
	};

	if (!currentUser) {
		return (
			<div className="dashboard-loading">
				<div className="spinner"></div>
				<p>Loading dashboard...</p>
			</div>
		);
	}

	return (
		<>
            <Sidebar />
            <div className="dashboard">
			{/* Dashboard Header */}
			<div className="dashboard-header">
				<div className="dashboard-title">
					<h1>Welcome back, {currentUser.name}! 👋</h1>
					<p>Here's what's happening with your business today.</p>
				</div>

				<div className="dashboard-controls">
					{currentUser.stores?.length > 0 && (
						<select
							className="store-selector"
							value={selectedStore?.id || ''}
							onChange={(e) => {
								const store = currentUser.stores.find((s) => s.id === parseInt(e.target.value));
								setSelectedStore(store);
							}}>
							<option disabled value="">Select Store</option>
							{currentUser.stores.map((store) => (
								<option key={store.id} value={store.id}>
									{store.name}
								</option>
							))}
						</select>
					)}

					<div className="period-selector">
						{['week', 'month', 'quarter', 'year'].map((period) => (
							<button key={period} className={`period-btn ${selectedPeriod === period ? 'active' : ''}`} onClick={() => setSelectedPeriod(period)}>
								{period.charAt(0).toUpperCase() + period.slice(1)}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="metrics-grid">
				<div className="metric-card revenue">
					<div className="metric-icon">💰</div>
					<div className="metric-content">
						<h3>Total Revenue</h3>
						<p className="metric-value">{formatCurrency(dashboardData.totalRevenue)}</p>
						<span className="metric-change positive">+{dashboardData.monthlyGrowth}% this month</span>
					</div>
				</div>
				<div className="metric-card products">
					<div className="metric-icon">📦</div>
					<div className="metric-content">
						<h3>Total Products</h3>
						<p className="metric-value">{dashboardData.totalProducts}</p>
						<span className="metric-change neutral">Active inventory</span>
					</div>
				</div>
				<div className="metric-card orders">
					<div className="metric-icon">🛒</div>
					<div className="metric-content">
						<h3>Recent Orders</h3>
						<p className="metric-value">{dashboardData.recentTransactions.length}</p>
						<span className="metric-change positive">+15% this week</span>
					</div>
				</div>
				<div className="metric-card alerts">
					<div className="metric-icon">⚠️</div>
					<div className="metric-content">
						<h3>Low Stock Items</h3>
						<p className="metric-value">{dashboardData.lowStockItems}</p>
						<span className="metric-change negative">Needs attention</span>
					</div>
				</div>
			</div>

			{/* Charts */}
			<div className="charts-section">
				<div className="chart-card sales-chart">
					<div className="chart-header">
						<h3>Sales Overview</h3>
						<div className="chart-legend">
							<span className="legend-item">
								<div className="legend-color" style={{ backgroundColor: '#8884d8' }}></div>
								Sales
							</span>
							<span className="legend-item">
								<div className="legend-color" style={{ backgroundColor: '#82ca9d' }}></div>
								Revenue
							</span>
						</div>
					</div>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={dashboardData.salesData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
							<Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>
				</div>

				<div className="chart-card category-chart">
					<div className="chart-header">
						<h3>Sales by Category</h3>
					</div>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie data={dashboardData.categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
								{dashboardData.categoryData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
					<div className="pie-legend">
						{dashboardData.categoryData.map((entry, index) => (
							<div key={index} className="pie-legend-item">
								<div className="legend-color" style={{ backgroundColor: entry.color }}></div>
								<span>
									{entry.name} ({entry.value}%)
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
			{/* Performance Metrics */}
			<div className="performance-section">
				<h3>Performance Metrics</h3>
				<div className="performance-grid">
					<div className="performance-item">
						<div className="performance-icon">📊</div>
						<div className="performance-content">
							<h4>Average Order Value</h4>
							<p>{formatCurrency(dashboardData.performanceMetrics.averageOrderValue)}</p>
						</div>
					</div>
					<div className="performance-item">
						<div className="performance-icon">🎯</div>
						<div className="performance-content">
							<h4>Conversion Rate</h4>
							<p>{dashboardData.performanceMetrics.conversionRate}%</p>
						</div>
					</div>
					<div className="performance-item">
						<div className="performance-icon">⭐</div>
						<div className="performance-content">
							<h4>Customer Satisfaction</h4>
							<p>{dashboardData.performanceMetrics.customerSatisfaction}/5.0</p>
						</div>
					</div>
					<div className="performance-item">
						<div className="performance-icon">🔄</div>
						<div className="performance-content">
							<h4>Return Rate</h4>
							<p>{dashboardData.performanceMetrics.returnRate}%</p>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Transactions */}
			<div className="transactions-section">
				<div className="transactions-header">
					<h3>Recent Transactions</h3>
					<button className="view-all-btn">View All</button>
				</div>
				<div className="transactions-table">
					<div className="table-header">
						<div className="table-cell">Product</div>
						<div className="table-cell">Customer</div>
						<div className="table-cell">Amount</div>
						<div className="table-cell">Date</div>
						<div className="table-cell">Status</div>
					</div>
					{dashboardData.recentTransactions.map((transaction) => (
						<div key={transaction.id} className="table-row">
							<div className="table-cell">{transaction.product}</div>
							<div className="table-cell">{transaction.customer}</div>
							<div className="table-cell">{formatCurrency(transaction.amount)}</div>
							<div className="table-cell">{new Date(transaction.date).toLocaleDateString()}</div>
							<div className="table-cell">
								<span className="status-badge" style={{ backgroundColor: getStatusColor(transaction.status) }}>
									{transaction.status}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="quick-actions">
				<h3>Quick Actions</h3>
				<div className="actions-grid">
					<button className="action-btn create-store-btn" onClick={() => setShowCreateStoreModal(true)}>
						<div className="action-icon">🏪</div>
						<span>Create New Store</span>
					</button>
					<button className="action-btn">
						<div className="action-icon">➕</div>
						<span>Add Product</span>
					</button>
					<button className="action-btn">
						<div className="action-icon">📝</div>
						<span>New Order</span>
					</button>
					<button className="action-btn">
						<div className="action-icon">👥</div>
						<span>Manage Staff</span>
					</button>
					<button className="action-btn">
						<div className="action-icon">📈</div>
						<span>View Reports</span>
					</button>
					<button className="action-btn">
						<div className="action-icon">⚙️</div>
						<span>Settings</span>
					</button>
				</div>
			</div>

			{/* Create Store Modal */}
			{showCreateStoreModal && (
				<div className="modal-overlay" onClick={closeModal}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h2>Create New Store</h2>
							<button className="modal-close" onClick={closeModal}>
								×
							</button>
						</div>

						<Formik
							initialValues={{
								name: '',
								location: '',
								description: '',
								phone: '',
								email: '',
							}}
							validationSchema={createStoreValidationSchema}
							onSubmit={handleCreateStore}>
							{({ isSubmitting }) => (
								<Form className="create-store-form">
									<div className="form-grid">
										<div className="form-group">
											<MyTextInput label="Store Name *" name="name" type="text" placeholder="Enter store name" />
										</div>

										<div className="form-group">
											<MyTextInput label="Location *" name="location" type="text" placeholder="Enter store location" />
										</div>

										<div className="form-group full-width">
											<MyTextInput label="Description" name="description" type="text" placeholder="Brief description of your store (optional)" />
										</div>

										<div className="form-group">
											<MyTextInput label="Phone Number" name="phone" type="tel" placeholder="+254 700 000 000" />
										</div>

										<div className="form-group">
											<MyTextInput label="Email" name="email" type="email" placeholder="store@example.com" />
										</div>
									</div>

									<div className="form-actions">
										<button type="button" className="btn-secondary" onClick={closeModal} disabled={isSubmitting}>
											Cancel
										</button>
										<button type="submit" className="btn-primary" disabled={isSubmitting}>
											{isSubmitting ? (
												<>
													<div className="btn-spinner"></div>
													Creating...
												</>
											) : (
												'Create Store'
											)}
										</button>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			)}
		</div>
        </>
	);
};

export default Dashboard;
