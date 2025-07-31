import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/contact.css';

export default function Contact() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission here
		alert("Thank you for your message! We'll get back to you soon.");
		setFormData({ name: '', email: '', subject: '', message: '' });
	};

	const navigate = useNavigate();

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigate('/login');
		}
	}, [navigate]);

	return (
		<>
			<Sidebar />
			<div className="contact-container">
				<div className="contact-content">
					<header className="contact-header">
						<h1 className="contact-title">Contact Us</h1>
						<p className="contact-subtitle">We'd Love to Hear From You</p>
					</header>

					<div className="contact-grid">
						<section className="form-section">
							<div className="section-card form-card">
								<div className="card-icon">📧</div>
								<h2>Send Us a Message</h2>
								<p>Have a question, suggestion, or just want to say hello? Fill out the form below and we'll get back to you as soon as possible.</p>
								<div className="contact-form">
									<div className="form-group">
										<label htmlFor="name">Full Name</label>
										<input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" required />
									</div>
									<div className="form-group">
										<label htmlFor="email">Email Address</label>
										<input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email address" required />
									</div>
									<div className="form-group">
										<label htmlFor="subject">Subject</label>
										<input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="What's this about?" required />
									</div>
									<div className="form-group">
										<label htmlFor="message">Message</label>
										<textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us more about your inquiry..." required />
									</div>
									<button type="button" className="submit-btn" onClick={handleSubmit}>
										Send Message
									</button>
								</div>
							</div>
						</section>

						<section className="info-section">
							<div className="section-card info-card">
								<div className="card-icon">🏢</div>
								<h2>Get in Touch</h2>
								<p>We're here to help and answer any questions you might have. Reach out to us through any of these channels.</p>
								<div className="contact-info">
									<div className="info-item">
										<div className="info-icon">📞</div>
										<div className="info-text">
											<h3>Phone</h3>
											<p>+254 700 123 456</p>
										</div>
									</div>
									<div className="info-item">
										<div className="info-icon">✉️</div>
										<div className="info-text">
											<h3>Email</h3>
											<p>hello@myduka.co.ke</p>
										</div>
									</div>
									<div className="info-item">
										<div className="info-icon">⏰</div>
										<div className="info-text">
											<h3>Business Hours</h3>
											<p>Mon - Fri: 8:00 AM - 6:00 PM</p>
										</div>
									</div>
									<div className="info-item">
										<div className="info-icon">🚀</div>
										<div className="info-text">
											<h3>Response Time</h3>
											<p>Within 24 hours</p>
										</div>
									</div>
								</div>
							</div>
						</section>
					</div>

					<section className="offices-section">
						<div className="section-card">
							<div className="card-icon">🌍</div>
							<h2>Our Offices</h2>
							<p>Visit us at any of our locations across East Africa. Our doors are always open for partnerships, consultations, and friendly conversations about how we can help transform your business.</p>
							<div className="offices-grid">
								<div className="office-card">
									<div className="office-icon">🏢</div>
									<h3>Nairobi Headquarters</h3>
									<p>Our main office and development center</p>
									<p className="office-address">
										Westlands Office Park
										<br />
										Waiyaki Way, Nairobi
										<br />
										Kenya
									</p>
								</div>
								<div className="office-card">
									<div className="office-icon">🌆</div>
									<h3>Kampala Branch</h3>
									<p>Serving businesses across Uganda</p>
									<p className="office-address">
										Nakasero Business District
										<br />
										Plot 123, Parliament Avenue
										<br />
										Kampala, Uganda
									</p>
								</div>
								<div className="office-card">
									<div className="office-icon">🏙️</div>
									<h3>Dar es Salaam Office</h3>
									<p>Supporting Tanzanian market growth</p>
									<p className="office-address">
										Masaki Peninsula
										<br />
										Sea Cliff Village
										<br />
										Dar es Salaam, Tanzania
									</p>
								</div>
							</div>
						</div>
					</section>

					<section className="social-section">
						<div className="section-card">
							<h2>Follow Our Journey</h2>
							<p>Stay connected with MyDuka and be the first to know about new features, company updates, and industry insights. Join our growing community across social media platforms.</p>
							<div className="social-links">
								<a href="https://x.com/" target='_blank' className="social-link" title="Twitter">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										class="lucide lucide-twitter-icon lucide-twitter">
										<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
									</svg>
								</a>
								<a href="https://www.linkedin.com/" target='_blank' className="social-link" title="LinkedIn">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										class="lucide lucide-linkedin-icon lucide-linkedin">
										<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
										<rect width="4" height="12" x="2" y="9" />
										<circle cx="4" cy="4" r="2" />
									</svg>
								</a>
								<a href="https://www.facebook.com/" target="_blank" className="social-link" title="Facebook">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										class="lucide lucide-facebook-icon lucide-facebook">
										<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
									</svg>
								</a>
								<a href="https://www.instagram.com/" target="_blank" className="social-link" title="Instagram">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										class="lucide lucide-instagram-icon lucide-instagram">
										<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
										<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
										<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
									</svg>
								</a>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
