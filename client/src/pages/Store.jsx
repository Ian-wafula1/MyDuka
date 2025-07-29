import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AppContext } from '../context/AppContext';
import MerchantStore from '../components/MerchantStore';
import AdminStore from '../components/AdminStore';
import ClerkStore from '../components/ClerkStore';
import '../styles/Store.css';

export default function Store() {
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const { id } = useParams();
  const [store, setStore] = useState(
    currentUser?.stores?.find((store) => store.id === Number(id))
  );

  function handleUrlChange(id) {
    setCurrentUser((user) => ({
      ...user,
      stores: user.stores.map((x) => (x.id === store.id ? { ...x, ...store } : x)),
    }));
    setStore(currentUser?.stores?.find((store) => store.id === Number(id)));
  }

  return (
    <div className="store-page">
      <Sidebar handleUrlChange={handleUrlChange} />
      <div className="store-content">
        <div className="store-header">
          <h1 className="store-title">{store?.name || 'Store'}</h1>
        </div>
        <div>
          {currentUser ? (
            currentUser.account_type === 'merchant' ? (
              <MerchantStore store={store} setStore={setStore} />
            ) : currentUser.account_type === 'admin' ? (
              <AdminStore />
            ) : (
              <ClerkStore />
            )
          ) : (
            <div data-testid="no-user">No user data</div>
          )}
        </div>
      </div>
    </div>
  );
}
