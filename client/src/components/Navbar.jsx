import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg'
import '../styles/navbar.css';

export default function Navbar() {
	const location = useLocation();
    const navigate = useNavigate();
    console.log(location.pathname.split('/'))
	return (
		<div className="navbar">
			<div className="logo" onClick={() => navigate('/')}>
                <img src={logo} alt="Logo" />
                <p>MyDuka</p>
            </div>
			<div>
				{location.pathname === '/' ? (
					<div onClick={() => navigate('/login')}>
						<p>Log in</p>
					</div>
				) : !['login', 'signup', 'reset-password', 'signup'].includes(location.pathname.split('/')[1]) ? (
					<div onClick={() => {
                        localStorage.clear();
                        navigate('/');
                    }}>
						<p>Log out</p>
					</div>
				) : null}
			</div>
		</div>
	);
}
