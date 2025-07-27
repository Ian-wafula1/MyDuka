import ProductsCard from './ProductsCard';
import { Field, Form, Formik } from 'formik';
import { MySelect, MyTextInput } from '../utils/formElements';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';

export default function ClerkStore({ store, setStore }) {
	const [isOpen, setIsOpen] = useState({
		products: false,
		entries: false,
		supplyRequests: false,
		transactions: false,
	});
	const [searchTerm, setSearchTerm] = useState('');
	return (
		<>
			<div data-testid="products-card" className="card products">
				<h1>Products</h1>
				<div className="search">
					<input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
					<button>Search</button>
				</div>
				<div>
					{store?.products
						?.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
						.map((product) => {
							return (
								<div key={product.id}>
									<p>{product.name}</p>
									<p>In stock: {product.quantity_in_stock}</p>
									<p>Spoilt: {product.quantity_spoilt}</p>
									<p>Buying Price: {product.buying_price}</p>
									<p>Selling Price: {product.selling_price}</p>
								</div>
							);
						})}
				</div>
				<div>
					<button onClick={() => setIsOpen((x) => ({ ...x, products: !x.products }))}>{isOpen.products ? 'Close' : 'Add Product'}</button>
					{isOpen.products && (
						<Formik
							initialValues={{
								name: '',
								buying_price: '',
								selling_price: '',
								quantity_in_stock: '',
								quantity_spoilt: '',
							}}
							validationSchema={Yup.object({
								name: Yup.string().required(),
								buying_price: Yup.number().moreThan(0).required(),
								selling_price: Yup.number().moreThan(0).required(),
								quantity_in_stock: Yup.number().required(),
								quantity_spoilt: Yup.number().required(),
							})}
							onSubmit={(values) => {
								axios
									.post('http://localhost:5000/products', values)
									.then((res) => {
										setStore((x) => ({ ...x, products: [...x.products, res.data] }));
										setIsOpen((x) => ({ ...x, products: false }));
									})
									.catch((err) => {
										console.log(err);
									});
							}}>
							<Form>
								<MyTextInput name="name" type="text" label="Product Name" />
								<MyTextInput name="buying_price" type="number" label="Buying Price" />
								<MyTextInput name="selling_price" type="number" label="Selling Price" />
								<MyTextInput name="quantity_in_stock" type="number" label="Quantity In Stock" />
								<MyTextInput name="quantity_spoilt" type="number" label="Quantity Spoilt" />
								<button type="submit">Add Product</button>
							</Form>
						</Formik>
					)}
				</div>
			</div>
			<div className="card entries">
				<h1>Entries</h1>
				<div>
					{store?.entries
						?.sort((a) => (a.payment_status !== 'pending' ? 1 : -1))
						.map((entry) => {
							return (
								<div key={entry.id}>
									<p>Product: {store.products.find((product) => product.id === entry.product_id).name}</p>
									<p>Quantity: {entry.quantity}</p>
									<p>Status: {entry.payment_status}</p>
									<p>Total: {entry.total_sum}</p>
									<p>Date: {entry.created_at.split('T').join(', ').split('.')[0]}</p>
								</div>
							);
						})}
				</div>
				<div>
					<button onClick={() => setIsOpen((x) => ({ ...x, entries: !x.entries }))}>{isOpen.entries ? 'Close' : 'Add Entry'}</button>
					{
						<div style={isOpen.entries ? { display: 'block' } : { display: 'none' }}>
							<Formik
								initialValues={{ product_name: '', quantity: 1, payment_status: 'pending' }}
								validationSchema={Yup.object({
									product_name: Yup.string().required('Required'),
									quantity: Yup.number().moreThan(0).required('Required'),
									payment_status: Yup.string().oneOf(['pending', 'paid']).required('Required'),
								})}
								onSubmit={(values, { setSubmitting }) => {
									const product = store?.products?.find((product) => product.id === values.product_id);

									axios
										.post('/api/entries', {
											product_name: values.product_name,
											quantity: values.quantity,
											payment_status: values.payment_status,
											total_sum: values.quantity * product.buying_price,
											store_id: store.id,
										})
										.then((res) => {
											setIsOpen((x) => ({ ...x, entries: false }));
											setStore((x) => ({...x, entries: [...x.entries, res.data],}));
										})
										.catch((err) => {
											console.log(err);
										});
									setSubmitting(false);
								}}>
								{({ values }) => (
									<Form>
										<MySelect data-testid="product-select" name="product_name" label="Product Name">
											{store.products.map((product) => {
												return (
													<option key={product.id} value={product.name}>
														{product.name}
													</option>
												);
											})}
										</MySelect>
										<MySelect data-testid="payment-select" name="payment_status" label="Payment Status">
											<option value="pending">Pending</option>
											<option value="paid">Paid</option>
										</MySelect>
										<MyTextInput data-testid="quantity-input" name="quantity" type="number" label="Quantity" />
										<div className="total_sum">
											Total Sum:{' '}
											<span>
												{(() => {
													const product = store?.products?.find((product) => product.name.toLowerCase() === values?.product_name.toLowerCase());
													return product ? `$${+product?.buying_price * values?.quantity}` : 'N/A';
												})()}
											</span>
										</div>
										<button data-testid="submit-entry" type="submit">Submit</button>
									</Form>
								)}
							</Formik>
						</div>
					}
				</div>
			</div>
			<div className="card supply-requests">
				<h1>Supply Requests</h1>
				<div>
					{store?.supply_requests?.map((request) => {
						return (
							<div key={request.id}>
								<p>Product: {store.products.find((product) => product.id === request.product_id).name}</p>
								<p>Quantity: {request.quantity}</p>
								<p>Date: {request.created_at.split('T').join(', ').split('.')[0]}</p>
								<p>Status: {request.status}</p>
							</div>
						);
					})}
				</div>
				<div>
					<button onClick={() => setIsOpen((x) => ({ ...x, supplyRequests: !x.supplyRequests }))}>{isOpen.supplyRequests ? 'Close' : 'Add Request'}</button>
					{
						<div style={isOpen.supplyRequests ? { display: 'block' } : { display: 'none' }}>
							<Formik
								initialValues={{ product_name: '', quantity: 1 }}
								validationSchema={Yup.object({
									product_name: Yup.string().required('Required'),
									quantity: Yup.number().moreThan(0).required('Required'),
								})}
								onSubmit={(values, { setSubmitting }) => {
									axios
										.post('/api/supply-requests', {
											product_name: values.product_name,
											quantity: values.quantity,
											store_id: store.id,
										})
										.then((res) => {
											setIsOpen((x) => ({ ...x, supplyRequests: false }));
											setStore((x) => ({
												...x,
												supply_requests: [...x.supply_requests, res.data],
											}))
										})
										.catch((err) => {
											console.log(err);
										});
									setSubmitting(false);
								}}>
								{() => (
									<Form>
										<MySelect name="product_name" label="Product Name">
											{store.products.map((product) => {
												return (
													<option key={product.id} value={product.name}>
														{product.name}
													</option>
												);
											})}
										</MySelect>
										<MyTextInput name="quantity" type="number" label="Quantity" />
										<button type="submit">Submit</button>
									</Form>
								)}
							</Formik>
						</div>
					}
				</div>
			</div>
			<div className="card transactions">
				<h1>Transactions</h1>
				<div>
					{store?.transactions?.map((transaction) => {
						return (
							<div key={transaction.id}>
								<p>Product: {store.products.find((product) => product.id === transaction.product_id).name}</p>
								<p>Quantity: {transaction.quantity}</p>
								<p>Date: {transaction.created_at.split('T').join(', ').split('.')[0]}</p>
								<p>Unit Price: ${transaction.unit_price}</p>
								<p>Total: ${transaction.unit_price * transaction.quantity}</p>
							</div>
						);
					})}
				</div>
				<div>
					<button onClick={() => setIsOpen((x) => ({ ...x, transactions: !x.transactions }))}>{isOpen.transactions ? 'Close' : 'Add Transaction'}</button>
					<div style={isOpen.transactions ? { display: 'block' } : { display: 'none' }}>
							<Formik
								initialValues={{ product_name: '', quantity: 1 }}
								validationSchema={Yup.object({
									product_name: Yup.string().required('Required'),
									quantity: Yup.number().moreThan(0).required('Required'),
								})}
								onSubmit={(values, { setSubmitting }) => {
									axios
										.post('/api/transactions', {
											product_name: values.product_name,
											quantity: values.quantity,
											store_id: store.id,
										})
										.then((res) => {
											setIsOpen((x) => ({ ...x, transactions: false }));
											setStore((x) => ({
												...x,
												transactions: [...x.transactions, res.data],
											}))
										})
										.catch((err) => {
											console.log(err);
										});
									setSubmitting(false);
								}}>
								{() => (
									<Form>
										<MySelect name="product_name" label="Product Name">
											{store.products.map((product) => {
												return (
													<option key={product.id} value={product.name}>
														{product.name}
													</option>
												);
											})}
										</MySelect>
										<MyTextInput name="quantity" type="number" label="Quantity" />
										<button type="submit">Submit</button>
									</Form>
								)}
							</Formik>	
						</div>
				</div>
			</div>
		</>
	)
}
