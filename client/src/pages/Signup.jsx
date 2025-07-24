import { Form, Formik } from 'formik';
import { MyTextInput } from '../utils/formElements';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import pic1 from '../assets/pic1.svg';
import pic2 from '../assets/pic2.svg';

export default function Signup() {
	const navigate = useNavigate();
	const token = useParams()?.token;
	const [email, setEmail] = useState('');
	useEffect(() => {
		if (token) {
			axios
				.get('/api/verify-token')
				?.then((res) => {
					setEmail(res.data.email);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [token]);
	return (
		<div className="form-container">
			<h1>Create {token ? 'an admin account' : 'a merchant account'}</h1>
			<p>
				{!token
					? 'Manage your inventory and cashflow with ease. Get real-time insights into your sales and inventory turnover on-the-go.'
					: 'Create an admin account to manage store inventory and cashflow with ease. Get real-time insights into your sales and inventory turnover on-the-go.'}
			</p>
			<Formik
				initialValues={{ name: '', email: email, password: '' }}
				validationSchema={Yup.object({
					name: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
					email: Yup.string().email('Invalid email address').required('Required'),
					password: Yup.string().min(8, 'Must be 8 characters or more').required('Required'),
				})}
				onSubmit={(values, { setSubmitting }) => {
					axios
						.post('/api/signup', {
							name: values.name,
							email: values.email,
							password: values.password,
							account_type: token ? 'admin' : 'merchant',
						})
						.then(() => {
							navigate('/login');
						})
						.catch((err) => {
							console.log(err);
						});
					setSubmitting(false);
				}}>
				<Form>
					<div>
						<MyTextInput label="Name" name="name" type="text" />
						{!token ? <MyTextInput label="Email" name="email" type="email" /> : <MyTextInput label="Email" name="email" type="email" disabled />}
						<MyTextInput label="Password" name="password" type="password" />
					</div>
					<button type="submit">Submit</button>
				</Form>
			</Formik>
			<img src={pic1} alt="Woman making an order" />
			<img src={pic2} alt="E-commerce core features" />
		</div>
	);
}
