import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AppContext } from '../context/AppContext';
import MerchantStore from '../components/MerchantStore';
import AdminStore from '../components/AdminStore';
import ClerkStore from '../components/ClerkStore';

export default function Store() {
	const { currentUser } = useContext(AppContext);
	const { id } = useParams();
	console.log(currentUser);
	const [store, ] = useState(currentUser?.stores?.find((store) => store.id === Number(id)));
	return (
		<>
			<Sidebar />
			<div>
				<h1>{store?.name || 'Store'}</h1>
                <div>
                    {currentUser.account_type === 'merchant' ? (
                        <MerchantStore />
                    ): currentUser.account_type === 'admin' ? (
                        <AdminStore />
                    ):  <ClerkStore />}
                </div>
			</div>
		</>
	);
}
