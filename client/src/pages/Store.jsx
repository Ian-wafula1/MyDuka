import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AppContext } from '../context/AppContext';
import MerchantStore from '../components/MerchantStore';
import AdminStore from '../components/AdminStore';
import ClerkStore from '../components/ClerkStore';
import axios from 'axios';

export default function Store() {
	const { currentUser, setCurrentUser } = useContext(AppContext);
	const { id } = useParams();
	const [store, setStore] = useState(null)

	useEffect(() => {
		console.log('fetching')
		axios.get(`/api/stores/${id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		}).then(res => {
			console.log('reached')
			console.log(res)
			setStore(res.data.store)
		}).catch(err => {
			console.log(err)
		})
	}, [id])
	console.log(store)
	// function handleUrlChange(id) {
	// 	setStore(()=>currentUser?.stores?.find((store) => store.id === Number(id)))
	// }
	console.log(currentUser)
	return (
		<>
			<Sidebar />
			<div>
				<h1>{store?.name || 'Store'}</h1>
                <div>
                    {currentUser?.account_type === 'merchant' ? (
                        <MerchantStore />
                    ): currentUser?.account_type === 'admin' ? (
                        <AdminStore store={store} setStore={setStore} currentUser={currentUser} setCurrentUser={setCurrentUser} />
					):  currentUser?.account_type === 'clerk' ? (
						<ClerkStore store={store} />
					): null}
                </div>
			</div>
		</>
	);
}
