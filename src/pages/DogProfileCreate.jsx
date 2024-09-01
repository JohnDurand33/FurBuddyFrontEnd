import { Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../config/firebase.js';
import { useAuth } from '../context/AuthContext';
import { backEndUrl } from '../utils/config.js';
import { getToken, getUserId } from '../utils/localStorage.js';


const DogProfileCreate = () => {
    const { userId } = useAuth();
    const navigate = useNavigate()
    console.log("DogProfileCreate component rendered"); // Initial render log

    const [formValues, setFormValues] = useState({
        name: '',
        breed: '',
        date_of_birth: '',
        weight: '',
        sex: '',
        fixed: false,
        chip_number: '',
        image_path: ''  // Using image_path to store the URL
    });

    const [errors, setErrors] = useState({});
    const [image, setImage] = useState(null);
    const [imagePath, setImagePath] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log("Image selected:", file); // Log selected image

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
            setImage(file);
            setFormValues((prevValues) => ({
                ...prevValues,
                image_path: reader.result // This will be the base64-encoded image
            }));
        };
        reader.readAsDataURL(file); // Read the image as a data URL
        console.log("Image path:", reader.result); // Log the image path
        }
    };

    const handleImageUpload = async () => {
        if (image) {
            console.log("Uploading image:", image.name); // Log before upload
            const storageRef = ref(storage, `dog_images/${image.name}`);
            await uploadBytes(storageRef, image);
            const url = await getDownloadURL(storageRef);
            setImagePath(url);
            console.log('Image uploaded:', url); // Log after upload

            // Update formValues with the image path after successful upload
            setFormValues((prevValues) => ({
                ...prevValues,
                image_path: url
            }));
            return url;
        }
        return null;
    };

    const validateForm = () => {
        console.log("Validating form"); // Log validation start
        let formErrors = {};

        if (!formValues.name) {
            formErrors.name = 'Name is required';
        }
        if (!formValues.date_of_birth) {
            formErrors.date_of_birth = 'Date of Birth is required';
        }

        setErrors(formErrors);
        console.log("Form validation errors:", formErrors); // Log validation errors
        return Object.keys(formErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log(`Field changed: ${name}, Value: ${value}`); // Log field changes
        setFormValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted"); // Log form submission

        // Handle image upload if an image is selected
        if (image) {
            await handleImageUpload();  // This will update formValues.image_path
        }

        // If no image was uploaded, set image_path to an empty string
        if (!formValues.image_path) {
            setFormValues((prevValues) => ({
                ...prevValues,
                image_path: ''
            }));
        }

        // Perform form validation after setting image_path
        if (!validateForm()) {
            console.log("Form validation failed"); // Log failed validation
            return;
        }

        console.log("Form validation passed"); // Log successful validation

        try {
            const submissionData = { ...formValues };
            
            console.log("Submitting form data:", submissionData); // Log data being submitted
            const response = await axios.post(
                `${backEndUrl}/owners/owner/${userId}/profiles`,
                submissionData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getToken()}`
                    },
                }
            );

            if (response.status === 201) {
                console.log('Dog profile created successfully:', response.data); // Log successful submission
                // Reset form state
                setFormValues({
                    name: '',
                    breed: '',
                    date_of_birth: '',
                    weight: '',
                    sex: '',
                    fixed: false,
                    chip_number: '',
                    image_path: ''  // Clear image_path after successful submission
                });
                setErrors({});
                setImage(null);
                navigate("/dogs/view")
            } else {
                console.error('Error creating dog profile:', response.data);
                setErrors({ submit: response.data.message });
            }
        } catch (err) {
            console.error('Error during form submission:', err);
            setErrors({ submit: 'An error occurred. Please try again later.' });
        }
    };

    return (
        <Box display="flex" flexdirection="column"justifyContent="center" alignItems="center"sx={{mb:20}}> 
        <Box width="80%">
        <form onSubmit={handleSubmit} >
                <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ pt: 5 }}>
                {/* Avatar and Upload Button */}
                <Grid item xs={12} container justifyContent="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', ml: '10%' }}>
                        {/* Center the Avatar */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar
                                alt="Dog's Image"
                                src={formValues.image_path || ''}
                                sx={{ width: 100, height: 100 }}
                            />
                        </Box>
                        {/* Button to the right of Avatar */}
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

                {/* Dog's Name */}
                <Grid item xs={12} style={{ margin: '0 auto', width: '80%', paddingTop: '2.5rem' }}>
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

                {/* Breed */}
                <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
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

                {/* Date of Birth */}
                <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
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

                {/* Weight */}
                <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
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

                {/* Sex */}
                <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
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

                {/* Fixed */}
                <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
                    <FormControlLabel
                        control={<Checkbox checked={formValues.fixed} onChange={handleChange} name="fixed" />}
                        label="Fixed"
                    />
                </Grid>

                {/* Chip Number */}
                <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
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

                {/* Submit Button */}
                <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
            </form>
            </Box>
        </Box>
    );
};

export default DogProfileCreate;