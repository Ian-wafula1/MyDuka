import { Formik, Form } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import pic1 from '../assets/pic1.svg';
import pic2 from '../assets/pic2.svg';
import * as Yup from 'yup';
import { MyTextInput, MySelect } from '../utils/formElements';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const Login = () => {
	const navigate = useNavigate();
	const { setCurrentUser } = useContext(AppContext);
	const [error, setError] = useState(null);
	return (
		<div className="form-container">
			<h1>Login to MyDuka</h1>
            <p>Ready to log in? Prove you’re you. Or at least someone with really good guessing skills.</p>
			<Formik
				initialValues={{ email: '', password: '', account_type: '' }}
				validationSchema={Yup.object({
					email: Yup.string().email('Invalid email address').required('Required'),
					password: Yup.string().min(8, 'Must be 8 characters or more').required('Required'),
					account_type: Yup.string().oneOf(['merchant', 'admin', 'clerk']).required('Required'),
				})}
				onSubmit={(values, { setSubmitting }) => {
					axios
						.post('/api/login', {
							email: values.email,
							password: values.password,
							account_type: values.account_type,
						})
						.then((res) => {
							localStorage.setItem('token', res.data.token);
							setCurrentUser(res.data.user_dict);
							navigate('/');
						})
						.catch((err) => {
							console.log(err);
							setError(err.response.data.error);
						});
					setSubmitting(false);
				}}>
				{({ isSubmitting }) => (
					<Form>
						<div>
							<MyTextInput label="Email" name="email" type="email" />
							<MyTextInput label="Password" name="password" type="password" />
							<MySelect label="Account Type" name="account_type">
								<option value="merchant">Merchant</option>
								<option value="admin">Admin</option>
								<option value="clerk">Clerk</option>
							</MySelect>
						</div>

						<div>
							{error && <div className="fetch error">{error}</div>}

							<button type="submit" disabled={isSubmitting}>
								Login
							</button>
						</div>
					</Form>
				)}
			</Formik>
			<img src={pic1} alt="Logo" />
			<img src={pic2} alt="Logo" />
		</div>
	);
};

export default Login;
