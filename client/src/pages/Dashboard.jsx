import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MyTextInput } from '../utils/formElements';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { mockCategoryDataArray, mockSalesDataArray, mockRecentTransactionsArray, mockDashboardDataArray } from '../components/mockData';

const Dashboard = () => {
	const navigate = useNavigate();

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigate('/login');
		}
	}, [navigate]);

	const { currentUser, setCurrentUser } = useContext(AppContext);
	const [selectedPeriod] = useState('week');
	const [selectedStore, setSelectedStore] = useState(null);
	const [showCreateStoreModal, setShowCreateStoreModal] = useState(false);
	const [error] = useState(null);
	const [mockValues, setMockValues] = useState({
		mockCategoryData: mockCategoryDataArray[0],
		mockSalesData: mockSalesDataArray[0],
		mockRecentTransactions: mockRecentTransactionsArray[0],
        mockDashboardData: mockDashboardDataArray[0],
	});
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

	const mockSalesData = mockValues.mockSalesData;
	const mockCategoryData = mockValues.mockCategoryData;
	const mockRecentTransactions = mockValues.mockRecentTransactions;

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
				totalProducts: selectedStore?.products?.length || 156,
				lowStockItems: selectedStore?.products?.filter((p) => p.quantity_in_stock < 5).length || 8,
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

	// const getStatusColor = (status) => {
	// 	switch (status) {
	// 		case 'completed':
	// 			return '#28a745';
	// 		case 'pending':
	// 			return '#ffc107';
	// 		case 'cancelled':
	// 			return '#dc3545';
	// 		default:
	// 			return '#6c757d';
	// 	}
	// };

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
                                    const id = currentUser.stores.indexOf(store);
									setSelectedStore(store);
									setMockValues(prev => {
                                        return {
                                            ...prev,
                                            mockSalesData: mockSalesDataArray[parseInt(id)],
                                            mockCategoryData: mockCategoryDataArray[parseInt(id)],
                                            mockRecentTransactions: mockRecentTransactionsArray[parseInt(id)]
                                        }
                                    });
                                    setDashboardData(prev => {
                                        return {
                                            ...prev,
                                            ...mockDashboardDataArray[parseInt(id)]
                                        }
                                    })
								}}>
								<option disabled value="">
									Select Store
								</option>
								{currentUser.stores.map((store) => (
									<option key={store.id} value={store.id}>
										{store.name}
									</option>
								))}
							</select>
						)}
					</div>
				</div>

				{/* Key Metrics */}
				<div className="metrics-grid">
					<div className="metric-card revenue">
						<div className="metric-icon">💰</div>
						<div className="metric-content">
							<h3>Total Revenue</h3>
							<p className="metric-value">{formatCurrency(dashboardData?.totalRevenue)}</p>
							<span className="metric-change positive">+{dashboardData?.monthlyGrowth}% this month</span>
						</div>
					</div>
					<div className="metric-card products">
						<div className="metric-icon">📦</div>
						<div className="metric-content">
							<h3>Total Products</h3>
							<p className="metric-value">{dashboardData?.totalProducts}</p>
							<span className="metric-change neutral">Active inventory</span>
						</div>
					</div>
					<div className="metric-card orders">
						<div className="metric-icon">🛒</div>
						<div className="metric-content">
							<h3>Recent Orders</h3>
							<p className="metric-value">{dashboardData?.recentTransactions?.length}</p>
							<span className="metric-change positive">+15% this week</span>
						</div>
					</div>
					<div className="metric-card alerts">
						<div className="metric-icon">⚠️</div>
						<div className="metric-content">
							<h3>Low Stock Items</h3>
							<p className="metric-value">{dashboardData?.lowStockItems}</p>
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
							<LineChart data={dashboardData?.salesData}>
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
								<Pie data={dashboardData?.categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
									{dashboardData?.categoryData?.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
						<div className="pie-legend">
							{dashboardData?.categoryData?.map((entry, index) => (
								<div key={index} className="pie-legend-item">
									<div className="legend-color" style={{ backgroundColor: entry.color }}></div>
									<span>
										{entry?.name} ({entry?.value}%)
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Recent Transactions */}
				<div className="transactions-section">
					<div className="transactions-header">
						<h3 className="transactions-title">Recent Transactions</h3>
					</div>
					<div className="transactions-container">
						<div className="transactions-table">
							<div className="table-header">
								<div className="table-cell header-cell">Product</div>
								<div className="table-cell header-cell">Customer</div>
								<div className="table-cell header-cell">Amount</div>
								<div className="table-cell header-cell">Date</div>
								<div className="table-cell header-cell">Status</div>
							</div>
							<div className="table-body">
								{dashboardData?.recentTransactions?.map((transaction, index) => (
									<div key={transaction.id} className={`table-row ${index % 2 === 0 ? 'row-even' : 'row-odd'}`}>
										<div className="table-cell product-cell">
											<div className="product-info">
												<div className="product-icon">📦</div>
												<span className="product-name">{transaction?.product}</span>
											</div>
										</div>
										<div className="table-cell customer-cell">
											<div className="customer-info">
												<div className="customer-avatar">{transaction?.customer.charAt(0).toUpperCase()}</div>
												<span className="customer-name">{transaction?.customer}</span>
											</div>
										</div>
										<div className="table-cell amount-cell">
											<span className="amount-value">{formatCurrency(transaction?.amount)}</span>
										</div>
										<div className="table-cell date-cell">
											<span className="date-value">{new Date(transaction?.date).toLocaleDateString()}</span>
										</div>
										<div className="table-cell status-cell">
											<span className={`status-badge status-${transaction?.status?.toLowerCase()?.replace(' ', '-')}`}>
												<span className="status-indicator"></span>
												{transaction.status}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="quick-actions">
					<h2>Quick Actions</h2>
					<div className="actions-grid">
						<button className="action-btn btn-primary" onClick={() => setShowCreateStoreModal(true)}>
							<span className="action-icon">🏪</span>
							<span>Create New Store</span>
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
							{error && (
								<div className="error-message">
									<span className="error-message__icon">⚠️</span>
									<span className="error-message__text">{error}</span>
								</div>
							)}
							<Formik
								initialValues={{
									name: '',
									address: '',
									description: '',
									phone: '',
									email: '',
								}}
								validationSchema={createStoreValidationSchema}
								onSubmit={handleCreateStore}>
								{({ isSubmitting }) => (
									<Form className="form-container">
										<div className="form-grid">
											<MyTextInput label="Store Name *" name="name" type="text" placeholder="Enter store name" />
											<MyTextInput label="Address *" name="address" type="text" placeholder="Enter store address" />
											<MyTextInput label="Description" name="description" type="text" placeholder="Brief description of your store (optional)" />
											<MyTextInput label="Phone Number" name="phone" type="tel" placeholder="+254 700 000 000" />
											<MyTextInput label="Email" name="email" type="email" placeholder="store@example.com" />
										</div>
										<div className="form-actions">
											<button type="button" className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>
												Cancel
											</button>
											<button type="submit" className="btn btn-primary" disabled={isSubmitting}>
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
