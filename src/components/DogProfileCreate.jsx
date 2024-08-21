import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Grid, Typography, TextField, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';
import { storage } from '../firebase'; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DogProfileCreate = () => {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const initialValues = {
        name: '',
        breed: '',
        age: '',
        weight: '',
        sex: '',
        fixed: false,
        microchipNumber: '',
        img_url: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        breed: Yup.string().required('Breed is required'),
        age: Yup.number().required('Age is required'),
        weight: Yup.number().required('Weight is required'),
        sex: Yup.string().required('Sex is required'),
        microchipNumber: Yup.string(),
        img_url: Yup.string().required('Image is required')
    });

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
            return url; // Return the URL for formik's state update
        }
    };

    const handleSubmit = async (values, actions) => {
        // Upload image and get URL before submitting the form
        if (image) {
            const imageUrl = await handleImageUpload();
            values.img_url = imageUrl; // Set the image URL in form values
        }
        // Submit the form data to the backend
        axios.post('/api/dogProfile', values)  // Replace '/api/dogProfile' with your actual route
            .then(response => {
                console.log(response.data);
                actions.resetForm();
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                as={TextField}
                                fullWidth
                                name="name"
                                label="Dog's Name"
                                variant="outlined"
                                error={Boolean(ErrorMessage.name)}
                                helperText={<ErrorMessage name="name" />}
                            />
                        </Grid>
                        {/* Other form fields for breed, age, etc. */}

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload Image
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => {
                                        handleImageChange(e);
                                        setFieldValue('img_url', e.target.value);
                                    }}
                                />
                            </Button>
                            <ErrorMessage name="img_url" component="div" />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default DogProfileCreate;