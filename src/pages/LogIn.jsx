import React, { useState, useEffect } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';
import { backEndUrl, GC_ID } from '../utils/config';

const LoginForm = ({ isMobile, toggleRail, setIsRailOpen }) => {
    const {
        clearAllStateAndLocalStorage,
        fetchUserDataWithToken,
        setAuthed,
        setFireUser,
        setLocalCurrUser,
        setLocalToken,
        authed,
        currUser,
        currDog,
        token,
        dogProfiles,
        fetchCurrDogProfiles,
        fetchAndSetLocalCurrDogProfiles,
        setLocalCurrDog,
        setLocalCurrDogProfiles,
    } = useAuth();

    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (authed && token && currUser) {
                try {
                    const profiles = await fetchCurrDogProfiles(token); // Fetch the dog profiles after login
                    if (profiles && profiles.length > 0) {
                        setLocalCurrDog(profiles[0]);
                        console.log('currDog:', profiles[0]);
                        setLocalCurrDogProfiles(profiles);
                        console.log('currDogProfiles:', profiles);
                        navigate('/dogs/view');
                        setIsRailOpen(true)
                    } else {
                        console.log('didn\'t have any dogs -> response from fetchDogProfilesFromApi:', profiles);
                        setIsRailOpen(true)
                        navigate('/dogs/create');
                    }
                } catch (error) {
                    console.error('Error fetching profiles:', error);
                }
            }
        };
        fetchData();
    }, [authed, token, currUser]);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleEmailPasswordLogin = async (values, { setSubmitting }) => {
        setServerError(null);
        setSubmitting(true);
        clearAllStateAndLocalStorage(); // Clear any existing state and localStorage

        try {
            // Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const fireBaseUser = userCredential.user;
            setFireUser(fireBaseUser);

            // Backend Authentication
            const payload = {
                owner_email: values.email,
                password: values.password,
            };

            const res = await axios.post(`${backEndUrl}/owner/login`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            const { auth_token: loginToken } = res.data;

            setLocalToken(loginToken);

            // Fetch user data using token
            const loggedInUser = await fetchUserDataWithToken(loginToken);
            setLocalCurrUser(loggedInUser);
            setAuthed(true);

        } catch (err) {
            setServerError('Invalid email or password. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        setServerError(null);
        clearAllStateAndLocalStorage(); // Clear any existing state and localStorage

        try {
            // Firebase Google Authentication
            const { credential } = credentialResponse;
            const googleCredential = GoogleAuthProvider.credential(credential);
            const userCredential = await signInWithCredential(auth, googleCredential);
            const fireUser = userCredential.user;
            setFireUser(fireUser);

            // Backend Google Authentication
            const res = await axios.post(`${backEndUrl}/owner/google-login`, {
                token: credential,
                provider: 'google',
            });

            // Update context state with user data and token
            setLocalCurrUser(res.data.owner);
            setLocalToken(res.data.auth_token);
            setAuthed(true);
        } catch (err) {
            setServerError('Google Login Failed. Please try again.');
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