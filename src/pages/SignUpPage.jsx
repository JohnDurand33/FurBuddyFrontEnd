import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import SignUpForm from '../components/forms/SignUpForm';
import { UserContext } from '../context/UserContext';

const SignUpPage = () => {
    const navigate = useNavigate();

    const handleSignUp = (formData) => {
        // signUp handles API call and state management
        signUp(formData);
        navigate('/profile');
    };

    return (
        <Container style={{ padding: '50px 20px' }}>
            <Typography variant="h4" gutterBottom>
                Sign Up
            </Typography>
            <SignUpForm onSubmit={handleSignUp} />
        </Container>
    );
};

export default SignUpPage;