import React, { useState, useEffect } from 'react';
import { Grid, Box, Avatar, Button, TextField, Typography, FormControlLabel, Checkbox, Select, MenuItem, FormControl, InputLabel, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TokenRequiredApiCall from '../utils/TokenRequiredApiCall';
import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';

const DogProfileView = () => {
    const { userId, currDogId, localStateSetter, dogProfileData, setDogProfileData } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(dogProfileData.img_url);
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('sm')); // Breakpoint for larger screens

    useEffect(() => {
        const fetchDogProfile = async () => {
            await localStateSetter();
            console.log('userId', userId);
            console.log('currDogId', currDogId);

            const response = await TokenRequiredApiCall.get(`/profiles/owner/${userId}/profiles/${currDogId}`);
            if (response.status !== 200) {
                console.error('Failed to fetch dog profile');
                return;
            }
            setDogProfileData(response.data.profile);
            setImageUrl(response.data.profile.image_path);
        };
        fetchDogProfile();
    }, [userId, currDogId]);

    const getWeightInLbs = (weightCategory) => {
        switch (weightCategory) {
            case 'Small':
                return '< 20';
            case 'Medium':
                return '21 - 60';
            case 'Large':
                return '61 - 100';
            case 'Extra-Large':
                return '> 100';
            default:
                return '';
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDogProfileData((prev) => ({
            ...prev, [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (image) {
            const storageRef = ref(storage, `dog_images/${image.name}`);
            await uploadBytes(storageRef, image);
            const url = await getDownloadURL(storageRef);
            setImageUrl(url);
            return url;
        }
        return dogProfileData.img_url;
    };

    const handleSave = async () => {
        const img_url = await handleImageUpload();
        const updatedData = { ...dogProfileData, img_url };

        const response = await axios.post(`/profiles/owner/${currDogId}/update`, updatedData);
        if (response.status !== 200) {
            console.error('Failed to update profile');
            return;
        }
        setDogProfileData(updatedData);
        setIsEditing(false);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    return (
        <Box sx={{ padding: 3, color: 'text.primary' }}>
            <Grid container justifyContent="center">
                <Grid container maxWidth='80%' spacing={2} sx={{ pt: 5 }}>
                    {/* Avatar and Upload Button */}
                    <Grid item xs={12} container justifyContent="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: 'fit-content' }}>
                            <Avatar
                                alt="Dog's Image"
                                src={imageUrl || ""}
                                sx={{ width: 100, height: 100, color: 'text.primary' }}
                            />
                            {isEditing && (
                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{ ml: 2 }}
                                >
                                    Upload Image
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleImageChange}
                                    />
                                </Button>
                            )}
                        </Box>
                    </Grid>
                    {serverError && (
                        <Box mb={2}>
                            <Alert severity="error">{serverError}</Alert>
                        </Box>
                    )}

                    {/* Dog Information Header */}
                    <Grid item xs={12}>
                        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                            Dog Information
                        </Typography>
                    </Grid>

                    {/* Dog Information Fields */}
                    <Grid item xs={12} md={6}>
                        {!isEditing ? (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Name: {dogProfileData.name || 'undefined'}
                            </Typography>
                        ) : (
                            <TextField
                                fullWidth
                                label="Name"
                                value={dogProfileData.name}
                                onChange={(e) => setDogProfileData({ ...dogProfileData, name: e.target.value })}
                                variant="outlined"
                                sx={{ mt: 2 }}
                            />
                        )}
                        {!isEditing ? (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Weight: {getWeightInLbs(dogProfileData.weight)} lbs
                            </Typography>
                        ) : (
                            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                <InputLabel id="weight-label">Weight</InputLabel>
                                <Select
                                    labelId="weight-label"
                                    value={dogProfileData.weight}
                                    onChange={(e) => setDogProfileData({ ...dogProfileData, weight: e.target.value })}
                                    label="Weight"
                                    sx={{
                                        backgroundColor: 'secondary.main',
                                        color: 'text.opposite',
                                    }}
                                >
                                    <MenuItem value="Small">Small: less than 20 lbs</MenuItem>
                                    <MenuItem value="Medium">Medium: 21 - 60 lbs</MenuItem>
                                    <MenuItem value="Large">Large: 61 - 100 lbs</MenuItem>
                                    <MenuItem value="Extra-Large">Extra-Large: more than 100 lbs</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                        {!isEditing ? (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Sex: {dogProfileData.sex || 'undefined'}
                            </Typography>
                        ) : (
                            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                <InputLabel id="sex-label">Sex</InputLabel>
                                <Select
                                    labelId="sex-label"
                                    value={dogProfileData.sex}
                                    onChange={(e) => setDogProfileData({ ...dogProfileData, sex: e.target.value })}
                                    label="Sex"
                                    sx={{
                                        backgroundColor: 'secondary.main',
                                        color: 'text.opposite',
                                    }}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                        {!isEditing ? (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Fixed: {dogProfileData.fixed ? 'Yes' : 'No'}
                            </Typography>
                        ) : (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={dogProfileData.fixed}
                                        onChange={(e) => setDogProfileData({ ...dogProfileData, fixed: e.target.checked })}
                                        color="primary"
                                    />
                                }
                                label="Fixed"
                                sx={{ mt: 2 }}
                            />
                        )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        {!isEditing ? (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Breed: {dogProfileData.breed || 'undefined'}
                            </Typography>
                        ) : (
                            <TextField
                                fullWidth
                                label="Breed"
                                value={dogProfileData.breed}
                                onChange={(e) => setDogProfileData({ ...dogProfileData, breed: e.target.value })}
                                variant="outlined"
                                sx={{ mt: 2 }}
                            />
                        )}
                        {!isEditing ? (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Date of Birth: {dogProfileData.date_of_birth || 'undefined'}
                            </Typography>
                        ) : (
                            <TextField
                                fullWidth
                                name="date_of_birth"
                                label="Date of Birth"
                                variant="outlined"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={dogProfileData.date_of_birth}
                                onChange={handleChange}
                                sx={{ mt: 2 }}
                            />
                        )}
                        {!isEditing ? (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Chip No.: {dogProfileData.chip_number || 'undefined'}
                            </Typography>
                        ) : (
                            <TextField
                                fullWidth
                                name="chip_number"
                                label="Chip No."
                                variant="outlined"
                                value={dogProfileData.chip_number}
                                onChange={handleChange}
                                sx={{ mt: 2 }}
                            />
                        )}
                    </Grid>

                    {/* Vet Information Header */}
                    <Grid item xs={12} sx={{ mt: 4 }}>
                        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                            Vet Information
                        </Typography>
                    </Grid>

                    {/* Vet Information Fields */}
                    <Grid item xs={12} md={6}>
                        {!isEditing ? (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Vet clinic name: {dogProfileData.vet_clinic_name || 'undefined'}
                            </Typography>
                        ) : (
                            <TextField
                                fullWidth
                                label="Vet clinic name"
                                value={dogProfileData.vet_clinic_name}
                                onChange={(e) => setDogProfileData({ ...dogProfileData, vet_clinic_name: e.target.value })}
                                variant="outlined"
                                sx={{ mt: 2 }}
                            />
                        )}
                        {!isEditing ? (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Vet doctor name: {dogProfileData.vet_doctor_name || 'undefined'}
                            </Typography>
                        ) : (
                            <TextField
                                fullWidth
                                label="Vet doctor name"
                                value={dogProfileData.vet_doctor_name}
                                onChange={(e) => setDogProfileData({ ...dogProfileData, vet_doctor_name: e.target.value })}
                                variant="outlined"
                                sx={{ mt: 2 }}
                            />
                        )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        {!isEditing ? (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Vet clinic email: {dogProfileData.vet_clinic_email || 'undefined'}
                            </Typography>
                        ) : (
                            <TextField
                                fullWidth
                                label="Vet clinic email"
                                value={dogProfileData.vet_clinic_email}
                                onChange={(e) => setDogProfileData({ ...dogProfileData, vet_clinic_email: e.target.value })}
                                variant="outlined"
                                sx={{ mt: 2 }}
                            />
                        )}
                        {!isEditing ? (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Vet clinic phone: {dogProfileData.vet_clinic_phone || 'undefined'}
                            </Typography>
                        ) : (
                            <TextField
                                fullWidth
                                label="Vet clinic phone"
                                value={dogProfileData.vet_clinic_phone}
                                onChange={(e) => setDogProfileData({ ...dogProfileData, vet_clinic_phone: e.target.value })}
                                variant="outlined"
                                sx={{ mt: 2 }}
                            />
                        )}
                    </Grid>

                    {/* Buttons */}
                    <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
                        {!isEditing ? (
                            <Button variant="contained" onClick={handleEditToggle}>
                                Edit Profile
                            </Button>
                        ) : (
                            <>
                                <Button variant="contained" onClick={handleSave}>
                                    Save Changes
                                </Button>
                                <Button variant="outlined" onClick={handleEditToggle} sx={{ ml: 2 }}>
                                    Cancel
                                </Button>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DogProfileView;