import React, { useState } from 'react';
import { Grid, Box, Avatar, Button, TextField, Typography, FormControlLabel, Checkbox, Select, MenuItem, FormControl, InputLabel, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TokenRequiredApiCall from '../utils/TokenRequiredApiCall';
import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DogProfileView = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [dogProfileData, setDogProfileData] = useState({
        name: '',
        breed: '',
        age: '',
        weight: '',
        sex: '',
        fixed: true,
        chip_number: '',
        img_url: '',
        vet_clinic_name: '',
        vet_clinic_email: '',
        vet_doctor_name: '',
        vet_clinic_phone: '',
    });

    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(dogProfileData.img_url);
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('sm')); // Breakpoint for larger screens

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

        const response = await TokenRequiredApiCall.post('/profile/update', updatedData);
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
        <Box sx={{ padding: 3, color:'text.primary' }}>
            <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ pt: 5 }}>
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

                {/* Dog Information Header */}
                <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
                    <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                        Dog Information
                    </Typography>
                </Grid>

                {/* Dog Information Fields */}
                <Grid container item xs={12} spacing={2} style={{ margin: '0 auto', width: '80%' }}>
                    {['name', 'breed', 'age', 'chip_number'].map((key) => (
                        <Grid item xs={12} md={6} key={key}>
                            {!isEditing ? (
                                <Typography variant="body1">
                                    {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${dogProfileData[key]}`}
                                </Typography>
                            ) : (
                                <TextField
                                    fullWidth
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    value={dogProfileData[key]}
                                    onChange={(e) => setDogProfileData({ ...dogProfileData, [key]: e.target.value })}
                                    variant="outlined"
                                />
                            )}
                        </Grid>
                    ))}
                </Grid>

                {/* Weight and Sex Dropdowns */}
                <Grid container item xs={12} spacing={2} style={{ margin: '0 auto', width: '80%' }}>
                    <Grid item xs={12} md={6}>
                        {!isEditing ? (
                            <Typography variant="body1">
                                Weight: {dogProfileData.weight}
                            </Typography>
                        ) : (
                            <FormControl fullWidth variant="outlined">
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
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {!isEditing ? (
                            <Typography variant="body1">
                                Sex: {dogProfileData.sex}
                            </Typography>
                        ) : (
                            <FormControl fullWidth variant="outlined">
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
                    </Grid>
                </Grid>

                {/* Fixed Checkbox */}
                <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
                    {!isEditing ? (
                        <Typography variant="body1">
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
                        />
                    )}
                </Grid>

                {/* Vet Information Header */}
                <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
                    <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                        Vet Information
                    </Typography>
                </Grid>

                {/* Vet Information Fields */}
                <Grid container item xs={12} spacing={2} style={{ margin: '0 auto', width: '80%' }}>
                    {['vet_clinic_name', 'vet_clinic_email', 'vet_doctor_name', 'vet_clinic_phone'].map((key) => (
                        <Grid item xs={12} md={6} key={key}>
                            {!isEditing ? (
                                <Typography variant="body1">
                                    {`${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}: ${dogProfileData[key]}`}
                                </Typography>
                            ) : (
                                <TextField
                                    fullWidth
                                    label={key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                                    value={dogProfileData[key]}
                                    onChange={(e) => setDogProfileData({ ...dogProfileData, [key]: e.target.value })}
                                    variant="outlined"
                                />
                            )}
                        </Grid>
                    ))}
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
        </Box>
    );
};

export default DogProfileView;