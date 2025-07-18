import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import ErrorPage from './pages/ErrorPage';
import { Navigate } from 'react-router-dom';
import App from './App';

const routes = [
	{
		path: '/',
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: '/login',
				element: <Login />,
			},
			{
				path: '/signup',
				element: <Signup />,
			},
            {
                path: 'signup/:token',
                element: <Signup />,
            },
			{
				path: '/reset-password',
				element: <ResetPassword />,
			},
			{
				path: '*',
				element: <Navigate to="/" />,
			},
		],
	},
];

export default routes;
