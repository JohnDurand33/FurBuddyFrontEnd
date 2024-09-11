import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';
import { backEndUrl, GC_ID } from '../utils/config';
import DogProfileView from './DogProfileView';

const LoginForm = ({ isMobile, toggleRail, setIsRailOpen }) => {
    const {
        clearAllStateAndLocalStorage,
        fetchUserDataWithToken,
        fetchDogProfilesFromApi,
        setAuthed,
        setFireUser,
        setLocalCurrUser,
        setLocalToken,
        currDogProfiles,
        setLocalDogProfiles
    } = useAuth();

    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleEmailPasswordLogin = async (values, { setSubmitting }) => {
        setServerError(null);
        clearAllStateAndLocalStorage(); // Clear any existing state and localStorage

        try {
            // Authenticate with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const fireBaseUser = userCredential.user;
            setFireUser(fireBaseUser);

            // Backend login
            const payload = {
                owner_email: values.email,
                password: values.password,
            };

            const res = await axios.post(`${backEndUrl}/owner/login`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            const { data } = res;
            console.log('Login response:', data);

            setLocalToken(data.auth_token);
            const loginToken = data.auth_token;

            const loggedInUser = await fetchUserDataWithToken(loginToken);
            console.log('Logged in user:', loggedInUser);
            setLocalCurrUser(loggedInUser);
            setAuthed(true);

            const fetchedDogs = await fetchDogProfilesFromApi(loginToken);
            console.log('Fetched dogs:', fetchedDogs);

            if (fetchedDogs) {
                setLocalDogProfiles(fetchedDogs);
                navigate('/dogs/view');
                setIsRailOpen(true);
            } else {
                navigate('/dogs/new');
                setIsRailOpen(true);
            }
            console.log('Fetched dogs:', fetchedDogs);

            
            // Set user as authenticated and navigate to dashboard
            
        } catch (err) {
            setServerError(err.message || 'Login failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        setServerError(null);
        clearAllStateAndLocalStorage(); // Clear any existing state and localStorage

        try {
            const { credential } = credentialResponse;
            const googleCredential = GoogleAuthProvider.credential(credential);
            const userCredential = await signInWithCredential(auth, googleCredential);
            const fireUser = userCredential.user;
            setFireUser(fireUser);

            // Backend login for Google user
            const res = await axios.post(`${backEndUrl}/owner/google-login`, {
                token: credential,
                provider: 'google',
            });

            // Update context state and sync to localStorage
            setLocal(res.data.owner);
            updateCurrUserId(res.data.owner.id);
            updateToken(res.data.auth_token);
            setAuthed(true);

            navigate('/dogs/new'); // Redirect to the "new dog" profile page
        } catch (err) {
            setServerError('Google login failed. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '80%', margin: '0 auto', marginTop: '2rem' }}>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleEmailPasswordLogin}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <div style={{ marginBottom: '2rem' }}>
                            <h1 style={{ textAlign: 'center', color: '#333' }}>Login Form</h1>
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
                            {isSubmitting ? 'Submitting...' : 'Login'}
                        </button>
                    </Form>
                )}
            </Formik>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/signup" style={{ color: 'grey', textDecoration: 'underline' }}>
                    Don't have an account? Sign up here.
                </Link>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <GoogleOAuthProvider clientId={GC_ID}>
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => setServerError('Google Login Failed. Please try again.')}
                    />
                </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default LoginForm;