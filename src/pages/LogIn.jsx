import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';
import { backEndUrl, GC_ID } from '../utils/config';
import { ensureArray } from '../utils/helpers';
import { set } from 'date-fns';
import { clearAllLocalStorage } from '../utils/localStorage';
import '../Buttons.css';
import { api } from '../utils/eventApi';

const Login = ({ setIsRailOpen }) => {
    const {
        authed,
        token,
        currUser,
        setLocalCurrDog,
        setLocalCurrUser,
        setLocalCurrDogProfiles,
        currDogs,
        currDog,
        fetchUserDataWithToken,
        setAuthed,
        setToken,
        setLocalToken,
        clearAllStateAndLocalStorage,
        loading,
        setLoading,
        setFireUser,
    } = useAuth();

    const { currEvents, setCurrEvents, setLocalCurrEvent } = useEvents();

    const [serverError, setServerError] = useState(null); // Set to `null` for error handling
    const navigate = useNavigate();

    // Handle email and password login
    const handleEmailPasswordLogin = async (values, setSubmitting) => {
            setLoading(true);
            setServerError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            console.log("Logged in user:", user);
            setFireUser(user);
            // You can now store the user information or token if needed
        } catch (error) {
            console.error("Error logging in to Firebase:", error.message);
            setServerError("Failed to login to Firebase. Please check your credentials.");
        }

        try {
        console.log('Logging into backend with email and password:', values);
        const payload = {
            owner_email: values.email,
            password: values.password,
        };


        const res = await axios.post(`${backEndUrl}/owner/login`, payload, {
            headers: { 'Content-Type': 'application/json' },
        });

        const { auth_token: loginToken } = res.data;
        console.log('Login token:', loginToken);
        setLocalToken(loginToken);

        // Fetch user data using token
        const loggedInUser = await fetchUserDataWithToken(loginToken);
        setLocalCurrUser(loggedInUser);
        console.log('Logged in user:', loggedInUser);
        setAuthed(true);
        setLoading(false);

    } catch (err) {
        console.error('Error logging into backend:', err);
        setServerError('Failed to login. Please check your backend credentials.');
        setLoading(false);
    } finally {
        setSubmitting(false);
    }
};

    // Validation schema for login form
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    return (
        <div style={{ maxWidth: '80%', margin: '0 auto', marginTop: '2rem' }}>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    console.log('Form submitted with values:', values);
                    handleEmailPasswordLogin(values, setSubmitting);  // Invoke the login function here
                }}
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
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    marginBottom: '0.5rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
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
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    marginBottom: '0.5rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
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
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
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
        </div>
    );
};

export default Login;