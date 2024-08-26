import React, { useState } from 'react';
import { Grid, Box, Avatar, Button, TextField, Typography } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CustomButton from '../components/CustomButton';

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
        chip_number: '',
        img_url: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        breed: Yup.string(),
        age: Yup.number(),
        weight: Yup.number(),
        sex: Yup.string(),
        fixed: Yup.boolean(),
        chip_number: Yup.string().optional().length(15, 'Microchip number must be 15 characters long.'),
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
            return url;
        }
    };

    const handleSubmit = async (values, actions) => {
        if (image) {
            const imageUrl = await handleImageUpload();
            values.img_url = imageUrl;
        }
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
                <Form>
                    <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ pt: 5 }}>
                        {/* Avatar and Upload Button */}
                        <Grid item xs={12} container justifyContent="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', ml:'10%'}}>
                                {/* Center the Avatar */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Avatar
                                        alt="Dog's Image"
                                        src={imageUrl || ""}
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
                                            onChange={(e) => {
                                                handleImageChange(e);
                                                setFieldValue('img_url', e.target.value);
                                            }}
                                        />
                                    </Button>
                                
                            </Box>
                        </Grid>

                        {/* Dog's Name */}
                        <Grid item xs={12} style={{ margin: '0 auto', width: '80%', paddingTop: '2.5rem' }}>
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

                        {/* Other Fields */}
                        <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
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
                        <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
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
                        <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
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
                        <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
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

                        {/* Submit Button */}
                        <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
                            <CustomButton
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Submit
                            </CustomButton>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default DogProfileCreate;