import { createContext } from 'react';
import { useState } from 'react';
import {merchantObj} from '../utils/userObjects';

const AppContext = createContext();

function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(merchantObj);
	return <AppContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AppContext.Provider>;
}

export { AppContext, AppProvider };
