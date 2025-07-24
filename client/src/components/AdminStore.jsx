import axios from 'axios';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MyTextInput } from '../utils/formElements';

export default function AdminStore({ store }) {
	const addClerk = () => {
		axios.post('/api/clerk', {});
	};

	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div className="card clerks">
				<h1>Clerks</h1>
				<div>
					{store?.users
						?.filter((user) => user.account_type === 'clerk')
						.map((clerk) => {
							return (
								<div key={clerk.id}>
									<p>{clerk.name}</p>
									<button>{clerk.account_status == 'active' ? 'Deactivate' : 'Activate'}</button>
									<button>Remove</button>
								</div>
							);
						})}
				</div>
				<div>
					<button onClick={() => setIsOpen(!isOpen)}>{isOpen ? '-' : '+'}</button>
					{isOpen && (
						<Formik
							initialValues={{ name: '', email: '', password: '', account_type: 'clerk' }}
							validationSchema={Yup.object({
								name: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
								email: Yup.string().email('Invalid email address').required('Required'),
								password: Yup.string().min(8, 'Must be 8 characters or more').required('Required'),
								account_type: Yup.string().oneOf(['merchant', 'admin', 'clerk']).required('Required'),
							})}
							onSubmit={(values, { setSubmitting }) => {
								axios
									.post('/api/clerk', {
										name: values.name,
										email: values.email,
										password: values.password,
										account_type: values.account_type,
									})
									.then(() => {
										setIsOpen(false);
									})
									.catch((err) => {
										console.log(err);
									});
								setSubmitting(false);
							}}>
							<Form>
								<MyTextInput label="Name" name="name" type="text" />
								<MyTextInput label="Email" name="email" type="email" />
								<MyTextInput label="Password" name="password" type="password" />
								<button type="submit">Submit</button>
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
									<button>Change status</button>
								</div>
							);
						})}
				</div>
			</div>
			<div className="card supply-requests">
				<h1>Supply Requests</h1>
				<div className="pending">
					{store?.supply_requests
						?.filter((request) => request.status === 'pending')
						.map((request) => {
							return (
								<div key={request.id}>
									<p>Product: {store.products.find((product) => product.id === request.product_id).name}</p>
									<p>Quantity: {request.quantity}</p>
									<p>Date: {request.created_at.split('T').join(', ').split('.')[0]}</p>
									<button>Approve</button>
									<button>Deny</button>
								</div>
							);
						})}
				</div>
				<div className="approved">
					{store?.supply_requests
						?.filter((request) => request.status === 'approved')
						.map((request) => {
							return (
								<div key={request.id}>
									<p>Product: {store.products.find((product) => product.id === request.product_id).name}</p>
									<p>Quantity: {request.quantity}</p>
									<p>Date: {request.created_at.split('T').join(', ').split('.')[0]}</p>
								</div>
							);
						})}
				</div>
				<div className="denied">
					{store?.supply_requests
						?.filter((request) => request.status === 'denied')
						.map((request) => {
							return (
								<div key={request.id}>
									<p>Product: {store.products.find((product) => product.id === request.product_id).name}</p>
									<p>Quantity: {request.quantity}</p>
									<p>Date: {request.created_at.split('T').join(', ').split('.')[0]}</p>
								</div>
							);
						})}
				</div>
			</div>
		</>
	);
}
