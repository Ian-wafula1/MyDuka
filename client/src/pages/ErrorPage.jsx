import { useRouteError, useNavigate } from 'react-router-dom';
import '../styles/errorPage.css';
import errorImage from '../assets/error.svg';

export default function ErrorPage() {
        
        // let title = 'Something went wrong';
	// let message = "We're having trouble loading this page";
        
	// if (error?.status === 404) {
                // 	title = 'Page not found';
                // 	message = "This page doesn't exist or has been moved";
                // } else if (error?.status >= 500) {
                        // 	title = 'Server error';
                        // 	message = "We're working to fix this issue";
                        // }
                        
        const error = useRouteError();
        const navigate = useNavigate();

        let title = 'An error occurred';
	let message = 'Something went wrong while processing your request';

	if (error?.status === 404) {
		title = 'Page not found';
		message = "This page doesn't exist or has been moved";
	} else if (error?.status >= 500) {
		title = 'Server error';
		message = "We're working to fix this issue";
	}

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleGoHome = () => {
		navigate('/');
	};

	return (
		<div className="error-page">
			{/* Space reserved for custom image */}
			<div><img src={errorImage} alt="error image" /></div>

			<div className="error-content">
				<div className="error-status">Error {error?.status || 'Unknown'}</div>
				<h1 className="error-title">{title}</h1>
				<p className="error-message">{message}</p>
			</div>

			<div className="error-actions">
				<button className="error-btn error-btn-primary" onClick={handleGoHome}>
					Go Home
				</button>
				<button className="error-btn error-btn-secondary" onClick={handleGoBack}>
					Go Back
				</button>
			</div>
		</div>
	);
}
