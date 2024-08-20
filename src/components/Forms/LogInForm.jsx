import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login-lite';
import { Box, Button, Grid, Typography, TextField } from '@mui/material';

const LoginForm = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleEmailPasswordLogin = async (values, { setSubmitting }) => {
        try {
            const res = await axios.post('/auth/login', values);
            localStorage.setItem('access_token', res.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const res = await axios.post('/auth/social-login', {
                token: credential,
                provider: 'google',
            });
            localStorage.setItem('access_token', res.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Google login failed:', err);
        }
    };

    const handleFacebookLoginSuccess = async (response) => {
        try {
            const { accessToken } = response;
            const res = await axios.post('/auth/social-login', {
                token: accessToken,
                provider: 'facebook',
            });
            localStorage.setItem('access_token', res.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Facebook login failed:', err);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleEmailPasswordLogin}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Box mb={2}>
                            <Typography variant="h5" component="h1" align="center">
                                Login Form
                            </Typography>
                        </Box>
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
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>

            <Box sx={{ my: 2 }}>
                <hr />
            </Box>

            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <GoogleOAuthProvider clientId="226829116506-ka1l30arh8c45j6cipnegc5rp98k13sv.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={() => {
                                console.log('Google Login Failed');
                            }}
                        />
                    </GoogleOAuthProvider>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoginForm;