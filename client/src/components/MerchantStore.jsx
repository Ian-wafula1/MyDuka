import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MyTextInput } from '../utils/formElements';
import ProductsCard from './ProductsCard';
import axios from 'axios';

export default function MerchantStore({ store, setStore }) {
	console.log(store);
	const [isOpen, setIsOpen] = useState({
		admins: false,
		reports: false,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Helper function to format currency
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency: 'KES',
		}).format(amount);
	};

	// Function to remove admin
	const removeAdmin = (admin) => {
		if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
			return;
		}

		axios
			.delete(`/api/admins/${admin.id}`)
			.then(() => {
				setStore((store) => ({
					...store,
					users: store.users.filter((user) => user.id !== admin.id && user.account_type === 'admin'),
				}));
				console.log(`Admin ${admin.name} removed`);
			})
			.catch((err) => {
				setError('Failed to remove admin');
				console.log(err);
			});
	};

	// Function to change admin account status
	const changeAdminStatus = (admin) => {
		axios
			.patch(`/api/admins/${admin.id}`, {
				account_status: admin.account_status === 'active' ? 'disabled' : 'active',
			})
			.then(() => {
				setStore((store) => ({
					...store,
					users: store.users.map((user) => {
						if (user.id === admin.id) {
							return {
								...user,
								account_status: user.account_status === 'active' ? 'disabled' : 'active',
							};
						}
						return user;
					}),
				}));
			})
			.catch((err) => {
				setError('Failed to update admin status');
				console.log(err);
			});
	};

	// Validation schema for inviting admin
	const inviteValidationSchema = Yup.object({
		name: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
		email: Yup.string().email('Invalid email address').required('Required'),
		password: Yup.string().min(8, 'Must be 8 characters or more').required('Required'),
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
					<button className="error-message__close" onClick={() => setError('')}>
						×
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Store Header */}
			<div className="merchant-store__header">
				<div className="store-info">
					<h1 className="store-name">{store?.name || 'Unlisted'}</h1>
					<p className="store-location">📍 {store?.location}</p>
					<div className="store-stats">
						<div className="stat-item">
							<span className="stat-label">Products</span>
							<span className="stat-value">{store?.total_products || 0}</span>
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
							<span className="stat-value">{store?.pending_requests || 0}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Error Display */}
			{error && (
				<div className="error-message error-message--error">
					<span className="error-message__icon">❌</span>
					<span className="error-message__text">{error}</span>
					<button className="error-message__close" onClick={() => setError('')}>
						×
					</button>
				</div>
			)}

			{/* Admin Management Card */}
			<div className="card admins">
				<h1>👥 Admin Management</h1>
				<div>
					{store?.users
						?.filter((user) => user.account_type === 'admin')
						.map((admin) => (
							<div key={admin.id} className="admin-item">
								<p>
									<strong>Name:</strong> {admin.name}
								</p>
								<p>
									<strong>Email:</strong> {admin.email}
								</p>
								<p>
									<strong>Status:</strong>
									<span className={`status ${admin.account_status}`}>{admin.account_status}</span>
								</p>
								<div className="admin-actions">
									<button onClick={() => changeAdminStatus(admin)} className={`btn ${admin.account_status === 'active' ? 'btn-warning' : 'btn-success'}`}>
										{admin.account_status === 'active' ? 'Deactivate' : 'Activate'}
									</button>
									<button onClick={() => removeAdmin(admin)} className="btn btn-danger">
										Remove
									</button>
								</div>
							</div>
						))}
				</div>

				{/* Add Admin Form */}
				<div>
					<button onClick={() => setIsOpen((prev) => ({ ...prev, admins: !prev.admins }))} className="btn btn-primary">
						{isOpen.admins ? 'Close' : 'Invite Admin'}
					</button>
					{isOpen.admins && (
						<Formik
							initialValues={{
								name: '',
								email: '',
								password: '',
								account_type: 'admin',
							}}
							validationSchema={inviteValidationSchema}
							onSubmit={(values, { setSubmitting, resetForm }) => {
								axios
									.post('/api/admin', {
										name: values.name,
										email: values.email,
										password: values.password,
										account_type: values.account_type,
										store_id: store.id,
										merchant_id: store.merchant_id,
									})
									.then((res) => {
										setIsOpen((prev) => ({ ...prev, admins: false }));
										setStore((store) => ({
											...store,
											users: [...store.users, res.data],
										}));
										resetForm();
									})
									.catch((err) => {
										setError('Failed to invite admin');
										console.log(err);
									});
								setSubmitting(false);
							}}>
							<Form>
								<MyTextInput label="Name" name="name" type="text" />
								<MyTextInput label="Email" name="email" type="email" />
								<MyTextInput label="Password" name="password" type="password" />
								<button type="submit" className="btn btn-primary">
									Invite Admin
								</button>
							</Form>
						</Formik>
					)}
				</div>
			</div>

			{/* Store Reports Card */}
			<div className="card reports">
				<h1>📊 Store Reports</h1>
				<div className="reports-grid">
					<div className="report-item">
						<h3>Sales Summary</h3>
						<p>
							<strong>Total Revenue:</strong> {formatCurrency(store?.total_revenue || 0)}
						</p>
						<p>
							<strong>Monthly Sales:</strong> {formatCurrency(store?.monthly_sales || 0)}
						</p>
						<p>
							<strong>Total Products:</strong> {store?.total_products || 0}
						</p>
					</div>

					<div className="report-item">
						<h3>Inventory Status</h3>
						<p>
							<strong>Products in Stock:</strong> {store?.products?.filter((p) => p.quantity_in_stock > 0).length || 0}
						</p>
						<p>
							<strong>Low Stock Items:</strong> {store?.products?.filter((p) => p.quantity_in_stock < 10).length || 0}
						</p>
						<p>
							<strong>Out of Stock:</strong> {store?.products?.filter((p) => p.quantity_in_stock === 0).length || 0}
						</p>
					</div>

					<div className="report-item">
						<h3>Recent Activity</h3>
						<p>
							<strong>Pending Requests:</strong> {store?.pending_requests || 0}
						</p>
						<p>
							<strong>Active Admins:</strong> {store?.users?.filter((u) => u.account_type === 'admin' && u.account_status === 'active').length || 0}
						</p>
						<p>
							<strong>Recent Entries:</strong> {store?.entries?.filter((e) => e.payment_status === 'pending').length || 0}
						</p>
					</div>
				</div>

				<div className="report-actions">
					<button onClick={() => setIsOpen((prev) => ({ ...prev, reports: !prev.reports }))} className="btn btn-secondary">
						{isOpen.reports ? 'Hide Details' : 'View Detailed Reports'}
					</button>

					{isOpen.reports && (
						<div className="detailed-reports">
							<h4>Recent Entries</h4>
							<div className="entries-list">
								{store?.entries?.slice(0, 5).map((entry) => (
									<div key={entry.id} className="entry-item">
										<p>
											<strong>Product:</strong> {store.products?.find((p) => p.id === entry.product_id)?.name || 'Unknown'}
										</p>
										<p>
											<strong>Quantity:</strong> {entry.quantity}
										</p>
										<p>
											<strong>Status:</strong> {entry.payment_status}
										</p>
										<p>
											<strong>Total:</strong> {formatCurrency(entry.total_sum)}
										</p>
										<p>
											<strong>Date:</strong> {new Date(entry.created_at).toLocaleDateString()}
										</p>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Include ProductsCard for consistency */}
			<ProductsCard store={store} setStore={setStore} />
		</>
	);
}
