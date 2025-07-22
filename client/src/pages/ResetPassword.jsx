// ResetPassword.jsx
import { Form, Formik } from 'formik';
import { MyTextInput } from '../utils/formElements';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ResetPassword() {
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
                <>
                        <h1>Reset Password</h1>
                        <Formik
                                initialValues={{ name: '', email: email, newPassword: '' }}
                                validationSchema={Yup.object({
                                        name: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
                                        email: Yup.string().email('Invalid email address').required('Required'),
                                        newPassword: Yup.string().min(8, 'Must be 8 characters or more').required('Required'),
                                })}
                                onSubmit={(values, { setSubmitting }) => {
                                        axios
                                                .post('/api/reset-password', {
                                                        name: values.name,
                                                        email: values.email,
                                                        newPassword: values.newPassword,
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
                                        <MyTextInput label="Name" name="name" type="text" />
                                        {!token ? <MyTextInput label="Email" name="email" type="email" /> : <MyTextInput label="Email" name="email" type="email" disabled />}
                                        <MyTextInput label="New Password" name="newPassword" type="password" />
                                        <button type="submit">Submit</button>
                                </Form>
                        </Formik>
                </>
        );
}