import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login-lite';


const SignUpForm = () => {
    // const navigate = useNavigate();

    // const validationSchema = Yup.object().shape({
    //     email: Yup.string().email('Invalid email format').required('Email is required'),
    //     password: Yup.string()
    //         .min(6, 'Password must be at least 6 characters')
    //         .required('Password is required'),
    //     confirmPassword: Yup.string()
    //         .oneOf([Yup.ref('password'), null], 'Passwords must match')
    //         .required('Confirm Password is required'),
    // });

    // const handleEmailPasswordSignUp = async (values, { setSubmitting }) => {
    //     try {
    //         const res = await axios.post('/auth/signup', {
    //             email: values.email,
    //             password: values.password,
    //         });
    //         localStorage.setItem('access_token', res.data.access_token);
    //         navigate('/dashboard');
    //     } catch (err) {
    //         console.error('Sign-up failed:', err);
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };

    // const handleGoogleSignUpSuccess = async (credentialResponse) => {
    //     try {
    //         const { credential } = credentialResponse;
    //         const res = await axios.post('/auth/social-signup', {
    //             token: credential,
    //             provider: 'google',
    //         });
    //         localStorage.setItem('access_token', res.data.access_token);
    //         navigate('/dashboard');
    //     } catch (err) {
    //         console.error('Google sign-up failed:', err);
    //     }
    // };

    // const handleFacebookSignUpSuccess = async (response) => {
    //     try {
    //         const { accessToken } = response;
    //         const res = await axios.post('/auth/social-signup', {
    //             token: accessToken,
    //             provider: 'facebook',
    //         });
    //         localStorage.setItem('access_token', res.data.access_token);
    //         navigate('/dashboard');
    //     } catch (err) {
    //         console.error('Facebook sign-up failed:', err);
    //     }
    // };

    // return (
    //     <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
    //         <div>
    //             <Formik
    //                 initialValues={{ email: '', password: '', confirmPassword: '' }}
    //                 validationSchema={validationSchema}
    //                 onSubmit={handleEmailPasswordSignUp}
    //             >
    //                 {({ isSubmitting }) => (
    //                     <Form>
    //                         <div>
    //                             <label>Email:</label>
    //                             <Field type="email" name="email" />
    //                             <ErrorMessage name="email" component="div" className="error" />
    //                         </div>
    //                         <div>
    //                             <label>Password:</label>
    //                             <Field type="password" name="password" />
    //                             <ErrorMessage name="password" component="div" className="error" />
    //                         </div>
    //                         <div>
    //                             <label>Confirm Password:</label>
    //                             <Field type="password" name="confirmPassword" />
    //                             <ErrorMessage name="confirmPassword" component="div" className="error" />
    //                         </div>
    //                         <button type="submit" disabled={isSubmitting}>
    //                             Sign Up
    //                         </button>
    //                     </Form>
    //                 )}
    //             </Formik>

    //             <hr />

    //             <GoogleLogin
    //                 onSuccess={handleGoogleSignUpSuccess}
    //                 onError={() => {
    //                     console.log('Google Sign-up Failed');
    //                 }}
    //             />

    //             <FacebookLogin
    //                 appId="1672022970286921"
    //                 onSuccess={handleFacebookSignUpSuccess}
    //                 onFailure={() => {
    //                     console.log('Facebook Sign-up Failed');
    //                 }}
    //             />
    //         </div>
    //     </GoogleOAuthProvider>
    // );
};

export default SignUpForm;