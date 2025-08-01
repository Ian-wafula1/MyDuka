import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {

	return (
		<div className="homepage">
			{/* Hero Section */}
			<section className="hero-section">
				<div className="hero-content">
					<h1 className="hero-title">Manage Your Store with MyDuka</h1>
					<p className="hero-subtitle">Empower your business with seamless admin management, real-time analytics, and performance insights.</p>
					<div className="hero-cta">
						<Link to="/signup" className="btn-primary">
							Get Started
						</Link>
						<Link to="/login" className="btn-secondary">
							Log In
						</Link>
					</div>
				</div>
				<div className="hero-visual">
					<div className="animated-chart" />
				</div>
			</section>

			{/* Features Section */}
			<section className="features-section">
				<h2 className="section-title">Why Choose MyDuka?</h2>
				<div className="features-grid">
					<div className="feature-card">
						<div className="feature-icon">👥</div>
						<h3>Admin Management</h3>
						<p>Efficiently manage your store admins with secure invitations and performance tracking.</p>
					</div>
					<div className="feature-card">
						<div className="feature-icon">📊</div>
						<h3>Real-Time Analytics</h3>
						<p>Track sales, revenue, and product performance with customizable weekly, monthly, and yearly reports.</p>
					</div>
					<div className="feature-card">
						<div className="feature-icon">💸</div>
						<h3>Payment Insights</h3>
						<p>Monitor paid and unpaid transactions to optimize your store’s financial operations.</p>
					</div>
				</div>
			</section>

			{/* Metrics Section */}
			<section className="metrics-section">
				<h2 className="section-title">MyDuka in Numbers</h2>
				<div className="metrics-grid">
					<div className="metric-card">
						<span className="metric-value">150+</span>
						<span className="metric-label">Stores Managed</span>
					</div>
					<div className="metric-card">
						<span className="metric-value">KSh 1M+</span>
						<span className="metric-label">Revenue Tracked</span>
					</div>
					<div className="metric-card">
						<span className="metric-value">500+</span>
						<span className="metric-label">Active Admins</span>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="testimonials-section">
				<h2 className="section-title">What Our Merchants Say</h2>
				<div className="testimonials-grid">
					<div className="testimonial-card">
						<p className="testimonial-text">"MyDuka transformed how I manage my store. The analytics are a game-changer!"</p>
						<div className="testimonial-author">
							<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt="Jane" className="testimonial-avatar" />
							<span>Jane, Downtown Store</span>
						</div>
					</div>
					<div className="testimonial-card">
						<p className="testimonial-text">"The admin management tools are intuitive and save me hours every week."</p>
						<div className="testimonial-author">
							<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="Michael" className="testimonial-avatar" />
							<span>Michael, Retail Hub</span>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Footer */}
			<section className="cta-section">
				<h2 className="section-title">Ready to Grow Your Store?</h2>
				<p className="cta-text">Join MyDuka today and take control of your business like never before.</p>
				<Link to="/signup" className="btn-primary">
					Start Free Trial
				</Link>
			</section>
		</div>
	);
};

export default HomePage;
