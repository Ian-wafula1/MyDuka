import Sidebar from '../components/Sidebar';
import '../styles/about.css';

export default function About() {
	return (
		<>
			<Sidebar />
			<div className="about-container">
				<div className="about-content">
					<header className="about-header">
						<h1 className="about-title">About MyDuka</h1>
						<p className="about-subtitle">Leading Innovation in Business Technology Solutions</p>
					</header>

					<section className="company-story-section">
						<div className="section-card">
							<div className="card-icon">🏢</div>
							<h2>Our Story</h2>
							<p>
								Founded in 2019 by a team of seasoned entrepreneurs and technology experts, MyDuka emerged from a simple observation: small and medium businesses across Africa were struggling with outdated inventory management systems that
								hindered their growth potential.
							</p>
							<p>
								What started as a weekend project in a small garage in Nairobi has evolved into a leading technology company serving thousands of businesses across East Africa. Our founders, having experienced firsthand the challenges of
								running retail operations, were determined to create solutions that would level the playing field for businesses of all sizes.
							</p>
							<p>Today, MyDuka stands as a testament to African innovation, combining local market understanding with cutting-edge technology to deliver world-class business solutions.</p>
						</div>
					</section>

					<section className="leadership-section">
						<div className="section-card solution-card">
							<div className="card-icon">👥</div>
							<h2>Our Leadership Team</h2>
							<p>MyDuka is guided by a diverse team of industry veterans, technology innovators, and business strategists who bring decades of combined experience in software development, business operations, and market expansion.</p>
							<div className="features-grid">
								<div className="feature-item">
									<h3>🎯 Strategic Vision</h3>
									<p>Our executives bring Fortune 500 experience to drive sustainable growth and market expansion</p>
								</div>
								<div className="feature-item">
									<h3>💻 Technical Excellence</h3>
									<p>Led by award-winning software architects and engineers from top global technology companies</p>
								</div>
								<div className="feature-item">
									<h3>🌍 Market Expertise</h3>
									<p>Deep understanding of African business landscape and emerging market dynamics</p>
								</div>
								<div className="feature-item">
									<h3>🤝 Customer Focus</h3>
									<p>Experienced retail and operations professionals who understand our customers' daily challenges</p>
								</div>
							</div>
						</div>
					</section>

					<section className="culture-section">
						<div className="section-card mission-card">
							<h2>Our Company Culture</h2>
							<p>
								At MyDuka, we foster an environment where innovation thrives, diversity is celebrated, and every team member is empowered to make a meaningful impact. Our culture is built on collaboration, continuous learning, and a shared
								commitment to transforming how businesses operate across Africa.
							</p>
							<p>
								We believe in remote-first work policies, flexible schedules, and creating opportunities for professional growth. Our team spans multiple countries and time zones, yet we remain united by our common purpose: empowering
								businesses to achieve their full potential through technology.
							</p>
						</div>
					</section>

					<section className="achievements-section">
						<div className="section-card">
							<div className="card-icon">🏆</div>
							<h2>Our Achievements</h2>
							<p>
								Since our inception, MyDuka has achieved numerous milestones that reflect our commitment to excellence and innovation in the business technology sector. These accomplishments demonstrate our growing impact on the African
								business ecosystem.
							</p>
							<div className="features-grid">
								<div className="feature-item">
									<h3>🌟 Industry Recognition</h3>
									<p>Winner of the East Africa Tech Innovation Award 2023 for Best Business Solution</p>
								</div>
								<div className="feature-item">
									<h3>📈 Market Growth</h3>
									<p>Serving over 5,000 active businesses across Kenya, Uganda, and Tanzania</p>
								</div>
								<div className="feature-item">
									<h3>💰 Investment Success</h3>
									<p>Secured $2.5M in Series A funding from leading African venture capital firms</p>
								</div>
								<div className="feature-item">
									<h3>🔗 Strategic Partnerships</h3>
									<p>Established partnerships with major financial institutions and logistics providers</p>
								</div>
							</div>
						</div>
					</section>

					<section className="values-section">
						<h2 className="values-title">Our Core Values</h2>
						<div className="values-grid">
							<div className="value-card">
								<div className="value-icon">🚀</div>
								<h3>Innovation</h3>
								<p>We continuously push boundaries to develop cutting-edge solutions that anticipate market needs</p>
							</div>
							<div className="value-card">
								<div className="value-icon">🤝</div>
								<h3>Integrity</h3>
								<p>We conduct business with transparency, honesty, and ethical practices in all our relationships</p>
							</div>
							<div className="value-card">
								<div className="value-icon">🌍</div>
								<h3>Impact</h3>
								<p>We measure success by the positive change we create in our customers' businesses and communities</p>
							</div>
							<div className="value-card">
								<div className="value-icon">⚡</div>
								<h3>Excellence</h3>
								<p>We strive for the highest standards in everything we do, from product development to customer service</p>
							</div>
						</div>
					</section>

					<section className="future-section">
						<div className="section-card">
							<div className="card-icon">🔮</div>
							<h2>Looking Forward</h2>
							<p>
								As we continue to grow, MyDuka remains committed to our vision of becoming Africa's leading business technology platform. Our roadmap includes expanding into new markets, developing AI-powered analytics tools, and creating
								integrated ecosystems that connect businesses with suppliers, customers, and financial services.
							</p>
							<p>
								We're investing heavily in research and development, with dedicated teams working on emerging technologies like machine learning, blockchain integration, and IoT connectivity. Our goal is to stay ahead of industry trends while
								maintaining our focus on practical, user-friendly solutions that deliver real business value.
							</p>
							<p>
								The future of business in Africa is digital, and MyDuka is proud to be at the forefront of this transformation, empowering the next generation of African entrepreneurs and business leaders with the tools they need to succeed in
								a global marketplace.
							</p>
						</div>
					</section>

					<section className="contact-section">
						<div className="section-card mission-card">
							<h2>Join Our Journey</h2>
							<p>
								Whether you're a potential customer, partner, investor, or someone who shares our passion for transforming African business, we'd love to hear from you. At MyDuka, we believe that great things happen when innovative minds come
								together to solve real-world challenges.
							</p>
							<p>Visit our offices in Nairobi, reach out to us online, or follow our journey on social media. Together, we're not just building software – we're building the future of business in Africa, one solution at a time.</p>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
