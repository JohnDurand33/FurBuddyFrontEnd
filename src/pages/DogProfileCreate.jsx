import { Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../config/firebase.js';
import { useAuth } from '../context/AuthContext';
import { backEndUrl } from '../utils/config.js';
import { getToken } from '../utils/localStorage.js';

const DogProfileCreate = () => {
    const { userId, setCurrDogId, setDogProfileData, setLocalCurrDogId } = useAuth();
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        name: '',
        breed: '',
        date_of_birth: '',
        weight: '',
        sex: '',
        fixed: false,
        chip_number: '',
        image_path: '',
        vet_clinic_name: '',
        vet_doctor_name: '',
        vet_clinic_phone: '',
        vet_clinic_email: ''
    });

    const [errors, setErrors] = useState({});
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        };
    },[]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(file);
                setFormValues((prevValues) => ({
                    ...prevValues,
                    image_path: reader.result // Base64 string for preview
                }));
            };
            reader.readAsDataURL(file); // Trigger the read
        }
    };

    const handleImageUpload = async () => {
        if (!image) return null;

        const storageRef = ref(storage, `dog_images/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        return await getDownloadURL(storageRef);
    };

    const validateForm = () => {
        const formErrors = {};
        if (!formValues.name) formErrors.name = 'Name is required';
        if (!formValues.date_of_birth) formErrors.date_of_birth = 'Date of Birth is required';
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission
        setServerError(null); // Reset server error on new submission
        if (isSubmitting) return;
        setIsSubmitting(true);

        let imageUrl = formValues.image_path;
        if (image) {
            imageUrl = await handleImageUpload();
        }

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            const submissionData = {
                ...formValues,
                image_path: imageUrl,
            };

            const response = await axios.post(
                `${backEndUrl}/profiles/owner/${userId}/profiles`,
                submissionData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getToken()}`
                    },
                }
            );

            if (response.status === 201) {
                console.log('Dog profile created:', response.data);
                setFormValues({
                    name: '',
                    breed: '',
                    date_of_birth: '',
                    weight: '',
                    sex: '',
                    fixed: false,
                    chip_number: '',
                    image_path: '',
                    vet_clinic_name: '',
                    vet_doctor_name: '',
                    vet_clinic_phone: '',
                    vet_clinic_email: ''
                });
                setErrors({});
                setDogProfileData(response.data);
                console.log('Dog profile ID:', response.data.id);
                setCurrDogId(response.data.id);
                setLocalCurrDogId(response.data.id);
                navigate("/dogs/view");
            } else {
                setErrors({ submit: response.data.message });
            }
        } catch (err) {
            setServerError(err.message || 'Sign-up failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ mb: 20 }}>
            <Box width="80%">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ pt: 5 }}>

                        {/* Dog Information Header */}
                        <Grid container flexDirection="column" justifyContent="center" alignItems="center">
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Dog Information
                                </Typography>
                            </Grid>
                        </Grid>
                        {serverError && (
                            <Box mb={2}>
                                <Alert severity="error">{serverError}</Alert>
                            </Box>
                        )}
                        {/* Avatar and Upload Button */}
                        <Grid item xs={12} container justifyContent="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', ml: '10%' }}>
                                <Avatar
                                    alt="Dog's Image"
                                    src={formValues.image_path || ''}
                                    sx={{ width: 100, height: 100 }}
                                />
                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{ ml: 2, width: '10%', height: '25%' }}
                                >
                                    <Typography variant="caption" fontSize="55%" noWrap>
                                        ADD IMAGE
                                    </Typography>
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleImageChange}
                                    />
                                </Button>
                            </Box>
                        </Grid>

                        {/* Dog Information Fields */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                name="name"
                                label="Dog's Name"
                                variant="outlined"
                                value={formValues.name}
                                onChange={handleChange}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                name="breed"
                                label="Breed"
                                variant="outlined"
                                value={formValues.breed}
                                onChange={handleChange}
                                error={Boolean(errors.breed)}
                                helperText={errors.breed}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                name="date_of_birth"
                                label="Date of Birth"
                                variant="outlined"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formValues.date_of_birth}
                                onChange={handleChange}
                                error={Boolean(errors.date_of_birth)}
                                helperText={errors.date_of_birth}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                name="weight"
                                label="Weight"
                                variant="outlined"
                                value={formValues.weight}
                                onChange={handleChange}
                                error={Boolean(errors.weight)}
                                helperText={errors.weight}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined" error={Boolean(errors.sex)}>
                                <InputLabel>Sex</InputLabel>
                                <Select
                                    name="sex"
                                    label="Sex"
                                    value={formValues.sex}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                                {errors.sex && (
                                    <Typography variant="caption" color="error">
                                        {errors.sex}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="chip_number"
                                    label="Chip No."
                                    variant="outlined"
                                    value={formValues.chip_number}
                                    onChange={handleChange}
                                    error={Boolean(errors.chip_number)}
                                    helperText={errors.chip_number}
                                />
                            </Grid>
                        
                        <Grid item xs={12} >
                            <FormControlLabel
                                control={<Checkbox checked={formValues.fixed} onChange={handleChange} name="fixed" />}
                                label="Fixed"
                            />
                        </Grid>
                        

                        {/* Vet Information Header */}
                        <Grid item xs={12} sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Vet Information
                            </Typography>
                        </Grid>

                        {/* Vet Information Fields */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                name="vet_clinic_name"
                                label="Vet Clinic Name"
                                variant="outlined"
                                value={formValues.vet_clinic_name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                name="vet_doctor_name"
                                label="Veterinarian Name"
                                variant="outlined"
                                value={formValues.vet_doctor_name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                name="vet_clinic_phone"
                                label="Contact Phone Number"
                                variant="outlined"
                                value={formValues.vet_clinic_phone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                name="vet_clinic_email"
                                label="Contact Email"
                                variant="outlined"
                                value={formValues.vet_clinic_email}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12} sx={{ mt: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting} // Disable button during submission
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </Grid>

                    </Grid>
                </form>
            </Box>
        </Box>
    );
};

export default DogProfileCreate;