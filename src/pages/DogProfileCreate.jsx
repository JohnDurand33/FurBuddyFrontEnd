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
        chip_number: '',  // updated field name to match the backend
        img_url: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        breed: Yup.string().required('Breed is required'),
        age: Yup.number().required('Age is required'),
        weight: Yup.number().required('Weight is required'),
        sex: Yup.string().required('Sex is required'),
        fixed: Yup.boolean(),
        chip_number: Yup.string().required('Microchip number is required.').length(15, 'Microchip number must be 15 characters long.'),  // Added validation
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
        // Submit form data
        await axios.post('/api/dogprofile', values);
        actions.setSubmitting(false);
        actions.resetForm();
    };

    return (

        <Formik
            
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, errors, touched }) => (
                <Form >
                    <Grid container spacing={2} sx={{ pt: 5 }}>
                        <Grid item 
                            style={{ margin: '0 auto', width:'80%' }} >
                            <Field
                                as={TextField}
                                fullWidth
                                name="name"
                                label="Dog's Name"
                                variant="outlined"
                                error={Boolean(errors.name && touched.name)}
                                helperText={<ErrorMessage name="name" />}
                            />
                        </Grid>
                        <Grid item 
                            style={{ margin: '0 auto', width:'80%' }} >
                            <Field
                                as={TextField}
                                fullWidth
                                name="breed"
                                label="Breed"
                                variant="outlined"
                                error={Boolean(ErrorMessage.breed)}
                                helperText={<ErrorMessage name="breed" />}
                            />
                        </Grid>
                        <Grid item 
                            style={{ margin: '0 auto', width:'80%' }} >
                            <Field
                                as={TextField}
                                fullWidth
                                name="age"
                                label="Age"
                                variant="outlined"
                                error={Boolean(ErrorMessage.age)}
                                helperText={<ErrorMessage name="age" />}
                            />
                        </Grid>
                        <Grid item 
                            style={{ margin: '0 auto', width:'80%' }} >
                            <Field
                                as={TextField}
                                fullWidth
                                name="weight"
                                label="Weight"
                                variant="outlined"
                                error={Boolean(ErrorMessage.weight)}
                                helperText={<ErrorMessage name="weight" />}
                            />
                        </Grid>
                        <Grid item 
                            style={{ margin: '0 auto', width:'80%' }} >
                            <Field
                                as={TextField}
                                fullWidth
                                name="sex"
                                label="Sex"
                                variant="outlined"
                                error={Boolean(ErrorMessage.sex)}
                                helperText={<ErrorMessage name="sex" />}
                            />
                        </Grid>
                        <Grid item 
                            style={{ margin: '0 auto', width:'80%' }} >
                            <FormControlLabel
                                control={<Field as={Checkbox} name="fixed" />}
                                label="Fixed"
                            />
                            <ErrorMessage name="fixed" component="div" />
                        </Grid>
                        <Grid item 
                            style={{ margin: '0 auto', width:'80%' }} >
                            <Field
                                as={TextField}
                                fullWidth
                                name="chip_number"
                                label="Microchip Number"
                                variant="outlined"
                                error={Boolean(ErrorMessage.chip_number)}
                                helperText={<ErrorMessage name="chip_number" />}
                            />
                        </Grid>
                        <Grid item 
                            style={{ margin: '0 auto', width:'80%' }} >
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

                        <Grid item 
                            style={{ margin: '0 auto', width:'80%' }} >
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