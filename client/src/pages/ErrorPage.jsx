// ErrorPage.jsx
import { useRouteError, useNavigate } from 'react-router-dom';

export default function ErrorPage() {
        const error = useRouteError();
        const navigate = useNavigate();

        let title = "Something went wrong";
        let message = "We're having trouble loading this page";

        if (error?.status === 404) {
                title = "Page not found";
                message = "This page doesn't exist or has been moved";
        } else if (error?.status >= 500) {
                title = "Server error";
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
                        <h1>{title}</h1>
                        <p>{message}</p>

                        <div className="error-actions">
                                <button onClick={handleGoHome}>Go home</button>
                                <button onClick={handleGoBack}>Go back</button>
                        </div>
                </div>
        );
}