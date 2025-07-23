import { createContext } from 'react';
import { useState } from 'react';

const AppContext = createContext();

const merchantObj = {
	id: 1,
	name: 'Ian',
	email: 'lZL0D@example.com',
	password: 'password',
	account_type: 'merchant',
	stores: [
		{
			id: 12,
			name: 'Kijiji',
			location: '123 Main St',
		},
		{
			id: 13,
			name: 'Amazon',
			location: '123 Side bara',
		},
		{
			id: 14,
			name: 'Ebay',
			location: '123 Side bara',
		},
	],
};

function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(merchantObj);
	return <AppContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AppContext.Provider>;
}

export { AppContext, AppProvider };
