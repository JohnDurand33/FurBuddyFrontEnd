import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Box, Button, Grid, Typography, TextField, CircularProgress, Alert } from '@mui/material';
import { setLocalToken, removeToken } from '../utils/token';
import { backEndUrl } from '../utils/config';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { user, setUser } = useAuth();
    const GC_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleEmailPasswordLogin = async (values, { setSubmitting }) => {
        setServerError(null);
        removeToken('colab32Access');
        try {
            // Authenticate with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const Emailuser = userCredential.user;
            setUser(Emailuser)
            

            // Send the login details to your backend if needed
            // const payload = {
            //     owner_email: values.email,
            //     password: values.password,
            // };

            // const res = await axios.post(`${backEndUrl}/owner/login`, payload, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // });
            // setLocalToken('colab32Access', res.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setServerError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setSubmitting(false);
            console.log('Firebase user logged in:', user);
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        setServerError(null);
        removeToken('colab32Access');
        try {
            const { credential } = credentialResponse;
            const googleCredential = GoogleAuthProvider.credential(credential);
            const userCredential = await signInWithCredential(auth, googleCredential);
            const user = userCredential.user;
            setUser(user)
            console.log('Firebase Google user logged in:', user);

            const res = await axios.post(`${backEndUrl}/owner/google-login`, {
                token: credential,
                provider: 'google',
            });

            setLocalToken('colab32Access', res.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setServerError('Google login failed. Please try again.');
        }
    };

    return (
        <Box sx={{ maxWidth: '80%', minHeight: '90vh', mx: 'auto', mt: 4 }}>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleEmailPasswordLogin}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Box mb={2}>
                            <Typography variant="h5" component="h1" align="center" color="#white">
                                Login Form
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
                            />
                            <ErrorMessage name="password" component="div" className="error" />
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            sx={{ mb: 2 }}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
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
                            onSuccess={handleGoogleLoginSuccess}
                            onError={() => {
                                setServerError('Google Login Failed. Please try again.');
                            }}
                        />
                    </GoogleOAuthProvider>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Login;