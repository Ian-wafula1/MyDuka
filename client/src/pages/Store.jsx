import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AppContext } from '../context/AppContext';
import MerchantStore from '../components/MerchantStore';
import AdminStore from '../components/AdminStore';
import ClerkStore from '../components/ClerkStore';

export default function Store() {
	const { currentUser, setCurrentUser } = useContext(AppContext);
	const { id } = useParams();
	const [store, setStore] = useState(currentUser?.stores?.find((store) => store.id === Number(id)))
	function handleUrlChange(id) {
		setCurrentUser(user => {
			return {
				...user,
				stores: user.stores.map(x => {
					if (x.id === store.id) {
						return {
							...x,
							...store
						}
					}
					return {
						...x
					}
				})
			}
		})
		setStore(()=>currentUser?.stores?.find((store) => store.id === Number(id)))
	}
	return (
		<>
			<Sidebar handleUrlChange={handleUrlChange} />
			<div>
				<h1>{store?.name || 'Store'}</h1>
                <div>
                    {currentUser.account_type === 'merchant' ? (
                        <MerchantStore />
                    ): currentUser.account_type === 'admin' ? (
                        <AdminStore store={store} setStore={setStore} currentUser={currentUser} setCurrentUser={setCurrentUser} />
                    ):  <ClerkStore store={store} />}
                </div>
			</div>
		</>
	);
}
