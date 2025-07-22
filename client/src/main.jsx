import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppProvider } from './context/AppContext.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './routes.jsx';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AppProvider>
            <RouterProvider router={router} />
        </AppProvider>
	</StrictMode>
);
