import { Alert, Box, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import CustomButton from '../components/CustomButton';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { backEndUrl } from '../utils/config';
import { GC_ID } from '../utils/config.js';
import { removeToken, setLocalToken } from '../utils/token';

const Login = (isDark) => {
    const { user, setUser, fireUser, setFireUser, loginUserBE } = useAuth();
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
            const fireBaseUser = userCredential.user;
            setFireUser(fireBaseUser)
            
            // BackendLogin
            const payload = {
                "owner_email": values.email,
                "password": values.password,
            };

            const res = await axios.post(`${backEndUrl}/owner/login`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setUser(res.data.owner.owner_email)
            setLocalToken(res.data.auth_token);
            navigate('/dogs/new');
        } catch (err) {
            setServerError(err.message || 'Login failed. Please try again.');
        } finally {
            setSubmitting(false);
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

            const res = await axiosInstanceCORS.post(`owner/login`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            setLocalToken(res.data.access_token);
            navigate('/dogs/new');
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
                            <Typography variant="h5" component="h1" align="center" color="text.primary">
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
                        <CustomButton
                            isDark={isDark}
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{ mb: 2 }}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : 'Login'}
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