import { NavLink, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/sidebar.css';

export default function Sidebar({ handleUrlChange }) {
	const { currentUser: user } = useContext(AppContext);
	const [isOpen, setIsOpen] = useState(false);
	// https://ui-avatars.com/api/?name=${user?.name?.at(0)}&format=svg
	return (
		<nav className="sidebar">
			<ul>
				<li>
					{/* <DashboardIcon style={{width: '1.5rem', height: '1.5rem', stroke: '#fff'}} /> */}
					<svg style={{ transform: 'scale(1.2)' }} viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
						<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							{' '}
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M9.918 10.0005H7.082C6.66587 9.99708 6.26541 10.1591 5.96873 10.4509C5.67204 10.7427 5.50343 11.1404 5.5 11.5565V17.4455C5.5077 18.3117 6.21584 19.0078 7.082 19.0005H9.918C10.3341 19.004 10.7346 18.842 11.0313 18.5502C11.328 18.2584 11.4966 17.8607 11.5 17.4445V11.5565C11.4966 11.1404 11.328 10.7427 11.0313 10.4509C10.7346 10.1591 10.3341 9.99708 9.918 10.0005Z"
								strokeWidth="1.5"
								stroke="#fff"
								strokeLinecap="round"
								strokeLinejoin="round"></path>{' '}
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								stroke="#fff"
								d="M9.918 4.0006H7.082C6.23326 3.97706 5.52559 4.64492 5.5 5.4936V6.5076C5.52559 7.35629 6.23326 8.02415 7.082 8.0006H9.918C10.7667 8.02415 11.4744 7.35629 11.5 6.5076V5.4936C11.4744 4.64492 10.7667 3.97706 9.918 4.0006Z"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"></path>{' '}
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								stroke="#fff"
								d="M15.082 13.0007H17.917C18.3333 13.0044 18.734 12.8425 19.0309 12.5507C19.3278 12.2588 19.4966 11.861 19.5 11.4447V5.55666C19.4966 5.14054 19.328 4.74282 19.0313 4.45101C18.7346 4.1592 18.3341 3.9972 17.918 4.00066H15.082C14.6659 3.9972 14.2654 4.1592 13.9687 4.45101C13.672 4.74282 13.5034 5.14054 13.5 5.55666V11.4447C13.5034 11.8608 13.672 12.2585 13.9687 12.5503C14.2654 12.8421 14.6659 13.0041 15.082 13.0007Z"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"></path>{' '}
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M15.082 19.0006H17.917C18.7661 19.0247 19.4744 18.3567 19.5 17.5076V16.4936C19.4744 15.6449 18.7667 14.9771 17.918 15.0006H15.082C14.2333 14.9771 13.5256 15.6449 13.5 16.4936V17.5066C13.525 18.3557 14.2329 19.0241 15.082 19.0006Z"
								strokeWidth="1.5"
								stroke="#fff"
								strokeLinecap="round"
								strokeLinejoin="round"></path>{' '}
						</g>
					</svg>
					<NavLink to={`/dashboard`}>Dashboard</NavLink>
				</li>
				{/* <li>
					<NavLink to={`/profile`}>Profile</NavLink>
				</li> */}
				<li>
					<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
						<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							{' '}
							<path
								d="M20.9447 2H3.05529C2.88838 1.99997 2.72644 2.0581 2.59616 2.1648C2.46588 2.27151 2.37503 2.42042 2.33858 2.587L1 7.75C1 8.34674 1.23178 8.91903 1.64437 9.34099C2.05695 9.76295 2.61652 10 3.2 10C3.78348 10 4.34305 9.76295 4.75563 9.34099C5.16821 8.91903 5.4 8.34674 5.4 7.75C5.4 8.34674 5.63179 8.91903 6.04437 9.34099C6.45695 9.76295 7.01652 10 7.6 10C8.18348 10 8.74305 9.76295 9.15563 9.34099C9.56821 8.91903 9.8 8.34674 9.8 7.75C9.8 8.34674 10.0318 8.91903 10.4444 9.34099C10.8569 9.76295 11.4165 10 12 10C12.5835 10 13.1431 9.76295 13.5556 9.34099C13.9682 8.91903 14.2 8.34674 14.2 7.75C14.2 8.34674 14.4318 8.91903 14.8444 9.34099C15.2569 9.76295 15.8165 10 16.4 10C16.9835 10 17.5431 9.76295 17.9556 9.34099C18.3682 8.91903 18.6 8.34674 18.6 7.75C18.6 8.34674 18.8318 8.91903 19.2444 9.34099C19.6569 9.76295 20.2165 10 20.8 10C21.3835 10 21.9431 9.76295 22.3556 9.34099C22.7682 8.91903 23 8.34674 23 7.75L21.6604 2.587C21.6244 2.42041 21.5337 2.27142 21.4036 2.16467C21.2734 2.05793 21.1115 1.99983 20.9447 2Z"
								stroke="#fff"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"></path>{' '}
							<path
								d="M2.75 13C2.75 12.5858 2.41421 12.25 2 12.25C1.58579 12.25 1.25 12.5858 1.25 13H2.75ZM22.75 13C22.75 12.5858 22.4142 12.25 22 12.25C21.5858 12.25 21.25 12.5858 21.25 13H22.75ZM1.25 13V20H2.75V13H1.25ZM4 22.75H20V21.25H4V22.75ZM22.75 20V13H21.25V20H22.75ZM20 22.75C21.5188 22.75 22.75 21.5188 22.75 20H21.25C21.25 20.6904 20.6904 21.25 20 21.25V22.75ZM1.25 20C1.25 21.5188 2.48122 22.75 4 22.75V21.25C3.30964 21.25 2.75 20.6904 2.75 20H1.25Z"
								strokeWidth=".3"
								fill="#fff"></path>{' '}
							<rect x="6" y="14" width="4" height="4" rx="0.5" stroke="#fff" strokeWidth="1.5"></rect> <path d="M18 22V15.5C18 15.2239 17.7761 15 17.5 15H14.5C14.2239 15 14 15.2239 14 15.5V22" stroke="#fff" strokeWidth="1.5"></path>{' '}
						</g>
					</svg>
					<div className="dropdown">
						<button className="dropbtn" onClick={() => setIsOpen(!isOpen)}>
							Stores
						</button>
						<svg style={!isOpen ? { transform: 'rotate(-90deg)' } : { transform: 'rotate(0deg)' }} viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
							<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
							<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
							<g id="SVGRepo_iconCarrier">
								{' '}
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z"
									fill="#fff"></path>{' '}
							</g>
						</svg>
						<div style={isOpen ? { display: 'flex' } : { display: 'none' }} className="dropdown-content">
							{user?.stores?.map((store) => {
								return (
									<NavLink onClick={() => handleUrlChange(store.id)} key={store.id} to={`/store/${store.id}`}>
										{store.name}
									</NavLink>
								);
							})}
						</div>
					</div>
				</li>
				<li>
					<svg fill="#fff" viewBox="0 0 52 52" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
						<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
						<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							<path d="M26,52A26,26,0,0,1,22.88.19,25.78,25.78,0,0,1,34.73,1.5a2,2,0,1,1-1.35,3.77,22,22,0,0,0-21,38,22,22,0,0,0,35.41-20,2,2,0,1,1,4-.48A26,26,0,0,1,26,52Z"></path>
							<path d="M26,43.86a2,2,0,0,1-2-2V22.66a2,2,0,1,1,4,0v19.2A2,2,0,0,1,26,43.86Z"></path>
							<circle cx="26" cy="15.71" r="2.57"></circle>
						</g>
					</svg>
					<NavLink to={`/about`}>About</NavLink>
				</li>
				<li>
					<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#fff">
						<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
						<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							{' '}
							<g color="#fff" fill="#fff" fontWeight="400" white-space="normal">
								{' '}
								<path
									d="M8 1c-.529 0-1.032.098-1.494.295-.46.188-.868.463-1.207.82l-.002.004-.002.002a3.82 3.82 0 0 0-.766 1.28 4.551 4.551 0 0 0-.27 1.6c0 .58.087 1.122.27 1.612.18.482.436.908.766 1.266l.002.002.002.002c.338.356.743.636 1.201.832l.004.002.004.002C6.97 8.907 7.472 9 8 9s1.028-.093 1.49-.281v-.002a3.47 3.47 0 0 0 1.19-.834c.34-.358.6-.786.78-1.27.185-.49.272-1.031.272-1.613h.008c0-.573-.087-1.109-.27-1.598a3.692 3.692 0 0 0-.78-1.283 3.332 3.332 0 0 0-1.196-.824A3.78 3.78 0 0 0 8 1zm0 1c.406 0 .77.073 1.102.215l.01.004.01.002a2.3 2.3 0 0 1 .837.576v.01c.24.253.431.564.569.94v.005c.13.351.194.753.199 1.202V5c0 .482-.072.9-.207 1.262v.002a2.708 2.708 0 0 1-.57.931l-.01.004v.004c-.234.253-.514.45-.848.594A2.889 2.889 0 0 1 8 8c-.41 0-.777-.072-1.11-.207h-.003a2.58 2.58 0 0 1-.838-.582l-.051-.07-.008-.006a2.798 2.798 0 0 1-.523-.871A3.595 3.595 0 0 1 5.259 5c0-.471.071-.886.208-1.25l.002-.002v-.004c.137-.376.324-.684.554-.936l.012-.01c.24-.25.52-.443.85-.578l.006-.004.008-.002C7.229 2.074 7.594 2 8 2zm.03 9.025c-2.882 0-4.43.266-5.579 1.133-.575.434-.954 1.025-1.168 1.713-.214.688-.281 1.212-.283 2.127L2 16c.002-.865.072-1.3.238-1.834.166-.534.412-.903.817-1.209.81-.61 2.162-.934 4.974-.934.77 0 1.407.031 1.971.079v-1.014a27.464 27.464 0 0 0-1.97-.063z"
									fontFamily="Ubuntu"
									letterSpacing="0"
									overflow="visible"
									wordSpacing="0"></path>{' '}
								<path d="M13 11v2h-2v1h2v2h1v-2h2v-1h-2v-2z" fontFamily="sans-serif" overflow="visible"></path>{' '}
							</g>{' '}
						</g>
					</svg>
					<NavLink to={`/contact`}>Contact</NavLink>
				</li>
			</ul>
		</nav>
	);
}
