import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { backEndUrl } from '../utils/config';

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

            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const fireUser = userCredential.user;
            setFireUser(fireUser);

            const payload = {
                owner_email: values.email,
                password: values.password,
                owner_name: values.ownerName,
                owner_phone: values.ownerPhone,
            };

            const res = await axios.post(`${backEndUrl}/owner/`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            navigate('/login');
        } catch (err) {
            setServerError(err.message || 'Sign-up failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSignUpSuccess = async (credentialResponse) => {
        setServerError(null);
        try {
            const { credential } = credentialResponse;
            const googleCredential = GoogleAuthProvider.credential(credential);
            const userCredential = await signInWithCredential(auth, googleCredential);
            const fireUser = userCredential.user;
            setFireUser(fireUser);

            const res = await axios.post(`${backEndUrl}/owner/google-signup`, {
                token: credential,
                provider: 'google',
            });

            updateCurrUser(res.data.owner);
            updateToken(res.data.auth_token);

            setAuthed(true);
            navigate('/login');
        } catch (err) {
            setServerError('Google sign-up failed. Please try again.');
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

            <div style={{ margin: '2rem' }}>
                <hr />
            </div>

            <div style={{ textAlign: 'center' }}>
                <GoogleOAuthProvider clientId={GC_ID}>
                    <GoogleLogin
                        onSuccess={handleGoogleSignUpSuccess}
                        onError={() => setServerError('Google Sign-up Failed. Please try again.')}
                    />
                </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default SignUpForm;