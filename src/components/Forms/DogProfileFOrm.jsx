import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Grid, Typography, TextField, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';

const DogProfileForm = () => {

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

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        breed: Yup.string().required('Breed is required'),
        age: Yup.number().required('Age is required').min(0, 'Age must be a positive number'),
        weight: Yup.number().required('Weight is required').min(0, 'Weight must be a positive number'),
        sex: Yup.string().required('Sex is required'),
        img_url: Yup.string().url('Invalid URL format').required('Image URL is required'),
        microchipNumber: Yup.string(), // Optional field
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await axios.post('/api/dogs', values);
            console.log('Dog created successfully:', response.data);
            resetForm();
        } catch (error) {
            console.error('Error creating dog profile:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form>
                    <Box mb={2}>
                        <Typography variant="h5" component="h1" align="center">
                            Dog Profile Form
                        </Typography>
                    </Box>
                    <Box mb={2}>
                        <Field
                            name="name"
                            as={TextField}
                            label="Name"
                            fullWidth
                            required
                        />
                        <ErrorMessage name="name" component="div" className="error" />
                    </Box>
                    <Box mb={2}>
                        <Field
                            name="breed"
                            as={TextField}
                            label="Breed"
                            fullWidth
                            required
                        />
                        <ErrorMessage name="breed" component="div" className="error" />
                    </Box>
                    <Box mb={2}>
                        <Field
                            name="age"
                            type="number"
                            as={TextField}
                            label="Age"
                            fullWidth
                            required
                        />
                        <ErrorMessage name="age" component="div" className="error" />
                    </Box>
                    <Box mb={2}>
                        <Field
                            name="weight"
                            type="number"
                            as={TextField}
                            label="Weight (kg)"
                            fullWidth
                            required
                        />
                        <ErrorMessage name="weight" component="div" className="error" />
                    </Box>
                    <Box mb={2}>
                        <Field
                            name="sex"
                            as={TextField}
                            label="Sex"
                            select
                            fullWidth
                            required
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                        </Field>
                        <ErrorMessage name="sex" component="div" className="error" />
                    </Box>
                    <Box mb={2}>
                        <FormControlLabel
                            control={<Field name="fixed" as={Checkbox} />}
                            label="Fixed"
                        />
                    </Box>
                    <Box mb={2}>
                        <Field
                            name="microchipNumber"
                            as={TextField}
                            label="Microchip Number (optional)"
                            fullWidth
                        />
                        <ErrorMessage name="microchipNumber" component="div" className="error" />
                    </Box>
                    <Box mb={2}>
                        <input
                            id="dog_image_main"
                            name="dog_image_input"
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                setFieldValue('dog_image_main', event.currentTarget.files[0]);
                            }}
                        />
                        <ErrorMessage name="dog_image_main" component="div" className="error" />
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        sx={{ mb: 2 }}
                    >
                        Create Profile
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default DogProfileForm;