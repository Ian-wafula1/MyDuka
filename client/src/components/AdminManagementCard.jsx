import React from 'react';
import { Formik, Form } from 'formik';
import { MyTextInput } from '../utils/formElements';
import { useMerchantStore } from '../context/MerchantStoreContext';

const AdminManagementCard = ({ admins, showInviteForm, setShowInviteForm, onInviteAdmin, onStatusChange, onDeleteAdmin, inviteValidationSchema }) => {
	const { formatDate } = useMerchantStore();

	const getStatusBadgeClass = (status) => {
		return `status-badge ${status === 'active' ? 'status-active' : 'status-inactive'}`;
	};

	const getPerformanceColor = (admin) => {
		if (!admin.performance) return 'text-gray-500';
		const total = admin.performance.requests_approved + admin.performance.requests_declined;
		const approvalRate = total > 0 ? (admin.performance.requests_approved / total) * 100 : 0;

		if (approvalRate >= 90) return 'text-green-600';
		if (approvalRate >= 75) return 'text-yellow-600';
		return 'text-red-600';
	};

	return (
		<div className="admin-management-card">
			{/* Card Header */}
			<div className="card-header">
				<div className="header-content">
					<h2>👥 Admin Management</h2>
					<p>Manage store administrators and their permissions</p>
				</div>
				<button className="btn-primary" onClick={() => setShowInviteForm(!showInviteForm)}>
					{showInviteForm ? '❌ Cancel' : '➕ Invite Admin'}
				</button>
			</div>

			{/* Invite Form */}
			{showInviteForm && (
				<div className="invite-form-section">
					<h3>Invite New Admin</h3>
					<p className="invite-description">Send an invitation email with a secure token that expires in 7 days.</p>
					<Formik initialValues={{ email: '' }} validationSchema={inviteValidationSchema} onSubmit={onInviteAdmin}>
						{({ isSubmitting }) => (
							<Form className="invite-form">
								<MyTextInput label="Admin Email Address" name="email" type="email" placeholder="Enter admin email" required />
								<div className="form-actions">
									<button type="submit" className="btn-primary" disabled={isSubmitting}>
										{isSubmitting ? '📧 Sending...' : '📧 Send Invitation'}
									</button>
									<button type="button" className="btn-secondary" onClick={() => setShowInviteForm(false)}>
										Cancel
									</button>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			)}

			{/* Admins List */}
			<div className="admins-list">
				<div className="admins-header">
					<h3>Current Admins ({admins.length})</h3>
					<div className="admin-stats">
						<span className="stat-item">Active: {admins.filter((a) => a.account_status === 'active').length}</span>
						<span className="stat-item">Inactive: {admins.filter((a) => a.account_status === 'inactive').length}</span>
					</div>
				</div>

				{admins.length === 0 ? (
					<div className="empty-state">
						<div className="empty-icon">👥</div>
						<h4>No Admins Found</h4>
						<p>Invite your first admin to help manage this store.</p>
					</div>
				) : (
					<div className="admins-grid">
						{admins.map((admin) => (
							<div key={admin.id} className="admin-card">
								<div className="admin-info">
									{/* Admin Header */}
									<div className="admin-header">
										<div className="admin-avatar">
											<img src={admin.avatar} alt={admin.name} className="avatar-image" />
										</div>
										<div className="admin-basic-info">
											<h4 className="admin-name">{admin.name}</h4>
											<span className={getStatusBadgeClass(admin.account_status)}>{admin.account_status}</span>
										</div>
									</div>

									{/* Admin Details */}
									<div className="admin-details">
										<p className="admin-email">✉️ {admin.email}</p>
										{admin.phone && <p className="admin-phone">📱 {admin.phone}</p>}
										<p className="admin-joined">📅 Joined: {formatDate(admin.created_at)}</p>
										{admin.last_login && <p className="admin-last-login">🕒 Last login: {formatDate(admin.last_login)}</p>}
									</div>

									{/* Performance Metrics */}
									{admin.performance && (
										<div className="admin-performance">
											<h5>Performance</h5>
											<div className="performance-grid">
												<div className="performance-item">
													<span className="perf-label">Approved</span>
													<span className="perf-value text-green-600">{admin.performance.requests_approved}</span>
												</div>
												<div className="performance-item">
													<span className="perf-label">Declined</span>
													<span className="perf-value text-red-600">{admin.performance.requests_declined}</span>
												</div>
												<div className="performance-item">
													<span className="perf-label">Response Time</span>
													<span className="perf-value">{admin.performance.avg_response_time}</span>
												</div>
												<div className="performance-item">
													<span className="perf-label">Clerks Managed</span>
													<span className="perf-value">{admin.performance.clerks_managed}</span>
												</div>
											</div>
										</div>
									)}

									{/* Permissions */}
									{admin.permissions && (
										<div className="admin-permissions">
											<h5>Permissions</h5>
											<div className="permissions-list">
												{admin.permissions.map((permission, index) => (
													<span key={index} className="permission-tag">
														{permission.replace('_', ' ')}
													</span>
												))}
											</div>
										</div>
									)}

									{/* Notes */}
									{admin.notes && (
										<div className="admin-notes">
											<p>
												<strong>Notes:</strong> {admin.notes}
											</p>
										</div>
									)}
								</div>

								{/* Admin Actions */}
								<div className="admin-actions">
									<button className={`btn-status ${admin.account_status === 'active' ? 'btn-deactivate' : 'btn-activate'}`} onClick={() => onStatusChange(admin.id, admin.account_status === 'active' ? 'inactive' : 'active')}>
										{admin.account_status === 'active' ? '⏸️ Deactivate' : '▶️ Activate'}
									</button>

									<button className="btn-danger" onClick={() => onDeleteAdmin(admin.id)}>
										🗑️ Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminManagementCard;
