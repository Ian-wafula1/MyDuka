import { createContext } from 'react';
import { useState } from 'react';
import {clerkObj} from '../utils/userObjects';

const AppContext = createContext();

function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(clerkObj);
	return <AppContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AppContext.Provider>;
}

export { AppContext, AppProvider };
