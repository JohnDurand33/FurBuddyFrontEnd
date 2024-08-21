import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const DogProfilePage = ({ dogId }) => {
    const [dogProfile, setDogProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the dog profile data from the backend
        const fetchDogProfile = async () => {
            try {
                const response = await axios.get(`/api/dogProfile/${dogId}`);
                setDogProfile(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching dog profile');
                setLoading(false);
            }
        };

        fetchDogProfile();
    }, [dogId]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!dogProfile) {
        return <Typography>No profile found</Typography>;
    }

    return (
        <Box p={4}>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                    <img
                        src={dogProfile.img_url}
                        alt={dogProfile.name}
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h4">{dogProfile.name}</Typography>
                    <Typography variant="h6">Breed: {dogProfile.breed}</Typography>
                    <Typography variant="h6">Age: {dogProfile.age} years</Typography>
                    <Typography variant="h6">Weight: {dogProfile.weight} lbs</Typography>
                    <Typography variant="h6">Sex: {dogProfile.sex}</Typography>
                    <Typography variant="h6">
                        Fixed: {dogProfile.fixed ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="h6">
                        Microchip Number: {dogProfile.microchipNumber || 'N/A'}
                    </Typography>
                    {/* You can add more fields as needed */}
                    <Button variant="contained" color="primary" onClick={() => console.log('Edit Profile')}>
                        Edit Profile
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DogProfilePage;