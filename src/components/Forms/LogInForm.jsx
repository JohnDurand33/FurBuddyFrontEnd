import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login-lite';

const LoginForm = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleEmailPasswordLogin = async (values, { setSubmitting }) => {
        try {
            const res = await axios.post('/auth/login', values);
            localStorage.setItem('access_token', res.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const res = await axios.post('/auth/social-login', {
                token: credential,
                provider: 'google',
            });
            localStorage.setItem('access_token', res.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Google login failed:', err);
        }
    };

    const handleFacebookLoginSuccess = async (response) => {
        try {
            const { accessToken } = response;
            const res = await axios.post('/auth/social-login', {
                token: accessToken,
                provider: 'facebook',
            });
            localStorage.setItem('access_token', res.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Facebook login failed:', err);
        }
    };

    return (
        <GoogleOAuthProvider clientId="226829116506-ka1l30arh8c45j6cipnegc5rp98k13sv.apps.googleusercontent.com">
            <div>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleEmailPasswordLogin}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div>
                                <label>Email:</label>
                                <Field type="email" name="email" />
                                <ErrorMessage name="email" component="div" className="error" />
                            </div>
                            <div>
                                <label>Password:</label>
                                <Field type="password" name="password" />
                                <ErrorMessage name="password" component="div" className="error" />
                            </div>
                            <button type="submit" disabled={isSubmitting}>
                                Login
                            </button>
                        </Form>
                    )}
                </Formik>

                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => {
                        console.log('Google Login Failed');
                    }}
                />
                <FacebookLogin
                    appId="1672022970286921"
                    onSuccess={handleFacebookLoginSuccess}
                    onFailure={() => {
                        console.log('Facebook Login Failed');
                    }}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default LoginForm;