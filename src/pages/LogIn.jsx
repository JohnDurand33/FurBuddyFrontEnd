import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';
import { backEndUrl, GC_ID } from '../utils/config';
import { ensureArray } from '../utils/helpers';

const LoginForm = ({ setIsRailOpen }) => {
    const {
        clearAllStateAndLocalStorage,
        fetchUserDataWithToken,
        setAuthed,
        setFireUser,
        setLocalCurrUser,
        setLocalToken,
        authed,
        currUser,
        token,
        fetchCurrDogProfiles,
        setLocalCurrDog,
        setLocalCurrDogProfiles,
    } = useAuth();

    const { fetchEventsFromAPI } = useEvents();
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (authed && token && currUser) {
            fetchDataAfterLogin();
        }
    }, [authed, token, currUser]);

    // Fetch profiles and events after successful login
    const fetchDataAfterLogin = async () => {
        try {
            if (authed && token && currUser) {
                const profiles = await fetchCurrDogProfiles(token);
                const updatedDogs = await ensureArray(profiles)
                if (updatedDogs && updatedDogs.length === []) {
                    navigate('/dogs/new');
                } else {
                    console.log('updatedDogs:', updatedDogs);
                    setLocalCurrDogProfiles(updatedDogs);
                    setLocalCurrDog(updatedDogs[0]);
                    navigate('/dogs/view');
                }
            }
        } catch (error) {
                console.error('Error fetching profiles or events:', error);
        await fetchEventsFromAPI(); // Fetch events once the user is logged in
        setIsRailOpen(true); // Open navigation rail
        }      
        setServerError('Failed to fetch profiles or events. Please try again.');
        }
    };

    

    // Validation schema for login form
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    // Handle email and password login
const handleEmailPasswordLogin = async (values, { setSubmitting }) => {
    setServerError(null);
    setSubmitting(true);
    clearAllStateAndLocalStorage();

    try {
        // Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(values.email, values.password);
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

        fetchCurrDogProfiles();
        setIsRailOpen(true)

        // Fetch data after successful login
        refetchCurrDogProfiles();
    } catch (err) {
        setServerError('Invalid email or password. Please try again.');
    } finally {
        setSubmitting(false);
    };
};


    // Google OAuth login
const handleGoogleLoginSuccess = async (credentialResponse) => {
    setServerError(null);
    clearAllStateAndLocalStorage();

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

        setLocalCurrUser(res.data.owner);
        setLocalToken(res.data.auth_token);
        setAuthed(true);

        fetchDataAfterLogin();
    } catch (err) {
        setServerError('Google Login Failed. Please try again.');
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