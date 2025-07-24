import { createContext } from 'react';
import { useState } from 'react';

const AppContext = createContext();

const merchantObj = {
	id: 1,
	name: 'Ian',
	email: 'lZL0D@example.com',
	password: 'password',
	account_type: 'merchant',
	stores: [
		{
			id: 12,
			name: 'Kijiji',
			location: '123 Main St',
			merchant_id: 1,
			created_at: '2022-06-22T00:00:00.000Z',
			users: [
				{
					id: 1,
					name: 'Ian',
					email: 'lZL0D@example.com',
					password: 'password',
					account_type: 'clerk',
					account_status: 'active',
				}, 
				{
					id: 2,
					name: 'John',
					email: 'lZL0D@example.com',
					password: 'password',
					account_type: 'clerk',
					account_status: 'active',
				},
				{
					id: 3,
					name: 'Jane',
					email: 'lZL0D@example.com',
					password: 'password',
					account_type: 'admin',
					account_status: 'active',
				},
				{
					id: 4,
					name: 'Bob',
					email: 'lZL0D@example.com',
					password: 'password',
					account_type: 'admin',
					account_status: 'active',
				}
			], 
			products: [
				{
					id: 1,
					name: 'Apple',
					quantity_in_stock: 10,
					quantity_spoilt: 0,
					buying_price: 10,
					selling_price: 20,
					created_at: '2022-06-22T00:00:00.000Z',
					updated_at: '2022-06-22T00:00:00.000Z',
					store_id: 12,
				},
				{
					id: 2,
					name: 'Banana',
					quantity_in_stock: 10,
					quantity_spoilt: 0,
					buying_price: 10,
					selling_price: 20,
					created_at: '2022-06-22T00:00:00.000Z',
					updated_at: '2022-06-22T00:00:00.000Z',
					store_id: 12,
				},
				{
					id: 3,
					name: 'Orange',
					quantity_in_stock: 10,
					quantity_spoilt: 0,
					buying_price: 10,
					selling_price: 20,
					created_at: '2022-06-22T00:00:00.000Z',
					updated_at: '2022-06-22T00:00:00.000Z',
					store_id: 12,
				},
				{
					id: 4,
					name: 'Pineapple',
					quantity_in_stock: 10,
					quantity_spoilt: 0,
					buying_price: 10,
					selling_price: 20,
					created_at: '2022-06-22T00:00:00.000Z',
					updated_at: '2022-06-22T00:00:00.000Z',
					store_id: 12,
				},
				{
					id: 5,
					name: 'Mango',
					quantity_in_stock: 10,
					quantity_spoilt: 0,
					buying_price: 10,
					selling_price: 20,
					created_at: '2022-06-22T00:00:00.000Z',
					updated_at: '2022-06-22T00:00:00.000Z',
					store_id: 12,
				}
			],
			supply_requests: [
				// id, quantity, status, store_id, created_at, user_id, product_id
				{
					id: 1,
					quantity: 10,
					status: 'pending',
					store_id: 12,
					created_at: '2022-06-22T00:00:00.000Z',
					user_id: 1,
					product_id: 1,
				},
				{
					id: 2,
					quantity: 10,
					status: 'pending',
					store_id: 12,
					created_at: '2022-06-22T00:00:00.000Z',
					user_id: 1,
					product_id: 2,
				}, 
				{
					id: 3,
					quantity: 10,
					status: 'accepted',
					store_id: 12,
					created_at: '2022-06-22T00:00:00.000Z',
					user_id: 1,
					product_id: 3,
				},
				{
					id: 4,
					quantity: 10,
					status: 'accepted',
					store_id: 12,
					created_at: '2022-06-22T00:00:00.000Z',
					user_id: 1,
					product_id: 4,
				},
				{
					id: 5,
					quantity: 10,
					status: 'denied',
					store_id: 12,
					created_at: '2022-06-22T00:00:00.000Z',
					user_id: 1,
					product_id: 5,
				},
				{
					id: 6,
					quantity: 10,
					status: 'denied',
					store_id: 12,
					created_at: '2022-06-22T00:00:00.000Z',
					user_id: 1,
					product_id: 5,
				}
			],
			transactions: [
				// id, quantity, product_id, created_at, unit_price
				{
					id: 1,
					quantity: 10,
					product_id: 1,
					created_at: '2022-06-22T00:00:00.000Z',
					unit_price: 10,
				},
				{
					id: 2,
					quantity: 10,
					product_id: 2,
					created_at: '2022-06-22T00:00:00.000Z',
					unit_price: 10,
				},
				{
					id: 3,
					quantity: 10,
					product_id: 3,
					created_at: '2022-06-22T00:00:00.000Z',
					unit_price: 10,
				},
			]
		},
		{
			id: 13,
			name: 'Amazon',
			location: '123 Main St',
			merchant_id: 1,
			created_at: '2022-06-22T00:00:00.000Z',
			// users: [],
			// products: [],
			// supply_requests: [],
			// transactions: [],
			users: [
				//id, name, email, password, account_type, account_status
				{
					id: 1,
					name: 'Ian',
					email: 'lZL0D@example.com',
					password: 'password',
					account_type: 'clerk',
					account_status: 'active',
				}, 
				{
					id: 2,
					name: 'John',
					email: 'lZL0D@example.com',
					password: 'password',
					account_type: 'clerk',
					account_status: 'active',
				},
				{
					id: 3,
					name: 'Jane',
					email: 'lZL0D@example.com',
					password: 'password',
					account_type: 'admin',
					account_status: 'active',
				},
			],
			products: [
				// id, name, description, quantity, created_at, merchant_id
				{
					id: 1,
					name: 'Product 1',
					description: 'Description 1',
					quantity: 10,
					created_at: '2022-06-22T00:00:00.000Z',
					merchant_id: 1,
				},
				{
					id: 2,
					name: 'Product 2',
					description: 'Description 2',
					quantity: 10,
					created_at: '2022-06-22T00:00:00.000Z',
					merchant_id: 1,
				},
				{
					id: 3,
					name: 'Product 3',
					description: 'Description 3',
					quantity: 10,	
					created_at: '2022-06-22T00:00:00.000Z',
					merchant_id: 1,	
				},
			],
			supply_requests: [
				// id, quantity, status, store_id, created_at, user_id, product_id
				{
					id: 1,
					quantity: 10,
					status: 'accepted',
					store_id: 13,
					created_at: '2022-06-22T00:00:00.000Z',
					user_id: 1,
					product_id: 1,
				},
				{
					id: 2,
					quantity: 10,
					status: 'denied',
					store_id: 13,
					created_at: '2022-06-22T00:00:00.000Z',
					user_id: 1,
					product_id: 2,
				},
				{
					id: 3,
					quantity: 10,
					status: 'pending',
					store_id: 13,
					created_at: '2022-06-22T00:00:00.000Z',
					user_id: 1,
					product_id: 3,
				},
			],
			transactions: [
				// id, quantity, product_id, created_at, unit_price
				{
					id: 1,
					quantity: 10,
					product_id: 1,
					created_at: '2022-06-22T00:00:00.000Z',
					unit_price: 10,
				},
				{
					id: 2,
					quantity: 10,
					product_id: 2,
					created_at: '2022-06-22T00:00:00.000Z',
					unit_price: 10,
				},
				{
					id: 3,
					quantity: 10,
					product_id: 3,
					created_at: '2022-06-22T00:00:00.000Z',
					unit_price: 10,
				},
			]
		},
		{
			id: 14,
			name: 'Ebay',
			location: '123 Main St',
			merchant_id: 1,
			created_at: '2022-06-22T00:00:00.000Z',
			users: [],
			products: [],
			supply_requests: [],
			transactions: [],
		},
	],
};

function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(merchantObj);
	return <AppContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AppContext.Provider>;
}

export { AppContext, AppProvider };
