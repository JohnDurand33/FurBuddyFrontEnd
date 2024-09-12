import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../config/firebase';
import { Avatar, Box, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import CameraOutlineIcon from '@iconify-icons/mdi/camera-outline';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { backEndUrl } from '../utils/config';
import { useTheme } from '@mui/material/styles';

const DogProfileCreate = ({ isMobile }) => {
    const theme = useTheme();
    const { setLocalCurrUser, currUser, token, authed, setLocalCurrDog, setLocalDogProfiles } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFixed, setIsFixed] = useState(null);



    const handleFixedChange = (event) => {
        setIsFixed(event.target.value === 'yes');
    };

    const fixedLabel = values => values.sex === 'Female' ? 'Spayed' : 'Neutered';

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        breed: Yup.string(),
        date_of_birth: Yup.string().required('Date of Birth is required'),
        weight: Yup.number().positive('Weight must be positive'),
        sex: Yup.string().oneOf(['Male', 'Female'], 'Invalid Gender').required('Gender is required'),
        chip_number: Yup.string(),
        image_path: Yup.string(),
        vet_clinic_name: Yup.string(),
        vet_doctor_name: Yup.string(),
        vet_clinic_phone: Yup.string(),
        vet_clinic_email: Yup.string().email('Invalid email'),
    });

    const handleImageChange = (e, setFieldValue) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(file);
                setImageUrl(reader.result); // Base64 string for preview
                setFieldValue('image_path', reader.result); // Update Formik field value
            };
            reader.readAsDataURL(file); // Trigger the read
        }
    };

    const handleImageUpload = async () => {
        if (image) {
            const storageRef = ref(storage, `dog_images/${Date.now()}_${image.name}`);
            const snapshot = await uploadBytes(storageRef, image);
            return await getDownloadURL(snapshot.ref);
        };
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setServerError(null);
        setIsSubmitting(true);
        let imageUploadUrl = imageUrl;
        if (image) {
            imageUploadUrl = await handleImageUpload();
        }

        const submissionData = {
            ...values,
            image_path: imageUploadUrl,
        };

        console.log("submissionData", submissionData);

        try {
            const response = await axios.post(`${backEndUrl}/profile/profiles`,
                submissionData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                }
            );
            console.log("creat dog response data", response.data);
            setLocalCurrDog(response.data);

            const res = await axios.get(`${backEndUrl}/profile/profiles`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
            });
            console.log("fetch dogProfiles response data after create", res.data);
            setLocalDogProfiles(res.data);
            navigate(`/dogs/view`);
        } catch (err) {
            setServerError(err.message || 'Profile creation failed. Please try again.');
        } finally {
            setIsSubmitting(false);
            resetForm();
        }
    };


    return (
        <div style={{ maxWidth: '80%', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{
                textAlign: isMobile ? 'center' : 'start',
                fontSize: isMobile ? '1.5rem' : '2rem',
            }}>Input Your Pet's Information Below</h1>

            <Formik
                initialValues={{
                    name: '',
                    breed: '',
                    date_of_birth: '',
                    weight: '',
                    sex: '',
                    fixed: true,
                    chip_number: '',
                    image_path: '',
                    vet_clinic_name: '',
                    vet_doctor_name: '',
                    vet_clinic_phone: '',
                    vet_clinic_email: ''
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, setFieldValue }) => (
                    <Form>
                        {/* Image Upload */}
                        <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', marginBottom: '2rem' }}>
                            <Avatar
                                alt="Dog Avatar"
                                src={imageUrl || values.image_path || "/static/images/avatar/1.jpg"} 
                                sx={{ width: 100, height: 100 }}
                            />
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
                                <label htmlFor="image_path" style={{ marginLeft: '10px' }}>Upload Image:</label>
                                <input
                                    type="file"
                                    id="image_path"
                                    name="image_path"
                                    style={{ display: 'none' }} 
                                    onChange={(e) => handleImageChange(e, setFieldValue)}
                                />
                            </Box>
                        </div>

                        <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>Basic Pet Information</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                            {/* Pet Name */}
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

                            {/* Breed */}
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

                            {/* DOB */}
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

                            {/* Gender */}
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

                            {/* Weight */}
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

                            {/* Fixed Status */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>{fixedLabel(values)} Status</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="radio"
                                        id="fixedYes"
                                        name="fixed"
                                        value="yes"
                                        checked={isFixed === true}
                                        style={{ marginRight: '0.5rem' }}
                                        onChange={handleFixedChange}
                                    />
                                    <label htmlFor="fixedYes" style={{ marginRight: '1rem' }}>Yes</label>
                                    <input
                                        type="radio"
                                        id="fixedNo"
                                        name="fixed"
                                        value="no"
                                        checked={isFixed === false}
                                        style={{ marginRight: '0.5rem' }}
                                        onChange={handleFixedChange}
                                    />
                                    <label htmlFor="fixedNo">No</label>
                                </div>
                                {touched.fixed && errors.fixed && <div style={{ color: 'red' }}>{errors.fixed}</div>}
                            </div>

                            {/* Microchip Number */}
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

                        <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>Basic Vet Information</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                            {/* Vet Clinic Name */}
                            <div>
                                <label htmlFor="vet_clinic_name" style={{ display: 'block', marginBottom: '0.5rem' }}>Clinic Name</label>
                                <Field
                                    type="text"
                                    id="vet_clinic_name"
                                    name="vet_clinic_name"
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    className={touched.vet_clinic_name && errors.vet_clinic_name ? 'error' : ''}
                                />
                                {touched.vet_clinic_name && errors.vet_clinic_name && <div style={{ color: 'red' }}>{errors.vet_clinic_name}</div>}
                            </div>

                            {/* Veterinarian Name */}
                            <div>
                                <label htmlFor="vet_doctor_name" style={{ display: 'block', marginBottom: '0.5rem' }}>Vet Name</label>
                                <Field
                                    type="text"
                                    id="vet_doctor_name"
                                    name="vet_doctor_name"
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    className={touched.vet_doctor_name && errors.vet_doctor_name ? 'error' : ''}
                                />
                                {touched.vet_doctor_name && errors.vet_doctor_name && <div style={{ color: 'red' }}>{errors.vet_doctor_name}</div>}
                            </div>

                            {/* Vet Clinic Phone */}
                            <div>
                                <label htmlFor="vet_clinic_phone" style={{ display: 'block', marginBottom: '0.5rem' }}>Vet Phone</label>
                                <Field
                                    type="text"
                                    id="vet_clinic_phone"
                                    name="vet_clinic_phone"
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    className={touched.vet_clinic_phone && errors.vet_clinic_phone ? 'error' : ''}
                                />
                                {touched.vet_clinic_phone && errors.vet_clinic_phone && <div style={{ color: 'red' }}>{errors.vet_clinic_phone}</div>}
                            </div>

                            {/* Vet Clinic Email */}
                            <div>
                                <label htmlFor="vet_clinic_email" style={{ display: 'block', marginBottom: '0.5rem' }}>Vet Email</label>
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

                        {/* Submit Button */}
                        <div style={{ textAlign: 'center' }}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    padding: '0.75rem 2rem',
                                    backgroundColor: theme.palette.secondary.main,
                                    border: 'none',
                                    borderRadius: '5px',
                                    color: 'black',
                                    cursor: 'pointer'
                                }}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default DogProfileCreate;