import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import backApiCall from '../utils/backEndApiCall';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Box, Button, Grid, Typography, TextField, CircularProgress, Alert } from '@mui/material';

const SignUpForm = () => {
    const navigate = useNavigate();

    const [serverError, setServerError] = React.useState(null);

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
        try {
            const res = await backApiCall.post('/create/', {
                email: values.email,
                password: values.password,
            });
            localStorage.setItem('access_token', res.data.access_token);
            navigate('/home');
        } catch (err) {
            setServerError(err.response?.data?.message || 'Sign-up failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSignUpSuccess = async (credentialResponse) => {
        setServerError(null); // Reset server error on new submission
        try {
            const { credential } = credentialResponse;
            const res = await backApiCall.post('/auth/social-signup', {
                token: credential,
                provider: 'google',
            });
            localStorage.setItem('access_token', res.data.access_token);
            navigate('/home');
        } catch (err) {
            setServerError('Google sign-up failed. Please try again.');
        }
    };

    return (
        <Box sx={{ maxWidth: '80%', mx: 'auto', mt: 4 }}>
            <Formik
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={handleEmailPasswordSignUp}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Box mb={2}>
                            <Typography variant="h5" component="h1" align="center">
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
                        <Box mb={2}>
                            <Field
                                type="password"
                                name="confirmPassword"
                                as={TextField}
                                label="Confirm Password"
                                fullWidth
                                required
                            />
                            <ErrorMessage name="confirmPassword" component="div" className="error" />
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            sx={{ mb: 2 }}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : 'Sign Up'}
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