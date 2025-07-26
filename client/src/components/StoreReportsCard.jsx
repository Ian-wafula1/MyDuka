import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useMerchantStore } from '../context/MerchantStoreContext';

const StoreReportsCard = ({ store, storeId }) => {
  const {
    salesData,
    productData,
    paymentData,
    loading,
    fetchReportsData,
    formatCurrency
  } = useMerchantStore();

  const [reportPeriod, setReportPeriod] = useState('monthly');

  useEffect(() => {
    fetchReportsData(reportPeriod);
  }, [reportPeriod]);

  const handlePeriodChange = (period) => {
    setReportPeriod(period);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-entry" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="store-reports-card">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="store-reports-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="header-content">
          <h2>📊 Store Reports</h2>
          <p>Comprehensive analytics and performance metrics</p>
        </div>
        <div className="period-selector">
          <button
            className={period-btn ${reportPeriod === 'weekly' ? 'active' : ''}}
            onClick={() => handlePeriodChange('weekly')}
          >
            Weekly
          </button>
          <button
            className={period-btn ${reportPeriod === 'monthly' ? 'active' : ''}}
            onClick={() => handlePeriodChange('monthly')}
          >
            Monthly
          </button>
          <button
            className={period-btn ${reportPeriod === 'yearly' ? 'active' : ''}}
            onClick={() => handlePeriodChange('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="reports-grid">
        {/* Sales Trend Chart */}
        <div className="chart-section full-width">
          <h3>Sales & Revenue Trend ({reportPeriod})</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" label={{ value: 'Sales', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Revenue (KSh)', angle: -90, position: 'insideRight' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#82ca9d"
                fill="url(#colorSales)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#8884d8"
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Product Distribution Chart */}
        <div className="chart-section">
          <h3>Product Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => ${name}: ${value}%}
              >
                {productData.map((entry, index) => (
                  <Cell key={cell-${index}} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  ${value}% (${props.payload.quantity} items, ${formatCurrency(props.payload.revenue)}),
                  name
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Chart */}
        <div className="chart-section">
          <h3>Payment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Amount (KSh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(value, name, props) => [
                  ${formatCurrency(props.payload.amount)} (${props.payload.count} transactions),
                  name
                ]}
              />
              <Legend />
              <Bar dataKey="amount" name="Amount">
                {paymentData.map((entry, index) => (
                  <Cell key={cell-${index}} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics */}
        <div className="metrics-section full-width">
          <h3>Key Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Total Products</span>
              <span className="metric-value">{store?.total_products || 0}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Total Revenue</span>
              <span className="metric-value">{formatCurrency(store?.total_revenue || 0)}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Monthly Sales</span>
              <span className="metric-value">{formatCurrency(store?.monthly_sales || 0)}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Pending Requests</span>
              <span className="metric-value">{store?.pending_requests || 0}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Active Clerks</span>
              <span className="metric-value">{store?.active_clerks || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreReportsCard;