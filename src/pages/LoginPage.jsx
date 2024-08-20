import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import LogInForm from '../components/forms/LogInForm';
import { UserContext } from '../context/UserContext';

const LogInPage = () => {
    const navigate = useNavigate();
    const { logIn } = useContext(UserContext);

    const handleLogIn = (formData) => {
        // login should handle API logic and state managment
        logIn(formData);
        navigate('/home');
    };

    return (
        <Container style={{ padding: '50px 20px' }}>
            <Typography variant="h4" gutterBottom>
                Log In Page
            </Typography>
            <LogInForm onSubmit={handleLogIn} width='80%' />
        </Container>
    );
};

export default LogInPage;