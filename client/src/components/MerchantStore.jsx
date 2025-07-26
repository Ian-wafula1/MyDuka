import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useMerchantStore } from '../context/MerchantStoreContext';
import AdminManagementCard from './AdminManagementCard';
import StoreReportsCard from './StoreReportsCard';
import '../styles/MerchantStore.css';

const MerchantStore = ({ storeId = 1 }) => {
  const {
    store,
    admins,
    loading,
    error,
    fetchStoreData,
    fetchAdmins,
    inviteAdmin,
    updateAdminStatus,
    deleteAdmin,
    setError,
    formatCurrency
  } = useMerchantStore();

  const [activeTab, setActiveTab] = useState('admins');
  const [showInviteForm, setShowInviteForm] = useState(false);

  useEffect(() => {
    // Fetch data when component mounts or storeId changes
    fetchStoreData(storeId);
    fetchAdmins(storeId);
  }, [storeId]);

  const handleInviteAdmin = async (values, { setSubmitting, resetForm, setFieldError }) => {
    try {
      setSubmitting(true);
      
      const result = await inviteAdmin(values.email);
      
      if (result.success) {
        alert(result.message);
        resetForm();
        setShowInviteForm(false);
        // Refresh admins list
        fetchAdmins(storeId);
      }
    } catch (error) {
      if (error.message.includes('email')) {
        setFieldError('email', 'Invalid email address or admin already exists');
      } else {
        setError(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminStatusChange = async (adminId, newStatus) => {
    try {
      const result = await updateAdminStatus(adminId, newStatus);
      if (result.success) {
        alert(result.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteAdmin(adminId);
      if (result.success) {
        alert(result.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const inviteValidationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
  });

  if (loading && !store) {
    return (
      <div className="merchant-store">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading store data...</p>
        </div>
      </div>
    );
  }

  if (error && !store) {
    return (
      <div className="merchant-store">
        <div className="error-message error-message--error">
          <span className="error-message__icon">❌</span>
          <span className="error-message__text">{error}</span>
          <button 
            className="error-message__close"
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="merchant-store">
      {/* Store Header */}
      <div className="merchant-store__header">
        <div className="store-info">
          <h1 className="store-name">{store?.name}</h1>
          <p className="store-location">📍 {store?.location}</p>
          <div className="store-stats">
            <div className="stat-item">
              <span className="stat-label">Products</span>
              <span className="stat-value">{store?.total_products}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Revenue</span>
              <span className="stat-value">{formatCurrency(store?.total_revenue || 0)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Monthly Sales</span>
              <span className="stat-value">{formatCurrency(store?.monthly_sales || 0)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending Requests</span>
              <span className="stat-value">{store?.pending_requests}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message error-message--error">
          <span className="error-message__icon">❌</span>
          <span className="error-message__text">{error}</span>
          <button 
            className="error-message__close"
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="merchant-store__tabs">
        <button
          className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          👥 Admin Management
        </button>
        <button
          className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📊 Store Reports
        </button>
      </div>

      {/* Tab Content */}
      <div className="merchant-store__content">
        {activeTab === 'admins' && (
          <AdminManagementCard
            admins={admins}
            showInviteForm={showInviteForm}
            setShowInviteForm={setShowInviteForm}
            onInviteAdmin={handleInviteAdmin}
            onStatusChange={handleAdminStatusChange}
            onDeleteAdmin={handleDeleteAdmin}
            inviteValidationSchema={inviteValidationSchema}
          />
        )}

        {activeTab === 'reports' && (
          <StoreReportsCard
            store={store}
            storeId={storeId}
          />
        )}
      </div>
    </div>
  );
};

export default MerchantStore;