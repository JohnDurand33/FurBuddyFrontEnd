import React, { useEffect, useState } from 'react';
import { Grid, Box, Avatar, Button, Typography, IconButton } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import * as Yup from 'yup';
import axios from 'axios';
import { auth, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { backEndUrl } from '../utils/config';
import { Icon } from '@iconify/react';
import CameraOutlineIcon from '@iconify-icons/mdi/camera-outline';


const DogProfileView = ({ getMarginLeft, isMobile }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true); // New loading state
    const theme = useTheme();

    const { userId, token, currDogId, dogProfile, updateEmptyStateFromLocalStorage, getCurrDogId, getUserId, getToken, getUser, getDogProfile, updateDogProfile, setDogProfile, setLocalDogProfile, setCurrDogId, setLocalCurrDogId } = useAuth();

    useEffect(() => {
        updateEmptyStateFromLocalStorage(); // Update state from local storage
    }, []);

    useEffect(() => {
        const fetchDogProfile = async () => {
            setLoading(true);
            const storedDogProfile = getDogProfile();

            if (storedDogProfile) {
                console.log('Loaded dog profile:', storedDogProfile);
                setDogProfile(storedDogProfile);
                setImageUrl(storedDogProfile.image_path); // Set the image URL if available
            } else {
                console.warn('No dog profile found in local storage.');
            }

            setLoading(false); // Ensure loading is false even if there's no profile
        };

        fetchDogProfile();
    }, [getDogProfile]);

    if (loading) {
        console.log('Loading state active...');
        return <Typography>Loading...</Typography>;
    }

    if (!dogProfile) {
        console.log('No dog profile data available.');
        return <Typography>No dog profile found. Please create one.</Typography>;
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        breed: Yup.string(),
        date_of_birth: Yup.string().required('Date of Birth is required'),
        weight: Yup.number().positive('Weight must be positive'),
        sex: Yup.string().oneOf(['Male', 'Female'], 'Invalid Gender').required('Gender is required'),
        chip_number: Yup.string(),
        vet_clinic_name: Yup.string(),
        vet_doctor_name: Yup.string(),
        vet_clinic_phone: Yup.string(),
        vet_clinic_email: Yup.string().email('Invalid email'),
    });

    const handleImageChange = (e, setFieldValue) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setImage(file);
                setImageUrl(reader.result); // Base64 string for preview
                setFieldValue('image_path', reader.result); // Update Formik field value
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!image) return dogProfile.img_url;
        const storageRef = ref(storage, `dog_images/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        return await getDownloadURL(snapshot.ref);
    };

    const handleSave = async (values, { setSubmitting }) => {
        const img_url = await handleImageUpload();
        const updatedData = { ...values, image_path: img_url };

        try {
            const response = await axios.put(
                `${backEndUrl}/profiles/owner/${userId}/profiles/${currDogId}`,
                updatedData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                }
            );
            if (response.status !== 200) {
                console.error('Failed to update profile');
                return;
            }
            updateDogProfile(updatedData);
            setDogProfile(updatedData);
            setLocalDogProfile(updatedData);
            setImageUrl(updatedData.image_path);
            setLocalCurrDogId(updatedData.id);
            setCurrDogId(updatedData.id);
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const fixedLabel = values => values.sex === 'Female' ? 'Spayed' : 'Neutered';

    if (loading) {
        return <Typography>Loading...</Typography>; // Simple loading indicator
    }

    return (
        <Box sx={{
            padding: 3,
            color: 'text.primary',
            ml: isMobile ? '20px' : 0,
        }}>
            <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ pt: 5 }}>
                <Grid item xs={12} container justifyContent="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: 'fit-content' }}>
                        <Avatar
                            alt="Dog's Image"
                            src={imageUrl || dogProfile.amiage_path || ""}
                            sx={{ width: 150, height: 150, color: 'text.primary' }}
                        />
                        {isEditing && (
                            <Box display="flex" alignItems="center">
                                <IconButton
                                    sx={{
                                        height: '20px',
                                        borderRadius: '50%',
                                        marginLeft: '10px',
                                        backgroundColor: 'transparent',
                                        '&:hover': { backgroundColor: 'transparent' }
                                    }}
                                >
                                    <Icon icon={CameraOutlineIcon} width="24" height="24" />
                                </IconButton>
                                <label htmlFor="image_upload" style={{ marginLeft: '10px' }}>Upload Image:</label>
                                <input
                                    type="file"
                                    id="image_upload"
                                    name="image_upload"
                                    style={{ display: 'none' }} // Hide the actual file input
                                    onChange={(e) => handleImageChange(e, setFieldValue)}
                                />
                            </Box>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
                    <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                        Dog Information
                    </Typography>
                </Grid>

                {!isEditing ? (
                    <>
                        {/* View Mode */}
                        <Grid container spacing={2} style={{ margin: '0 auto', width: '80%' }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">Name: {dogProfile.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">Breed: {dogProfile.breed}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">DOB: {dogProfile.date_of_birth}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">Weight: {dogProfile.weight}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">Sex: {dogProfile.sex}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">Fixed: {dogProfile.fixed ? 'Yes' : 'No'}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">Chip Number: {dogProfile.chip_number}</Typography>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
                            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                                Vet Information
                            </Typography>
                        </Grid>

                        <Grid container spacing={2} style={{ margin: '0 auto', width: '80%' }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">Vet Clinic Name: {dogProfile.vet_clinic_name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">Vet Doctor Name: {dogProfile.vet_doctor_name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">Vet Clinic Phone: {dogProfile.vet_clinic_phone}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">Vet Clinic Email: {dogProfile.vet_clinic_email}</Typography>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <Button variant="contained" color="primary" onClick={handleEditToggle}>
                                Edit Profile
                            </Button>
                        </Grid>
                    </>
                ) : (
                    <>
                        {/* Edit Mode */}
                        <Formik
                            initialValues={dogProfile}
                            validationSchema={validationSchema}
                            enableReinitialize={true}
                            onSubmit={handleSave}
                        >
                            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                                <Form style={{ margin: '0 auto', width: '80%' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                        <div>
                                            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>Pet Name</label>
                                            <Field
                                                type="text"
                                                id="name"
                                                name="name"
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                className={touched.name && errors.name ? 'error' : ''}
                                            />
                                            {touched.name && errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="breed" style={{ display: 'block', marginBottom: '0.5rem' }}>Breed</label>
                                            <Field
                                                type="text"
                                                id="breed"
                                                name="breed"
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                className={touched.breed && errors.breed ? 'error' : ''}
                                            />
                                            {touched.breed && errors.breed && <div style={{ color: 'red' }}>{errors.breed}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="date_of_birth" style={{ display: 'block', marginBottom: '0.5rem' }}>DOB</label>
                                            <Field
                                                type="date"
                                                id="date_of_birth"
                                                name="date_of_birth"
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                className={touched.date_of_birth && errors.date_of_birth ? 'error' : ''}
                                            />
                                            {touched.date_of_birth && errors.date_of_birth && <div style={{ color: 'red' }}>{errors.date_of_birth}</div>}
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Gender</label>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Field
                                                    type="radio"
                                                    id="female"
                                                    name="sex"
                                                    value="Female"
                                                    style={{ marginRight: '0.5rem' }}
                                                />
                                                <label htmlFor="female" style={{ marginRight: '1rem' }}>Female</label>
                                                <Field
                                                    type="radio"
                                                    id="male"
                                                    name="sex"
                                                    value='Male'
                                                    style={{ marginRight: '0.5rem' }}
                                                />
                                                <label htmlFor="male">Male</label>
                                            </div>
                                            {touched.sex && errors.sex && <div style={{ color: 'red' }}>{errors.sex}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="weight" style={{ display: 'block', marginBottom: '0.5rem' }}>Weight (lbs)</label>
                                            <Field
                                                type="text"
                                                id="weight"
                                                name="weight"
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                className={touched.weight && errors.weight ? 'error' : ''}
                                            />
                                            {touched.weight && errors.weight && <div style={{ color: 'red' }}>{errors.weight}</div>}
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>{fixedLabel(values)} Status</label>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="radio"
                                                    id="fixedYes"
                                                    name="fixed"
                                                    value="yes"
                                                    checked={values.fixed === true}
                                                    style={{ marginRight: '0.5rem' }}
                                                    onChange={() => setFieldValue('fixed', true)}
                                                />
                                                <label htmlFor="fixedYes" style={{ marginRight: '1rem' }}>Yes</label>
                                                <input
                                                    type="radio"
                                                    id="fixedNo"
                                                    name="fixed"
                                                    value="no"
                                                    checked={values.fixed === false}
                                                    style={{ marginRight: '0.5rem' }}
                                                    onChange={() => setFieldValue('fixed', false)}
                                                />
                                                <label htmlFor="fixedNo">No</label>
                                            </div>
                                            {touched.fixed && errors.fixed && <div style={{ color: 'red' }}>{errors.fixed}</div>}
                                        </div>

                                        <div style={{ gridColumn: '1 / 3' }}>
                                            <label htmlFor="chip_number" style={{ display: 'block', marginBottom: '0.5rem' }}>Microchip No.</label>
                                            <Field
                                                type="text"
                                                id="chip_number"
                                                name="chip_number"
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                className={touched.chip_number && errors.chip_number ? 'error' : ''}
                                            />
                                            {touched.chip_number && errors.chip_number && <div style={{ color: 'red' }}>{errors.chip_number}</div>}
                                        </div>
                                    </div>

                                    <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>Vet Information</h2>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                        <div>
                                            <label htmlFor="vet_clinic_name" style={{ display: 'block', marginBottom: '0.5rem' }}>Vet Clinic Name</label>
                                            <Field
                                                type="text"
                                                id="vet_clinic_name"
                                                name="vet_clinic_name"
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                className={touched.vet_clinic_name && errors.vet_clinic_name ? 'error' : ''}
                                            />
                                            {touched.vet_clinic_name && errors.vet_clinic_name && <div style={{ color: 'red' }}>{errors.vet_clinic_name}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="vet_doctor_name" style={{ display: 'block', marginBottom: '0.5rem' }}>Vet Doctor Name</label>
                                            <Field
                                                type="text"
                                                id="vet_doctor_name"
                                                name="vet_doctor_name"
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                className={touched.vet_doctor_name && errors.vet_doctor_name ? 'error' : ''}
                                            />
                                            {touched.vet_doctor_name && errors.vet_doctor_name && <div style={{ color: 'red' }}>{errors.vet_doctor_name}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="vet_clinic_phone" style={{ display: 'block', marginBottom: '0.5rem' }}>Vet Clinic Phone</label>
                                            <Field
                                                type="text"
                                                id="vet_clinic_phone"
                                                name="vet_clinic_phone"
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                className={touched.vet_clinic_phone && errors.vet_clinic_phone ? 'error' : ''}
                                            />
                                            {touched.vet_clinic_phone && errors.vet_clinic_phone && <div style={{ color: 'red' }}>{errors.vet_clinic_phone}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="vet_clinic_email" style={{ display: 'block', marginBottom: '0.5rem' }}>Vet Clinic Email</label>
                                            <Field
                                                type="email"
                                                id="vet_clinic_email"
                                                name="vet_clinic_email"
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                className={touched.vet_clinic_email && errors.vet_clinic_email ? 'error' : ''}
                                            />
                                            {touched.vet_clinic_email && errors.vet_clinic_email && <div style={{ color: 'red' }}>{errors.vet_clinic_email}</div>}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Saving..." : "Save Changes"}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={handleEditToggle}
                                            sx={{ ml: 2 }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
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