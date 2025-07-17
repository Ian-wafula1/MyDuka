// ResetPassword.jsx
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input } from '../utils/FormElements';
import axios from 'axios';

const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export default function ResetPassword() {
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const { data } = await axios.post('/api/reset-password', values);
      setStatus({ type: 'success', message: data.message });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.error || 'Something went wrong' 
      });
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <Formik
        initialValues={{ name: '', email: '', newPassword: '' }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ status, isSubmitting }) => (
          <Form>
            <Input label="Name" name="name" type="text" />
            <Input label="Email" name="email" type="email" />
            <Input label="New Password" name="newPassword" type="password" />
            
            {status && (
              <div className={message ${status.type}}>
                {status.message}
              </div>
            )}
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}