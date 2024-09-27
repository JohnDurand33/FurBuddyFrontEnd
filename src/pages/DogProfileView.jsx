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
import pencilOutline from '@iconify-icons/mdi/pencil-outline'; 
import CameraOutlineIcon from '@iconify-icons/mdi/camera-outline';
import { useNavigate } from 'react-router-dom';
import editIcon from '@iconify-icons/mdi/edit';
import mdiDeleteOutline from '@iconify-icons/mdi/delete-outline';
import { api } from '../utils/eventApi';

const DogProfileView = ({ isMobile }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const theme = useTheme();

    const { currUser, token, currDog, setCurrDog, setLocalCurrDog, fetchCurrDogProfiles } = useAuth();


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

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

    const handleImageUpload = async () => {
        if (!image) return currDog.image_path;
        const storageRef = ref(storage, `dog_images/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        return await getDownloadURL(snapshot.ref);
    };

    const handleDeleteProfile = async () => {
        try {
            setLoading(true);
            await axios.delete(`${backEndUrl}/profile/profiles/${currDog.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const hasDogs = await fetchCurrDogProfiles();
            if (!hasDogs) {
                navigate('/dogs/new');
            } else {
                navigate('/dogs/view');
            }
        } catch (error) {
            console.error('Error deleting dog profile:', error);
        } finally {
            setLoading(false);
            handleCloseModal();
        }
    };

    const fixedLabel = (values) => {
        if (values.sex === 'Male') return 'Neutered';
        if (values.sex === 'Female') return 'Spayed';
        return 'Spayed';
    };

    const handleSave = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        const imgUrl = await handleImageUpload();  // Handle image upload
        const updatedData = { ...values, image_path: imgUrl };

        try {
            const response = await axios.put(
                `${backEndUrl}/profile/profiles/${currDog.id}`,
                updatedData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            console.log('Update Dog Profile Response:', response.data);
            if (response.status === 200) {
                await fetchCurrDogProfiles();
                setIsEditing(false);
                resetForm();
                navigate('/dogs/view');
            }
        } catch (error) {
            console.error('Error updating dog profile:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Pet Name is required'),
        breed: Yup.string(),
        age: Yup.number('Age must be a number'),
        weight: Yup.number('Weight must be a number'),
        chip_number: Yup.number('Microchip Entry must be a number'),
        vet_clinic_name: Yup.string(),
        vet_doctor_name: Yup.string(),
        vet_clinic_phone: Yup.string(),
        vet_clinic_email: Yup.string().email('Invalid email format')
    });

    return (
        <Box sx={{ display: "flex", flexDirection: "column", ml: isMobile ? '60px' : 0 }}>
            <Grid container alignItems="center" justifyContent="center" spacing={4} >

                {!isEditing ? (
                    <>  
                        <Grid item xs={12} container justifyContent="center" ml={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'start', width: '100%', paddingRight: '30px', mb:5, mt:3, ml:3 }}>
                                <div style={{ position: 'relative', width: isMobile ? '150px' : '200px', height: isMobile ? '150px' : '200px',  }}>
                                    <Typography variant="h4" sx={{ color: '#666666', fontSize: '1.4rem', mb: 2, mt:-1, }}>
                                        Dog Information
                                    </Typography>
                                    <Avatar
                                        alt="Dog's Image"
                                        src={currDog ? currDog.image_path : "/static/images/avatar/1.jpg"}
                                        sx={{
                                            width: '100%', height: "100%", borderRadius: '50%',
                                            objectFit: 'cover', aspectRatio: '1', border: '2px solid #ccc'
                                        }}
                                    />
                                </div>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h5" sx={{ mt: 6, ml: 2, fontWeight: 600 }}>{currDog ? currDog.name : ''}</Typography>
                                    <Typography variant="h5" sx={{ mt: 2, ml: 2 }}>Chip # {currDog ? currDog.chip_number : ''}</Typography>
                                </Box>
                                <IconButton
                                    sx={{ position: 'absolute', top: 100, right: 0, borderColor: 'grey', mr: '8%' }}
                                    onClick={handleEditToggle}
                                >
                                    <Icon icon={editIcon} width="24" height="24" />
                                    <Typography>Edit</Typography>
                                </IconButton>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                ml:5,
                                backgroundColor: 'primary.main',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                padding: '2rem',
                                width: '520px',
                                height: '400px',
                                display: 'flex',
                                flexDirection: 'column',  // Ensure content stacks vertically
                            }}>
                                {/* Dog Information title alone at the top */}
                                <Typography variant="h4" sx={{ color: '#666666', fontSize: '1.4rem', mb: 2, mt: - 1, pl: 3 }}>
                                    Dog Information
                                </Typography>

                                {/* Dog details below */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6} >
                                        <Typography variant="subtitle1" sx={{ color: '#666666', fontSize: '1.2rem', pl: 3 }}>Name</Typography>
                                        <Typography variant="body1" sx={{ color: '#333333', fontSize: '1.1rem', pl: 3 }}>{currDog ? currDog.name : ''}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" sx={{ color: '#666666', fontSize: '1.2rem', pl: 3 }}>Breed</Typography>
                                        <Typography variant="body1" sx={{ color: '#333333', fontSize: '1.1rem', pl: 3 }}>{currDog ? currDog.breed : ''}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" sx={{ color: '#666666', fontSize: '1.2rem', pl: 3 }}>Age</Typography>
                                        <Typography variant="body1" sx={{ color: '#333333', fontSize: '1.1rem', pl: 3 }}>{currDog ? currDog.age : ''} years old</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" sx={{ color: '#666666', fontSize: '1.2rem', pl: 3 }}>Gender</Typography>
                                        <Typography variant="body1" sx={{ color: '#333333', fontSize: '1.1rem', pl: 3 }}>{currDog ? currDog.sex : ''}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" sx={{ color: '#666666', fontSize: '1.2rem', pl: 3 }}>Weight</Typography>
                                        <Typography variant="body1" sx={{ color: '#333333', fontSize: '1.1rem', pl: 3 }}>{currDog ? currDog.weight : ''}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" sx={{ color: '#666666', fontSize: '1.2rem', pl: 3 }}>{currDog.sex === 'Male' ? 'Neutered' : currDog.sex === 'Female' ? 'Spayed': 'Fiexed'}</Typography>
                                        <Typography variant="body1" sx={{ color: '#333333', fontSize: '1.1rem', pl: 3 }}>{currDog ? (currDog.fixed ? 'Yes' : 'No') : ''}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" sx={{ color: '#666666', fontSize: '1.2rem', pl: 3 }}>Microchip No.</Typography>
                                        <Typography variant="body1" sx={{ color: '#333333', fontSize: '1.1rem', pl: 3 }}>{currDog ? currDog.chip_number : ''}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                            {/* Vet Information Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                ml: 1,
                                backgroundColor: 'primary.main',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                padding: '2rem',
                                width: '520px',
                                height: '400px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                {/* Vet Information Title */}
                                <Typography variant="h4" sx={{ color: '#666666', fontSize: '1.4rem', mb: 2, mt:-1, pl: 3 }}>
                                    Vet Information
                                </Typography>

                                {/* Vet Information Grid */}
                                <Grid container spacing={3} >
                                    <Grid item xs={12} md={6} mb={7} >
                                        <Typography variant="subtitle1" sx={{ color: '#666666', fontSize: '1.2rem', pl: 3 }}>Vet Clinic Name</Typography>
                                        <Typography variant="body1" sx={{ color: '#333333', fontSize: '1.1rem', pl: 3 }}>{currDog ? currDog.vet_clinic_name : ''}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" sx={{ color: '#666666', fontSize: '1.2rem', pl: 3 }}>Vet Doctor Name</Typography>
                                        <Typography variant="body1" sx={{ color: '#333333', fontSize: '1.1rem', pl: 3 }}>{currDog ? currDog.vet_doctor_name : ''}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" sx={{ color: '#666666', fontSize: '1.2rem', pl: 3 }}>Vet Clinic Phone</Typography>
                                        <Typography variant="body1" sx={{ color: '#333333', fontSize: '1.1rem', pl: 3 }}>{currDog ? currDog.vet_clinic_phone : ''}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" sx={{ color: '#666666', fontSize: '1.2rem', pl: 3 }}>Vet Clinic Email</Typography>
                                        <Typography variant="body1" sx={{ color: '#333333', fontSize: '1.1rem', pl: 3 }}>{currDog ? currDog.vet_clinic_email : ''}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        

                        
                    </>
                ) : (
                    <>
                        <Grid item xs={12}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'start', marginTop:
                                        '2rem', marginLeft: 40
                                }}>
                                <div style={{ position: 'relative', width: isMobile ? '150px' : '200px', height: isMobile ? '150px' : '200px' }}>
                                    <Avatar
                                        alt="Dog's Image"
                                        src={imageUrl ? imageUrl : currDog ? currDog.image_path : "/static/images/avatar/1.jpg"}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            aspectRatio: '1',
                                        }}
                                    />
                                </div>
                                <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                                    <Typography variant="h5" sx={{ mt: 3, ml: 2, fontWeight: 600 }}>{currDog ? currDog.name : ''}</Typography>
                                    <Typography variant="h5" sx={{ mt: 1, ml: 2 }}>Chip No. {currDog ? currDog.chip_number : ''}</Typography>
                                    <div>
                                        <input
                                            accept="image/*"
                                            id="file-upload"
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={handleImageChange}
                                        />
                                        <label htmlFor="file-upload">
                                            <Button
                                                disableRipple={true}
                                                component="span"
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: 'secondary.main',
                                                    color: '#000',
                                                    border: '1px solid black',
                                                    minWidth: '140px',
                                                    margin: '20px 20px',
                                                    ml: 2,
                                                    borderRadius: '2px',
                                                    fontSize: '1rem',
                                                    width: 'fit-content',
                                                    boxShadow: 'none',
                                                    '&:hover': {
                                                        backgroundColor: 'secondary.main',
                                                        color: 'text.primary',
                                                        boxShadow: 'none',
                                                    }
                                                }}
                                            >
                                                Upload
                                            </Button>
                                        </label>
                                    </div>
                                </Box>
                            </div>
                        </Grid>

                        <Formik
                            initialValues={{
                                id: currDog?.id || '',
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
                                isSubmitting={submitting}
                            validationSchema={validationSchema}
                            enableReinitialize={true}
                            onSubmit={handleSave}
                        >
                            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                                <Form style={{  width: '95%' }}>
                                        <Grid container spacing={4}>
                                            {/* Dog Information Form Fields */}
                                            <Grid item xs={12} md={6} ml={2}>
                                                <Typography variant="h4" sx={{ mt: 4, mb: 2, color: '#666666', fontSize: '1.4rem', pl: 3 }}>
                                                    Dog Information
                                                </Typography>
                                                <Box sx={{ padding: '2rem', flexDirection: 'column' }}>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} md={6}>
                                                            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', color: '#666666', fontSize: '1.2rem', pl: '20px' }}>Pet Name</label>
                                                            <Field
                                                                type="text"
                                                                id="name"
                                                                name="name"
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', pl: '20px' }}
                                                            />
                                                            {touched.name && errors.name && <div style={{ color: 'red', paddingLeft: '20px' }}>{errors.name}</div>}
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <label htmlFor="breed" style={{ display: 'block', marginBottom: '0.5rem', color: '#666666', fontSize: '1.2rem', pl: '20px' }}>Breed</label>
                                                            <Field
                                                                type="text"
                                                                id="breed"
                                                                name="breed"
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', pl: '20px' }}
                                                            />
                                                            {touched.breed && errors.breed && <div style={{ color: 'red', paddingLeft: '20px' }}>{errors.breed}</div>}
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <label htmlFor="age" style={{ display: 'block', marginBottom: '0.5rem', color: '#666666', fontSize: '1.2rem', pl: '20px' }}>Age</label>
                                                            <Field
                                                                type="text"
                                                                id="age"
                                                                name="age"
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', pl: '20px' }}
                                                            />
                                                            {touched.age && errors.age && <div style={{ color: 'red', paddingLeft: '20px' }}>{errors.age}</div>}
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666666', fontSize: '1.2rem', pl: '20px' }}>Gender</label>
                                                            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
                                                                <Field type="radio" id="female" name="sex" value="Female" style={{ marginRight: '0.5rem' }} />
                                                                <label htmlFor="female" style={{ marginRight: '1rem' }}>Female</label>
                                                                <Field type="radio" id="male" name="sex" value="Male" style={{ marginRight: '0.5rem' }} />
                                                                <label htmlFor="male">Male</label>
                                                            </div>
                                                            {touched.sex && errors.sex && <div style={{ color: 'red', paddingLeft: '20px' }}>{errors.sex}</div>}
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <label htmlFor="weight" style={{ display: 'block', marginBottom: '0.5rem', color: '#666666', fontSize: '1.2rem', pl: '20px' }}>Weight (lbs)</label>
                                                            <Field
                                                                type="text"
                                                                id="weight"
                                                                name="weight"
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', pl: '20px' }}
                                                            />
                                                            {touched.weight && errors.weight && <div style={{ color: 'red', paddingLeft: '20px' }}>{errors.weight}</div>}
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666666', fontSize: '1.2rem', pl: '20px' }}>{currDog.sex === 'Male' ? 'Neutered' : currDog.sex === 'Female' ? 'Spayed' : 'Fiexed'}</label>
                                                            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
                                                                <Field type="radio" id="fixedYes" name="fixed" value="yes" style={{ marginRight: '0.5rem' }} />
                                                                <label htmlFor="fixedYes" style={{ marginRight: '1rem' }}>Yes</label>
                                                                <Field type="radio" id="fixedNo" name="fixed" value="no" style={{ marginRight: '0.5rem' }} />
                                                                <label htmlFor="fixedNo">No</label>
                                                            </div>
                                                            {touched.fixed && errors.fixed && <div style={{ color: 'red', paddingLeft: '20px' }}>{errors.fixed}</div>}
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <label htmlFor="chip_number" style={{ display: 'block', marginBottom: '0.5rem', color: '#666666', fontSize: '1.2rem', pl: '20px' }}>Microchip No.</label>
                                                            <Field
                                                                type="text"
                                                                id="chip_number"
                                                                name="chip_number"
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', pl: '20px' }}
                                                            />
                                                            {touched.chip_number && errors.chip_number && <div style={{ color: 'red', paddingLeft: '20px' }}>{errors.chip_number}</div>}
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Grid>

                                            {/* Vet Information Form Fields */}
                                            <Grid item xs={12} md={6} ml={-2}>
                                                <Typography variant="h4" sx={{ mt: 4, mb: 2, color: '#666666', fontSize: '1.4rem', pl: 3 }}>
                                                    Vet Information
                                                </Typography>
                                                <Box sx={{ padding: '2rem', flexDirection: 'column' }}>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} md={6}>
                                                            <label htmlFor="vet_clinic_name" style={{ display: 'block', marginBottom: '0.5rem', color: '#666666', fontSize: '1.2rem', pl: '20px' }}>Vet Clinic Name</label>
                                                            <Field
                                                                type="text"
                                                                id="vet_clinic_name"
                                                                name="vet_clinic_name"
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', pl: '20px' }}
                                                            />
                                                            {touched.vet_clinic_name && errors.vet_clinic_name && <div style={{ color: 'red', paddingLeft: '20px' }}>{errors.vet_clinic_name}</div>}
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <label htmlFor="vet_doctor_name" style={{ display: 'block', marginBottom: '0.5rem', color: '#666666', fontSize: '1.2rem', pl: '20px' }}>Vet Doctor Name</label>
                                                            <Field
                                                                type="text"
                                                                id="vet_doctor_name"
                                                                name="vet_doctor_name"
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', pl: '20px' }}
                                                            />
                                                            {touched.vet_doctor_name && errors.vet_doctor_name && <div style={{ color: 'red', paddingLeft: '20px' }}>{errors.vet_doctor_name}</div>}
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <label htmlFor="vet_clinic_phone" style={{ display: 'block', marginBottom: '0.5rem', color: '#666666', fontSize: '1.2rem', pl: '20px' }}>Vet Clinic Phone</label>
                                                            <Field
                                                                type="text"
                                                                id="vet_clinic_phone"
                                                                name="vet_clinic_phone"
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', pl: '20px' }}
                                                            />
                                                            {touched.vet_clinic_phone && errors.vet_clinic_phone && <div style={{ color: 'red', paddingLeft: '20px' }}>{errors.vet_clinic_phone}</div>}
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <label htmlFor="vet_clinic_email" style={{ display: 'block', marginBottom: '0.5rem', color: '#666666', fontSize: '1.2rem', pl: '20px' }}>Vet Clinic Email</label>
                                                            <Field
                                                                type="email"
                                                                id="vet_clinic_email"
                                                                name="vet_clinic_email"
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', pl: '20px' }}
                                                            />
                                                            {touched.vet_clinic_email && errors.vet_clinic_email && <div style={{ color: 'red', paddingLeft: '20px' }}>{errors.vet_clinic_email}</div>}
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Grid>


                                            <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 0, width: '90%', ml:10}}>
                                                {/* Left: Delete Profile with Icon */}
                                                <Grid item>
                                                    <Button
                                                        startIcon={<Icon icon={mdiDeleteOutline} />}
                                                        onClick={handleOpenModal}
                                                        sx={{
                                                            color: "red",
                                                            backgroundColor: "transparent",
                                                            borderColor: "transparent",
                                                            '&:hover': {
                                                                backgroundColor: 'transparent',
                                                                color: 'darkred'
                                                            },
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        Delete Profile
                                                    </Button>
                                                </Grid>

                                                {/* Right: Cancel and Save Changes Buttons */}
                                                <Grid item sx={{ display: 'flex', gap: '1rem' }}>
                                                    <Button
                                                        sx={{
                                                            variant: "outlined",
                                                            color: "black",
                                                            border: "1px solid grey",
                                                            minWidth: '120px',
                                                        }}
                                                        onClick={handleEditToggle}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        sx={{
                                                            variant: "contained",
                                                            backgroundColor: theme.palette.secondary.main,
                                                            color: theme.palette.text.primary,
                                                            border: "1px solid grey",
                                                            minWidth: '140px',
                                                        }}
                                                        
                                                    >
                                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                                    </Button>
                                                </Grid>

                                                {/* Delete Confirmation Modal */}
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
                                                            minWidth: 400,
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