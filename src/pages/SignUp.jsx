import { Alert, Box, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import CustomButton from '../components/CustomButton';
import { auth } from '../config/firebase.js'; // Import Firebase auth and providers
import { useAuth } from '../context/AuthContext';
import { backEndUrl } from '../utils/config';
import { removeToken, setLocalToken } from '../utils/token';

const SignUpForm = (isDark) => {
    const { user, setUser, fireUser, setFireUser } = useAuth();
    const GC_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const handleEmailPasswordSignUp = async (values, { setSubmitting }) => {
        setServerError(null); // Reset server error on new submission
        removeToken('colab32Access'); // Remove any existing token in storage
        try {
            // Create a new user with email and password using Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            console.log('Firebase user created:', user);
            setFireUser(user)

            // Backend signup
            const payload = {
                "owner_email": values.email,
                "password": values.password,
                "owner_name": values.ownerName,
                "owner_phone": values.ownerPhone
            };

            const res = await axios.post(`${backEndUrl}/owner/signup`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            setUser(user)
            console.log('Backend user signed up:', res);
            navigate('/dogs/new');
        } catch (err) {
            setServerError(err.message || 'Sign-up failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSignUpSuccess = async (credentialResponse) => {
        setServerError(null);
        removeToken('colab32Access');
        try {
            const { credential } = credentialResponse;
            const googleCredential = GoogleAuthProvider.credential(credential);
            const userCredential = await signInWithCredential(auth, googleCredential);
            const user = userCredential.user;
            setUser(user)
            console.log('Firebase Google user signed in:', user);

            // You may want to send additional user details to your backend
            const res = await axios.post(`${backEndUrl}/owner/google-signup`, {
                token: credential,
                provider: 'google',
            });

            setLocalToken('colab32Access', res.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setServerError('Google sign-up failed. Please try again.');
        }
    };

    return (
        <Box sx={{ maxWidth: '80%', mx: 'auto', mt: 4 }}>
            <Formik
                initialValues={{ email: '', password: '', confirmPassword: '', ownerName: '', ownerPhone: '' }}
                validationSchema={validationSchema}
                onSubmit={handleEmailPasswordSignUp}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Box mb={2}>
                            <Typography variant="h5" component="h1" align="center" color="text.primary">
                                Sign Up Form
                            </Typography>
                        </Box>
                        {serverError && (
                            <Box mb={2}>
                                <Alert severity="error">{serverError}</Alert>
                            </Box>
                        )}
                        <Box mb={2}>
                            <Field
                                type="email"
                                name="email"
                                as={TextField}
                                label="Email"
                                fullWidth
                                required
                                autoComplete="email"
                            />
                            <ErrorMessage name="email" component="div" className="error" />
                        </Box>
                        <Box mb={2}>
                            <Field
                                type="password"
                                name="password"
                                as={TextField}
                                label="Password"
                                fullWidth
                                required
                                autoComplete="new-password"
                            />
                            <ErrorMessage name="password" component="div" className="error" />
                        </Box>
                        <Box mb={2}>
                            <Field
                                type="password"
                                name="confirmPassword"
                                as={TextField}
                                label="Confirm Password"
                                fullWidth
                                required
                                autoComplete="confirm-password"
                            />
                            <ErrorMessage name="confirmPassword" component="div" className="error" />
                        </Box>

                        <CustomButton
                            isDark={isDark}
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{ mb: 2 }}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : 'Sign Up'}
                        </CustomButton>
                    </Form>
                )}
            </Formik>

            <Box sx={{ my: 2 }}>
                <hr />
            </Box>

            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <GoogleOAuthProvider clientId={GC_ID}>
                        <GoogleLogin
                            onSuccess={handleGoogleSignUpSuccess}
                            onError={() => {
                                setServerError('Google Sign-up Failed. Please try again.');
                            }}
                        />
                    </GoogleOAuthProvider>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SignUpForm;