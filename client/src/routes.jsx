import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import ErrorPage from './pages/ErrorPage';
import Store from './pages/Store';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
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
				path: '/store/:id',
				element: <Store />,
			},
			{
				path: '/about',
				element: <About />,
			},
			{
				path: '/contact',
				element: <Contact />,
			},
			{
				path: '/dashboard',
				element: <Dashboard />,
			},
			{
				path: '/reset-password',
				element: <ResetPassword />,
			},
			{
				path: '/error',
				element: <ErrorPage />,
			},
			{
				path: '*',
				element: <Navigate to="/" />,
			},
		],
	},
];

export default routes;
