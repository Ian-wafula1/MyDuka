import { Form, Formik, Field } from 'formik';
import { MyTextInput, MySelect } from '../utils/formElements';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import pic1 from '../assets/pic1.svg';
import pic2 from '../assets/pic2.svg';
import { useState } from 'react';

export default function ResetPassword() {
	const navigate = useNavigate();
	const [error, setError] = useState(null);

	return (
		<div className="form-container">
			<h1>Reset Password</h1>
			<p>Oopsie! Looks like your password took a vacation. Let’s get you a fresh one.</p>
			<Formik
				initialValues={{ name: '', email: '', newPassword: '', account_type: '' }}
				validationSchema={Yup.object({
					name: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
					email: Yup.string().email('Invalid email address').required('Required'),
					newPassword: Yup.string().min(8, 'Must be 8 characters or more').required('Required'),
					account_type: Yup.string().oneOf(['merchant', 'admin', 'clerk']).required('Required'),
				})}
				onSubmit={(values, { setSubmitting }) => {
					axios
						.post('/api/reset-password', {
							name: values.name,
							email: values.email,
							newPassword: values.newPassword,
							account_type: values.account_type,
						})
						.then(() => {
							navigate('/login');
						})
						.catch((err) => {
							console.log(err);
							setError(err.response.data.error);
						});
					setSubmitting(false);
				}}>
				<Form>
					<div>
						<MyTextInput label="Name" name="name" type="text" />
						<MyTextInput label="Email" name="email" type="email" />
						<MySelect data-testid="account-type" name="account_type">
							<option disabled value="">Select account type</option>
							<option value="merchant">Merchant</option>
							<option value="admin">Admin</option>
							<option value="clerk">Clerk</option>
						</MySelect>

						<MyTextInput label="New Password" name="newPassword" type="password" />
					</div>
					<div>
						{error && <div className="fetch error">{error}</div>}
						<button type="submit">Submit</button>
					</div>
				</Form>
			</Formik>
			<img src={pic1} alt="Woman making an order" />
			<img src={pic2} alt="E-commerce core features" />
		</div>
	);
}
