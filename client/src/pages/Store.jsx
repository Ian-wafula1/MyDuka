import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AppContext } from '../context/AppContext';
import MerchantStore from '../components/MerchantStore';
import AdminStore from '../components/AdminStore';
import ClerkStore from '../components/ClerkStore';
import axios from 'axios';
import '../styles/Store.css';

export default function Store() {
	const { currentUser, setCurrentUser } = useContext(AppContext);
	const { id } = useParams();
	const [store, setStore] = useState(null);

	useEffect(() => {
		axios.get(`/api/stores/${id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
		.then((res) => setStore(res.data))
		.catch((err) => console.log(err))	
	}, [id])

	return (
		<div className="store-page">
			<Sidebar />
			<div className="store-content">
				<div className="store-header">
					<h1 className="store-title">{store?.name || 'Store'}</h1>
				</div>
				<div>
					{currentUser?.account_type === 'merchant' ? (
						<MerchantStore store={store} setStore={setStore} />
					) : currentUser?.account_type === 'admin' ? (
						<AdminStore store={store} setStore={setStore} currentUser={currentUser} setCurrentUser={setCurrentUser} />
					) : currentUser?.account_type === 'clerk' ? (
						<ClerkStore store={store} setStore={setStore} />
					) : null}
				</div>
			</div>
		</div>
	);
}
