import { NavLink, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/sidebar.css';

export default function Sidebar() {
	const { currentUser: user } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
	return (
		<nav className="sidebar">
			<ul>
				<li>
					<NavLink to={`/dashboard`}>Dashboard</NavLink>
				</li>
				<li>
					<NavLink to={`/profile`}>Profile</NavLink>
				</li>
				<li>
					<div className='dropdown'>
                        <button className="dropbtn" onClick={() => setIsOpen(!isOpen)}>Stores</button>
                        {isOpen && (
                            <div className='dropdown-content'>
                            {user?.stores?.map((store) => {
                                return (
                                    <NavLink key={store.id} to={`/store/${store.id}`}>
                                        {store.name}
                                    </NavLink>
                                );
                            })}
                        </div>
                        )}
                    </div>
				</li>
                <li>
                    <NavLink to={`/products`}>About</NavLink>
                </li>
                <li>
                    <NavLink to={`/contact`}>Contact</NavLink>
                </li>
			</ul>
		</nav>
	);
}
