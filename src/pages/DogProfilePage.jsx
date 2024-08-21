import React from 'react';
import { Container, Typography } from '@mui/material';
import DogProfileForm from '../components/Forms/DogProfileFOrm';

const DogProfilePage = () => {
    return (
        <Container style={{ padding: '50px 20px' }}>
            <Typography variant="h4" gutterBottom>
                Create a Dog Profile
            </Typography>
            <DogProfileForm />
        </Container>
    );
};

export default DogProfilePage