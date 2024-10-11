import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';
import { backEndUrl } from '../utils/config';
import { api } from '../utils/eventApi';

const SignUpForm = () => {
    const {
        clearAllStateAndLocalStorage,
        updateCurrUser,
        updateToken,
        setAuthed,
        setFireUser,
    } = useAuth();

    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();
    const GC_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const handleEmailPasswordSignUp = async (values, { setSubmitting }) => {
        setServerError(null);
        try {
            clearAllStateAndLocalStorage();
            const { email, password } = values;

        
            const newAuth = auth;
            const userCredential = await createUserWithEmailAndPassword(newAuth, email, password);
            const user = userCredential.user;
            console.log("User signed up:", user);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error signing up [${errorCode}]: ${errorMessage}`);
            setServerError('Sign-up failed. Please try again.');
        }

        
        try {
            const payload = {
                owner_email: values.email,
                password: values.password,
            };

            const res = await axios.post(`${backEndUrl}/owner/`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log(res)

            navigate('/login');
        } catch (err) {
            if (err.response) {
                // The request was made, and the server responded with a status code that falls out of the range of 2xx
                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
                console.error('Response headers:', err.response.headers);
                setServerError(err.response.data?.error || 'Sign-up failed. Please try again.');
            } else if (err.request) {
                // The request was made, but no response was received
                console.error('Request:', err.request);
                setServerError('No response from server. Please try again.');
            } else {
                // Something happened in setting up the request that triggered an error
                console.error('Error', err.message);
                setServerError(err.message || 'Sign-up failed. Please try again.');
            }

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '80%', margin: '0 auto', marginTop: '2rem' }}>
            <Formik
                initialValues={{ email: '', password: '', confirmPassword: '', ownerName: '', ownerPhone: '' }}
                validationSchema={validationSchema}
                onSubmit={handleEmailPasswordSignUp}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <div style={{ marginBottom: '2rem' }}>
                            <h1 style={{ textAlign: 'center', color: '#333' }}>Sign Up Form</h1>
                        </div>

                        {serverError && (
                            <div style={{ marginBottom: '2rem', color: 'red' }}>{serverError}</div>
                        )}

                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="email">Email</label>
                            <Field
                                type="email"
                                id="email"
                                name="email"
                                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            {touched.email && errors.email && (
                                <div style={{ color: 'red', marginBottom: '1rem' }}>{errors.email}</div>
                            )}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="password">Password</label>
                            <Field
                                type="password"
                                id="password"
                                name="password"
                                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            {touched.password && errors.password && (
                                <div style={{ color: 'red', marginBottom: '1rem' }}>{errors.password}</div>
                            )}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <Field
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <div style={{ color: 'red', marginBottom: '1rem' }}>{errors.confirmPassword}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: '#F7CA57',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Sign Up'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SignUpForm;