import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Box, Avatar, Typography, IconButton, Button, Modal } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Formik, Form, Field } from 'formik'; 
import * as Yup from 'yup'; 
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { backEndUrl } from '../utils/config';
import { Icon } from '@iconify/react';
import editIcon from '@iconify-icons/mdi/pencil-outline'; // Iconify edit icon
import pencilIcon from '@iconify-icons/mdi/pencil';
import CameraOutlineIcon from '@iconify-icons/mdi/camera-outline';
import { useNavigate } from 'react-router-dom';

const DogProfileView = ({ isMobile }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const theme = useTheme();

    const { currUser, token, currDog, setLocalCurrDog, dogProfiles, setLocalDogProfiles, fetchCurrDogProfiles, deleteDogProfile } = useAuth();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleLogData = () => {
        console.log('Current User:', currUser);
        console.log('Current Dog:', currDog);
        console.log('Dog Profiles:', dogProfiles);
    };

    // Close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    // Toggle Edit mode
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    // Handle image changes
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setImage(file);
                setImageUrl(reader.result); // Base64 string for preview
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle image upload to Firebase Storage
    const handleImageUpload = async () => {
        if (!image) return currDog.image_path;
        const storageRef = ref(storage, `dog_images/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        return await getDownloadURL(snapshot.ref);
    };

    // Handle deleting profile
    const handleDeleteProfile = async (currDog) => {
        try {
            console.log('Deleting dog profile:', currDog);
            const response = await deleteDogProfile(currDog);
            console.log(response.data);
            const newBackendProfiles = await fetchCurrDogProfiles(token);
            console.log('Deleted dog profile:', currDog);
            console.log('Updated dog profiles:', newBackendProfiles);
            setLocalDogProfiles(newBackendProfiles);
            if (newBackendProfiles.length == []) {
                navigate('/dogs/new');
            } else if (newBackendProfiles.length > 0) {
                setLocalCurrDog(newBackendProfiles[0]);
                navigate('/dogs/view');
            } else {
                console.log('No dog profiles found for user:', currUser);
            }
        } catch (error) {
            console.error('Error deleting dog profile:', error);
        } finally {
            
        }
    };

    const fixedLabel = (values) => {
        if (values.sex === 'Male') return 'Neutered';
        if (values.sex === 'Female') return 'Spayed';
        return 'Spayed'; 
    };

    // Handle saving updated data
    const handleSave = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        console.log("Saving form data:", values);
        const imgUrl = await handleImageUpload();
        const updatedData = { ...values, image_path: imgUrl };
        console.log('Updated form data?:', updatedData);

        try {
            const response = await axios.put(
                `${backEndUrl}/profile/profiles/${currDog.id}`,
                updatedData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                }
            );
            if (response.status === 200) {
                console.log('Updated dog profile successfully:', response.data);
                setLocalCurrDog(response.data);
                setImageUrl(response.data.image_path);

                const dogs = await fetchDogProfilesFromApi(token);
                setLocalDogProfiles(dogs);
                if (dogs && dogs.length > 0) {
                    navigate('/dogs/view');
                } else {
                    navigate('/dogs/new');
                }
            }
        } catch (error) {
            console.error('Error updating dog profile:', error);
        } finally {
            console.log('Updated dog profile:', currDog);
            console.log('Updated dog profiles:', dogProfiles);
            setIsEditing(false);
            setSubmitting(false);
            resetForm();
        }
    };

    // Yup validation schema for form
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Pet Name is required'),
        breed: Yup.string(),
        age: Yup.number().required('Age is required'),
        weight: Yup.number().required('Weight is required'),
        chip_number: Yup.string(),
        vet_clinic_name: Yup.string(),
        vet_doctor_name: Yup.string(),
        vet_clinic_phone: Yup.string(),
        vet_clinic_email: Yup.string().email('Invalid email format')
    });

    return (
        <Box sx={{ padding: 3, color: 'text.primary', ml: isMobile ? '60px' : 0 }}>
            <Grid container alignItems="center" justifyContent="center" spacing={4} sx={{ pt: 5 }}>

                {/* Profile image and Edit Button in top-right corner */}
                {!isEditing ? (
                    <>
                    <Grid item xs={12} container justifyContent="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'relative', paddingRight: '30px' }}>
                        {/* Dog Image */}
                        <Avatar
                            alt="Dog's Image"
                                    src={currDog ? currDog.image_path : "/static/images/avatar/1.jpg" }
                            sx={{ width: 150, height: 150, color: 'text.primary' }}
                        />

                        {/* Show Edit Button only when not editing */}
                            <IconButton
                                sx={{ position: 'absolute', top: 0, right: 0, borderColor:'grey' }}
                                onClick={handleEditToggle}
                            >
                                    <Icon icon={editIcon} width="24" height="24" />
                                    <Typography>Edit</Typography>
                                </IconButton>
                                <Button component={NavLink} to='/records' sx={{ color: theme.palette.text.primary }}>
                                    Home
                                </Button>
                    </Box>
                </Grid>

                        <Grid container spacing={4} justifyContent="center" style={{ marginTop: '1rem', width: '80%' }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
                                    Dog Information
                                </Typography>
                                <Box sx={{
                                    backgroundColor: '#FFF5CD',
                                    borderRadius: '10px',
                                    border: '1px solid #ccc',
                                    padding: '2rem', // Add padding
                                    minHeight: '180px'
                                }}>
                                    <Grid container spacing={3}> {/* Increase spacing */}
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Name: {currDog.name}</Typography> {/* Add margin-bottom */}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Breed: {currDog.breed}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Age: {currDog.age}</Typography> {/* Add margin-bottom */}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Weight: {currDog.weight}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Sex: {currDog.sex}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Fixed: {currDog.fixed ? 'Yes' : 'No'}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Chip Number: {currDog.chip_number}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>

                            {/* Vet Information */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
                                    Vet Information
                                </Typography>
                                <Box sx={{
                                    backgroundColor: '#FFF5CD',
                                    borderRadius: '10px',
                                    border: '1px solid #ccc',
                                    padding: '2rem', // Add padding
                                    minHeight: '180px'
                                }}>
                                    <Grid container spacing={3}> {/* Increase spacing */}
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Vet Clinic Name: {currDog.vet_clinic_name}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Vet Doctor Name: {currDog.vet_doctor_name}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Vet Clinic Phone: {currDog.vet_clinic_phone}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Vet Clinic Email: {currDog.vet_clinic_email}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="center" sx={{ mt: 4 }}>
                            <Button
                                onClick={handleDeleteProfile}
                                sx={{
                                    variant: "outlined",
                                    color: "text.primary",
                                    backgroundColor: theme.palette.secondary.main,
                                    borderColor: "grey",
                                }}>
                                Delete Profile
                            </Button>
                            <Modal
                                open={isModalOpen}
                                onClose={handleCloseModal}
                                aria-labelledby="delete-confirmation-modal"
                                aria-describedby="ask-for-confirmation"
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 400,
                                        bgcolor: 'background.paper',
                                        borderRadius: 2,
                                        boxShadow: 24,
                                        p: 4,
                                    }}
                                >
                                    <Typography id="delete-confirmation-modal" variant="h6" component="h2">
                                        Are you sure you want to delete this profile?
                                    </Typography>
                                    <Typography id="ask-for-confirmation" sx={{ mt: 2 }}>
                                        This action cannot be undone.
                                    </Typography>
                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleDeleteProfile}
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Deleting...' : 'Confirm'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={handleCloseModal}
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            </Modal>
                        </Grid>
                    </>
                ) : (
                        <>
                            {/* Avatar and Edit Button Positioned at the Top */}
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                                    <div style={{ position: 'relative', width:  isMobile ? '150px' : '200px' , height: isMobile ? '150px' : '200px' }}>
                                        <Avatar
                                            alt="Dog's Image"
                                            src={imageUrl || currDog.image_path || ""}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </div>

                                    {/* File Input Hidden */}
                                    <input
                                        accept="image/*"
                                        id="file-upload"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="file-upload">
                                        <IconButton
                                            component="span"
                                            style={{
                                                marginLeft: '1rem',
                                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                borderRadius: '50%',
                                                color: 'white',
                                                padding: '5px',
                                            }}
                                        >
                                            <Icon icon={CameraOutlineIcon} width="24" height="24" />
                                        </IconButton><Typography sx={{fontSize:'1rem', textAlign:"center"}}>Image</Typography>
                                    </label>
                                </div>
                            </Grid>


                        {/* Edit Mode */}
                        <Formik
                            initialValues={{
                                name: currDog?.name || '',  
                                breed: currDog?.breed || '',
                                age: currDog?.age || '',  
                                weight: currDog?.weight || '',
                                chip_number: currDog?.chip_number || '',
                                vet_clinic_name: currDog?.vet_clinic_name || '',
                                vet_doctor_name: currDog?.vet_doctor_name || '',
                                vet_clinic_phone: currDog?.vet_clinic_phone || '',
                                vet_clinic_email: currDog?.vet_clinic_email || ''
                            }}
                            validationSchema={validationSchema}
                            enableReinitialize={true}
                            onSubmit={handleSave}
                        >
                            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                                    <Form style={{ margin: '0 auto', width: '80%' }}>
                                        <Grid container spacing={3}> {/* Add container for grid layout */}
                                            <Grid item xs={12}>
                                                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                                                    Dog Information
                                                </Typography>
                                            </Grid>
                                            {/* Pet Name */}
                                            <Grid item xs={12} md={6}>
                                                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>Pet Name</label>
                                                <Field
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    className={touched.name && errors.name ? 'error' : ''}
                                                />
                                                {touched.name && errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                                            </Grid>
                                            {/* Breed */}
                                            <Grid item xs={12} md={6}>
                                                <label htmlFor="breed" style={{ display: 'block', marginBottom: '0.5rem' }}>Breed</label>
                                                <Field
                                                    type="text"
                                                    id="breed"
                                                    name="breed"
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    className={touched.breed && errors.breed ? 'error' : ''}
                                                />
                                                {touched.breed && errors.breed && <div style={{ color: 'red' }}>{errors.breed}</div>}
                                            </Grid>
                                            {/* Age */}
                                            <Grid item xs={12} md={6}>
                                                <label htmlFor="age" style={{ display: 'block', marginBottom: '0.5rem' }}>Age</label>
                                                <Field
                                                    type="text"
                                                    id="age"
                                                    name="age"
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    className={touched.age && errors.age ? 'error' : ''}
                                                />
                                                {touched.age && errors.age && <div style={{ color: 'red' }}>{errors.age}</div>}
                                            </Grid>
                                            {/* Gender */}
                                            <Grid item xs={12} md={6}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Gender</label>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Field type="radio" id="female" name="sex" value="Female" style={{ marginRight: '0.5rem' }} />
                                                    <label htmlFor="female" style={{ marginRight: '1rem' }}>Female</label>
                                                    <Field type="radio" id="male" name="sex" value="Male" style={{ marginRight: '0.5rem' }} />
                                                    <label htmlFor="male">Male</label>
                                                </div>
                                                {touched.sex && errors.sex && <div style={{ color: 'red' }}>{errors.sex}</div>}
                                            </Grid>
                                            {/* Weight */}
                                            <Grid item xs={12} md={6}>
                                                <label htmlFor="weight" style={{ display: 'block', marginBottom: '0.5rem' }}>Weight (lbs)</label>
                                                <Field
                                                    type="text"
                                                    id="weight"
                                                    name="weight"
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    className={touched.weight && errors.weight ? 'error' : ''}
                                                />
                                                {touched.weight && errors.weight && <div style={{ color: 'red' }}>{errors.weight}</div>}
                                            </Grid>
                                            {/* Fixed Status */}
                                            <Grid item xs={12} md={6}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>{fixedLabel(values)} Status</label>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Field type="radio" id="fixedYes" name="fixed" value="yes" checked={values.fixed === true} style={{ marginRight: '0.5rem' }} />
                                                    <label htmlFor="fixedYes" style={{ marginRight: '1rem' }}>Yes</label>
                                                    <Field type="radio" id="fixedNo" name="fixed" value="no" checked={values.fixed === false} style={{ marginRight: '0.5rem' }} />
                                                    <label htmlFor="fixedNo">No</label>
                                                </div>
                                                {touched.fixed && errors.fixed && <div style={{ color: 'red' }}>{errors.fixed}</div>}
                                            </Grid>
                                            {/* Microchip Number */}
                                            <Grid item xs={12}>
                                                <label htmlFor="chip_number" style={{ display: 'block', marginBottom: '0.5rem' }}>Microchip No.</label>
                                                <Field
                                                    type="text"
                                                    id="chip_number"
                                                    name="chip_number"
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    className={touched.chip_number && errors.chip_number ? 'error' : ''}
                                                />
                                                {touched.chip_number && errors.chip_number && <div style={{ color: 'red' }}>{errors.chip_number}</div>}
                                            </Grid>

                                            {/* Vet Information */}
                                            <Grid item xs={12}>
                                                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Vet Information</Typography>
                                            </Grid>
                                            {/* Vet Clinic Name */}
                                            <Grid item xs={12} md={6}>
                                                <label htmlFor="vet_clinic_name" style={{ display: 'block', marginBottom: '0.5rem' }}>Vet Clinic Name</label>
                                                <Field
                                                    type="text"
                                                    id="vet_clinic_name"
                                                    name="vet_clinic_name"
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    className={touched.vet_clinic_name && errors.vet_clinic_name ? 'error' : ''}
                                                />
                                                {touched.vet_clinic_name && errors.vet_clinic_name && <div style={{ color: 'red' }}>{errors.vet_clinic_name}</div>}
                                            </Grid>
                                            {/* Vet Doctor Name */}
                                            <Grid item xs={12} md={6}>
                                                <label htmlFor="vet_doctor_name" style={{ display: 'block', marginBottom: '0.5rem' }}>Vet Doctor Name</label>
                                                <Field
                                                    type="text"
                                                    id="vet_doctor_name"
                                                    name="vet_doctor_name"
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    className={touched.vet_doctor_name && errors.vet_doctor_name ? 'error' : ''}
                                                />
                                                {touched.vet_doctor_name && errors.vet_doctor_name && <div style={{ color: 'red' }}>{errors.vet_doctor_name}</div>}
                                            </Grid>
                                            {/* Vet Clinic Phone */}
                                            <Grid item xs={12} md={6}>
                                                <label htmlFor="vet_clinic_phone" style={{ display: 'block', marginBottom: '0.5rem' }}>Vet Clinic Phone</label>
                                                <Field
                                                    type="text"
                                                    id="vet_clinic_phone"
                                                    name="vet_clinic_phone"
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    className={touched.vet_clinic_phone && errors.vet_clinic_phone ? 'error' : ''}
                                                />
                                                {touched.vet_clinic_phone && errors.vet_clinic_phone && <div style={{ color: 'red' }}>{errors.vet_clinic_phone}</div>}
                                            </Grid>
                                            {/* Vet Clinic Email */}
                                            <Grid item xs={12} md={6}>
                                                <label htmlFor="vet_clinic_email" style={{ display: 'block', marginBottom: '0.5rem' }}>Vet Clinic Email</label>
                                                <Field
                                                    type="email"
                                                    id="vet_clinic_email"
                                                    name="vet_clinic_email"
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    className={touched.vet_clinic_email && errors.vet_clinic_email ? 'error' : ''}
                                                />
                                                {touched.vet_clinic_email && errors.vet_clinic_email && <div style={{ color: 'red' }}>{errors.vet_clinic_email}</div>}
                                            </Grid>

                                            {/* Buttons */}
                                            <Grid item xs={12} container justifyContent="center" style={{ marginTop: '2rem' }}>
                                                <Button type="submit" sx={{ variant: "contained", backgroundColor: theme.palette.secondary.main, color: "text.primary", border: "1px solid grey" }}>
                                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                                </Button>
                                                <Button sx={{ variant: "outlined", color: "black", border: "1px solid grey", ml: 2 }} onClick={handleEditToggle}>
                                                    Cancel
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Form>
                            )}
                        </Formik>
                    </>
                )}
            </Grid>
        </Box>
    );
};

export default DogProfileView;