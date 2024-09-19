import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import dayjs from 'dayjs';
import '../drawerStyles.css';
import { backEndUrl } from '../utils/config';
import { useRecords } from '../context/RecordsContext';

const ServiceDrawer = ({ isOpen, onClose, serviceData = null, mode = 'create' }) => {
    const { currDog, token } = useAuth();
    const { serviceTypes, categories, fetchAndSetLocalCurrDogRecords, fetchCurrDogRecords,  } = useRecords();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(serviceData ? serviceData.image_path : '');
    const [selectedCategory, setSelectedCategory] = useState(serviceData?.category_id || '');
    const [filteredServiceTypes, setFilteredServiceTypes] = useState([]);
    const [isEditMode, setIsEditMode] = useState(mode === 'edit');

    useEffect(() => {
        if (isEditMode && serviceData?.image_path) {
            setImageUrl(serviceData.image_path);
        } else {
            setImageUrl('');
        }
    }, [serviceData, isEditMode]);

    useEffect(() => {
        if (serviceData?.category_id) {
            setSelectedCategory(serviceData.category_id);
        }

        if (selectedCategory) {
            const filtered = serviceTypes.filter(st => st.category_id === selectedCategory);
            setFilteredServiceTypes(filtered);
        } else {
            setFilteredServiceTypes([]); 
        }
    }, [selectedCategory, serviceTypes, serviceData]);

    useEffect(() => {
        setIsEditMode(mode === 'edit');
    }, [mode]);

    const handleChangeCategory = (e) => {
        setSelectedCategory(parseInt(e.target.value, 10));
    };

    // Validation schema
    const validationSchema = Yup.object().shape({
        service_date: Yup.string().required('Service Date is required'),
        service_type_id: Yup.string(),
        category_id: Yup.string(),
        fee: Yup.number(),
        follow_up_date: Yup.string(),
    });

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
        if (image) {
            const storageRef = ref(storage, `service_images/${Date.now()}_${image.name}`);
            const snapshot = await uploadBytes(storageRef, image);
            return await getDownloadURL(snapshot.ref); // Return the uploaded image's URL
        }

        // Check if serviceData exists before trying to access image_path
        return serviceData?.image_path || ''; // If no new image is selected, use the existing one or empty string
    };

    const formatDate = (date) => {
        if (!date) return '';
        return dayjs(date).format('YYYY-MM-DD'); 
    };

    const formatUpdatedDate = (date) => {
        if (!date) return '';
        return dayjs(date).format('YYYY-MM-DD');  // Ensure the format is YYYY-MM-DD
    };

    // Handle form submission
    const handleSave = async (values, { setSubmitting }) => {
        console.log('values:', values);
        console.log('serviceData:', serviceData);
        setSubmitting(true);
        try {
            const imgUrl = await handleImageUpload();
            const updatedData = {
                ...values, image_path: imgUrl || serviceData?.image_path || '', profile_id: currDog.id, service_date: formatUpdatedDate(values.service_date), follow_up_date: formatUpdatedDate(values.follow_up_date),
};

            if (isEditMode) {
                // Editing an existing service
                console.log('updated data:', updatedData);
                console.log('serviceData:', serviceData);
                const response = await axios.put(`${backEndUrl}/medical_record/profile/${currDog.id}/records/${serviceData.id}`, updatedData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Edit record backend response:', response.data);
            } else {
                // Adding a new service
                console.log('added data:', updatedData);
                const response = await axios.post(`${backEndUrl}/medical_record/profile/${currDog.id}`, updatedData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Add service backend response:', response);
            }

            // Fetch and update local records
            await fetchAndSetLocalCurrDogRecords(currDog);
            onClose();
        } catch (error) {
            console.error('Error saving new record:', error);
        } finally {
            setSubmitting(false);
        }
    };
    

    return (
        <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className={`custom-drawer ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                    {isEditMode ? `Update ${currDog?.name || 'Dog'}'s Record` : `Add ${currDog?.name || 'Dog'}'s Record`}
                </Typography>

                <Formik
                    initialValues={{
                        service_date: serviceData?.service_date ? formatDate(serviceData.service_date) : '',  
                        service_type_id: serviceData?.service_type_id || '',
                        category_id: serviceData?.category_id || '',
                        fee: serviceData?.fee || '',
                        follow_up_date: serviceData?.follow_up_date ? formatDate(serviceData.follow_up_date) : '',
                        image_path: serviceData?.image_path || ''
                    }}
                    validationSchema={validationSchema}
                    enableReinitialize={true}  // Ensure reinitialization on serviceData change
                    onSubmit={handleSave}
                >
                    {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                        <Form>
                            {/* Service Date Field */}
                            <div className="form-field">
                                <label>Service Date</label>
                                <Field
                                    name="service_date"
                                    type="date"
                                    className={`form-input-1 ${touched.service_date && errors.service_date ? 'error' : ''}`}
                                />
                                {touched.service_date && errors.service_date && <div className="error-message">{errors.service_date}</div>}
                            </div>

                            {/* Category Field */}
                            <div className="form-field">
                                <label>Category</label>
                                <Field
                                    as="select"
                                    name="category_id"
                                    className={`form-input-1 ${touched.category_id && errors.category_id ? 'error' : ''}`}
                                    onChange={(e) => {
                                        setFieldValue('category_id', e.target.value);  // Set category_id in Formik
                                        handleChangeCategory(e);  
                                    }}
                                    value={values.category_id}  
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </Field>
                                {touched.category_id && errors.category_id && <div className="error-message">{errors.category_id}</div>}
                            </div>

                            {/* Service Type Field */}
                            <div className="form-field">
                                <label>Service Type</label>
                                <Field
                                    as="select"
                                    name="service_type_id"
                                    className={`form-input-1 ${touched.service_type_id && errors.service_type_id ? 'error' : ''}`}
                                    value={values.service_type_id}  // Ensure value is set correctly
                                >
                                    <option value="">Select Service Type</option>
                                    {filteredServiceTypes.map((serviceType) => (
                                        <option key={serviceType.id} value={serviceType.id}>
                                            {serviceType.name}
                                        </option>
                                    ))}
                                </Field>
                                {touched.service_type_id && errors.service_type_id && <div className="error-message">{errors.service_type_id}</div>}
                            </div>

                            {/* Fee and Follow-Up Date Fields */}
                            <div className="fee-followup-wrapper">
                                <div className="form-field">
                                    <label>Follow-Up Date</label>
                                    <Field
                                        name="follow_up_date"
                                        type="date"
                                        className={`form-input-2 ${touched.follow_up_date && errors.follow_up_date ? 'error' : ''}`}
                                    />
                                    {touched.follow_up_date && errors.follow_up_date && <div className="error-message">{errors.follow_up_date}</div>}
                                </div>

                                <div className="form-field">
                                    <label>Fee</label>
                                    <Field
                                        name="fee"
                                        type="number"
                                        className={`form-input-2 ${touched.fee && errors.fee ? 'error' : ''}`}
                                    />
                                    {touched.fee && errors.fee && <div className="error-message">{errors.fee}</div>}
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="form-field upload-receipt">
                                <label>Upload Receipt</label>
                                <div className="file-upload">
                                    <input
                                        accept="image/*"
                                        id="service-image-upload"
                                        type="file"
                                        onChange={handleImageChange} />
                                    {imageUrl ? <img src={imageUrl} alt="Preview" width="100" /> : serviceData?.image_path ? <img src={serviceData.image_path} alt="Preview" width="100" /> : null}
                                </div>
                            </div>

                            {/* Save/Cancel Buttons */}
                            <div className="form-buttons">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    className="save-btn"
                                >
                                    {isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...') : isEditMode ? 'Update Service' : 'Add Service'}
                                </Button>
                                <Button variant="outlined" onClick={onClose} disabled={isSubmitting} className="cancel-btn">
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ServiceDrawer;