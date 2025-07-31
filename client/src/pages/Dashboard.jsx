import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MyTextInput } from '../utils/formElements';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
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
    performanceMetrics: {},
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const createStoreValidationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Store name must be at least 2 characters')
      .max(50, 'Store name must be less than 50 characters')
      .required('Store name is required'),
    address: Yup.string()
      .min(2, 'Address must be at least 2 characters')
      .max(100, 'Address must be less than 100 characters')
      .required('Address is required'),
    description: Yup.string().max(500, 'Description must be less than 500 characters'),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number')
      .min(10, 'Phone number must be at least 10 digits'),
    email: Yup.string().email('Please enter a valid email address'),
  });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/merchants/stores', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.stores && Array.isArray(response.data.stores)) {
          setCurrentUser((prevUser) => ({
            ...prevUser,
            stores: response.data.stores,
          }));
          if (response.data.stores.length > 0 && !selectedStore) {
            setSelectedStore(response.data.stores[0]);
          }
        } else {
          throw new Error('Invalid stores data format');
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        setError(error.response?.data?.error || 'Failed to load stores. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!selectedStore) return;

      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const [salesResponse, transactionsResponse] = await Promise.all([
          axios.get(`/api/stores/${selectedStore.id}/sales?period=${selectedPeriod}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/stores/${selectedStore.id}/transactions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const calculateDashboardData = (sales, transactions, store) => {
          // Calculate total revenue
          const totalRevenue = store.total_revenue || 0;

          // Calculate monthly growth
          const currentSales = sales.currentPeriod.reduce((sum, item) => sum + (item.revenue || 0), 0);
          const previousSales = sales.previousPeriod
            ? sales.previousPeriod.reduce((sum, item) => sum + (item.revenue || 0), 0)
            : currentSales;
          const monthlyGrowth = previousSales
            ? ((currentSales - previousSales) / previousSales) * 100
            : 0;

          // Calculate total products and low stock items
          const totalProducts = store.total_products || store.products?.length || 0;
          const lowStockItems = store.products?.filter((p) => p.quantity_in_stock < 10).length || 0;

          // Format sales data for chart
          const salesData = sales.currentPeriod.map((item) => ({
            name: item.day,
            sales: item.sales || 0,
            revenue: item.revenue || 0,
          }));

          // Format recent transactions
          const recentTransactions = transactions.slice(0, 5).map((t) => ({
            id: t.id,
            product: t.product_name || 'Unknown Product',
            customer: 'Anonymous', // No customer_name in Transaction model
            amount: t.quantity * t.unit_price,
            date: t.created_at,
            status: t.status || 'completed',
          }));

          // Calculate performance metrics
          const totalOrders = transactions.length;
          const performanceMetrics = {
            averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
            conversionRate: totalOrders ? (totalOrders / (store.visits || 1000)) * 100 : 0, // Default visits to 1000
            customerSatisfaction: store.satisfaction_rating || 4.0, // Default to 4.0
            returnRate: transactions.filter((t) => t.status === 'cancelled').length
              ? (transactions.filter((t) => t.status === 'cancelled').length / totalOrders) * 100
              : 0,
          };

          return {
            totalRevenue,
            monthlyGrowth: parseFloat(monthlyGrowth.toFixed(1)),
            totalProducts,
            lowStockItems,
            recentTransactions,
            salesData,
            performanceMetrics,
          };
        };

        const newDashboardData = calculateDashboardData(
          salesResponse.data,
          transactionsResponse.data,
          selectedStore
        );

        setDashboardData(newDashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.response?.data?.error || 'Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
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
      case 'approved':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'cancelled':
      case 'denied':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const handleCreateStore = async (values, { setSubmitting, resetForm, setFieldError }) => {
    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/stores',
        {
          ...values,
          merchant_id: currentUser.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      if (error.response?.data?.error) {
        const errorMsg = error.response.data.error;
        if (errorMsg.includes('Missing')) {
          const field = errorMsg.match(/Missing (\w+)/)?.[1];
          if (field) setFieldError(field, errorMsg);
          else setError(errorMsg);
        } else {
          setError(errorMsg);
        }
      } else {
        setError('Failed to create store. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowCreateStoreModal(false);
    setError(null);
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
        {isLoading && (
          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        )}
        {error && (
          <div className="error-message">
            <span className="error-message__icon">⚠️</span>
            <span className="error-message__text">{error}</span>
          </div>
        )}
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Welcome back, {currentUser.name}! 👋</h1>
            <p>Here's what's happening with your business today.</p>
          </div>

          <div className="dashboard-controls">
            {currentUser.stores?.length > 0 ? (
              <select
                className="store-selector"
                value={selectedStore?.id || ''}
                onChange={(e) => {
                  const store = currentUser.stores.find((s) => s.id === parseInt(e.target.value));
                  setSelectedStore(store);
                }}
              >
                <option disabled value="">
                  Select Store
                </option>
                {currentUser.stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateStoreModal(true)}
              >
                Create Your First Store
              </button>
            )}

            <div className="period-selector">
              {['week', 'month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card revenue">
            <h2>
              <span className="icon">💰</span> Total Revenue
            </h2>
            <p className="value">{formatCurrency(dashboardData.totalRevenue)}</p>
            <p className={dashboardData.monthlyGrowth >= 0 ? 'success' : 'error'}>
              {dashboardData.monthlyGrowth >= 0 ? '+' : ''}
              {dashboardData.monthlyGrowth}% this month
            </p>
          </div>
          <div className="metric-card products">
            <h2>
              <span className="icon">📦</span> Total Products
            </h2>
            <p className="value">{dashboardData.totalProducts}</p>
            <p>Active inventory</p>
          </div>
          <div className="metric-card orders">
            <h2>
              <span className="icon">🛒</span> Recent Orders
            </h2>
            <p className="value">{dashboardData.recentTransactions.length}</p>
            <p className="success">+15% this week</p>
          </div>
          <div className="metric-card alerts">
            <h2>
              <span className="icon">⚠️</span> Low Stock Items
            </h2>
            <p className="value">{dashboardData.lowStockItems}</p>
            <p className={dashboardData.lowStockItems > 0 ? 'error' : 'success'}>
              {dashboardData.lowStockItems > 0 ? 'Needs attention' : 'All good'}
            </p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="chart-section">
          <h2>Sales Overview</h2>
          {dashboardData.salesData.length > 0 ? (
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
          ) : (
            <div className="empty-state">
              <span className="icon">📊</span>
              <h3>No Sales Data</h3>
              <p>No sales data available for the selected period.</p>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="recent-activity">
          <h2>Performance Metrics</h2>
          <div className="activity-grid">
            <div className="activity-item">
              <h3>Average Order Value</h3>
              <p>{formatCurrency(dashboardData.performanceMetrics.averageOrderValue || 0)}</p>
            </div>
            <div className="activity-item">
              <h3>Conversion Rate</h3>
              <p>{(dashboardData.performanceMetrics.conversionRate || 0).toFixed(1)}%</p>
            </div>
            <div className="activity-item">
              <h3>Customer Satisfaction</h3>
              <p>{(dashboardData.performanceMetrics.customerSatisfaction || 0).toFixed(1)}/5.0</p>
            </div>
            <div className="activity-item">
              <h3>Return Rate</h3>
              <p>{(dashboardData.performanceMetrics.returnRate || 0).toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="recent-activity">
          <h2>Recent Transactions</h2>
          {dashboardData.recentTransactions.length > 0 ? (
            <div className="activity-grid">
              {dashboardData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="activity-item">
                  <p>
                    <strong>{transaction.product}</strong> by {transaction.customer}
                  </p>
                  <p>{formatCurrency(transaction.amount)}</p>
                  <p>{new Date(transaction.date).toLocaleDateString()}</p>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(transaction.status) }}
                  >
                    {transaction.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="icon">📄</span>
              <h3>No Transactions</h3>
              <p>No recent transactions available for the selected store.</p>
            </div>
          )}
          <button className="btn btn-primary">View All Transactions</button>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button
              className="action-btn btn-primary"
              onClick={() => setShowCreateStoreModal(true)}
            >
              <span className="action-icon">🏪</span>
              <span>Create New Store</span>
            </button>
            <button className="action-btn btn-primary">
              <span className="action-icon">➕</span>
              <span>Add Product</span>
            </button>
            <button className="action-btn btn-primary">
              <span className="action-icon">📝</span>
              <span>New Order</span>
            </button>
            <button className="action-btn btn-primary">
              <span className="action-icon">👥</span>
              <span>Manage Staff</span>
            </button>
            <button className="action-btn btn-primary">
              <span className="action-icon">📈</span>
              <span>View Reports</span>
            </button>
            <button className="action-btn btn-primary">
              <span className="action-icon">⚙️</span>
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
                onSubmit={handleCreateStore}
              >
                {({ isSubmitting }) => (
                  <Form className="form-container">
                    <div className="form-grid">
                      <MyTextInput
                        label="Store Name *"
                        name="name"
                        type="text"
                        placeholder="Enter store name"
                      />
                      <MyTextInput
                        label="Address *"
                        name="address"
                        type="text"
                        placeholder="Enter store address"
                      />
                      <MyTextInput
                        label="Description"
                        name="description"
                        type="text"
                        placeholder="Brief description of your store (optional)"
                      />
                      <MyTextInput
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="+254 700 000 000"
                      />
                      <MyTextInput
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="store@example.com"
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeModal}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
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