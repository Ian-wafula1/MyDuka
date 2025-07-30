import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/reset/modern-normalize.css';
import './styles/reset/custom-reset.css';
import './index.css';
import { AppProvider } from './context/AppContext.jsx';
import { MerchantStoreProvider } from './context/MerchantStoreContext.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './routes.jsx';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AppProvider>
            <MerchantStoreProvider>
				<RouterProvider router={router} />
			</MerchantStoreProvider>
        </AppProvider>
	</StrictMode>
);
