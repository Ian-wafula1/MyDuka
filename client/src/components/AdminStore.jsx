import axios from 'axios';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MyTextInput } from '../utils/formElements';

export default function AdminStore({ store, setStore }) {

	const [isOpen, setIsOpen] = useState(false);

    function removeClerk() {
        axios.delete(`/api/users/clerk/${this.id}`)
        .then(() => {
            setStore(store => {
                return {
                    ...store,
                    users: store.users.filter(user => user.id !== this.id && user.account_type === 'clerk')
                }
            })
            console.log(`Clerk ${this.name} removed`)
        })
        .catch(err => console.log(err))
    }

    function changeAccountStatus() {
        axios.patch(`/api/users/clerk/${this.id}`, {
            account_status: this.account_status === 'active' ? 'inactive' : 'active'
        })
        .then(() => {
            setStore(store => {
                return {
                    ...store,
                    users: store.users.map(user => {
                        if (user.id === this.id) {
                            return {
                                ...user,
                                account_status: user.account_status === 'active' ? 'inactive' : 'active'
                            }
                        }
                        return user
                    })
                }
            })
        })
        .catch(err => console.log(err))
    }

    function changeEntryStatus() {
        axios.patch(`/api/entries/${this.id}`, {
            payment_status: this.payment_status === 'pending' ? 'paid' : 'pending'
        })
        .then(() => {
            setStore(store => {
                return {
                    ...store,
                    entries: store.entries.map(entry => {
                        if (entry.id === this.id) {
                            return {
                                ...entry,
                                payment_status: entry.payment_status === 'pending' ? 'paid' : 'pending'
                            }
                        }
                        return entry
                    })
                }
            })
        })
        .catch(err => console.log(err))
    }

    function handleSupplyRequest(action) {
        // axios.patch(`/api/supply-requests/${this.id}`, {
        //     status: action
        // })
        // .then(() => {
        // })
        setStore(store => {
            return {
                ...store,
                supply_requests: store.supply_requests.map(request => {
                    if (request.id === this.id) {
                        return {
                            ...request,
                            status: action
                        }
                    }
                    return request
                })
            }
        })
        .catch(err => console.log(err))
    }

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
                                    <p>{clerk.email}</p>
                                    <p>{clerk.account_status}</p>
									<button onClick={changeAccountStatus.bind(clerk)}>{clerk.account_status == 'active' ? 'Deactivate' : 'Activate'}</button>
									<button onClick={removeClerk.bind(clerk)}>Remove</button>
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
									<button onClick={changeEntryStatus.bind(entry)}>Change status</button>
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
                                    <p>Status: {request.status}</p>
									<button onClick={() => handleSupplyRequest.call(request, 'approved')}>Approve</button>
									<button onClick={() => handleSupplyRequest.call(request, 'denied')}>Deny</button>
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
                                    <p>Status: {request.status}</p>
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
                                    <p>Status: {request.status}</p>
								</div>
							);
						})}
				</div>
			</div>
		</>
	);
}
