import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../drawerStyles.css'; // Custom styles

const AddServiceDrawer = ({ isOpen, onClose, serviceData = null, isEditMode = false }) => {
    const { currDog, token } = useAuth();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(serviceData ? serviceData.image_path : '');

    // Validation schema
    const validationSchema = Yup.object().shape({
        serviceDate: Yup.string().required('Service Date is required'),
        serviceType: Yup.string().required('Type of Service is required'),
        category: Yup.string().required('Category is required'),
        fee: Yup.number().required('Fee is required'),
        followUpDate: Yup.string(),
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
        if (!image) return serviceData?.image_path || ''; // If no new image is selected, use existing image (for edit mode)
        const storageRef = ref(storage, `service_images/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        return await getDownloadURL(snapshot.ref);
    };

    // Handle form submission
    const handleSave = async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
            const imgUrl = await handleImageUpload();
            const updatedData = { ...values, image_path: imgUrl };

            if (isEditMode && serviceData) {
                // Editing an existing service
                await axios.put(`/api/services/${serviceData.id}`, updatedData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // Adding a new service
                await axios.post(`/api/services`, { ...updatedData, dogId: currDog.id }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            onClose();
        } catch (error) {
            console.error('Error saving service:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={() => onClose()}>
            <div className={`custom-drawer ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <Typography variant="h5" sx={{ mb: 2, textAlign:'center' }}>
                    {isEditMode ? 'Edit Record' : 'Add Record'}
                </Typography>

                <Formik
                    initialValues={{
                        serviceDate: serviceData?.serviceDate || '',
                        serviceType: serviceData?.serviceType || '',
                        category: serviceData?.category || '',
                        fee: serviceData?.fee || '',
                        followUpDate: serviceData?.followUpDate || '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                >
                    {({ values, errors, touched, isSubmitting }) => (
                        <Form>
                            {/* Service Date Field */}
                            <div className="form-field">
                                <label>Service Date</label>
                                <Field
                                    name="serviceDate"
                                    type="date"
                                    className={`form-input ${touched.serviceDate && errors.serviceDate ? 'error' : ''}`}
                                />
                                {touched.serviceDate && errors.serviceDate && <div className="error-message">{errors.serviceDate}</div>}
                            </div>

                            {/* Type of Service Field */}
                            <div className="form-field">
                                <label>Type of Services</label>
                                <Field
                                    name="serviceType"
                                    type="text"
                                    className={`form-input ${touched.serviceType && errors.serviceType ? 'error' : ''}`}
                                />
                                {touched.serviceType && errors.serviceType && <div className="error-message">{errors.serviceType}</div>}
                            </div>

                            {/* Category Field */}
                            <div className="form-field">
                                <label>Category</label>
                                <Field
                                    name="category"
                                    type="text"
                                    className={`form-input ${touched.category && errors.category ? 'error' : ''}`}
                                />
                                {touched.category && errors.category && <div className="error-message">{errors.category}</div>}
                            </div>

                            {/* Fee Field */}
                            <div className="form-field">
                                <label>Fee</label>
                                <Field
                                    name="fee"
                                    type="number"
                                    className={`form-input ${touched.fee && errors.fee ? 'error' : ''}`}
                                />
                                {touched.fee && errors.fee && <div className="error-message">{errors.fee}</div>}
                            </div>

                            {/* Follow-Up Date Field */}
                            <div className="form-field">
                                <label>Follow-Up Date</label>
                                <Field
                                    name="followUpDate"
                                    type="date"
                                    className={`form-input ${touched.followUpDate && errors.followUpDate ? 'error' : ''}`}
                                />
                                {touched.followUpDate && errors.followUpDate && <div className="error-message">{errors.followUpDate}</div>}
                            </div>

                            {/* Image Upload */}
                            <div className="form-field upload-receipt">
                                <label>Upload Receipt</label>
                                <div className="file-upload">
                                    <input
                                        accept="image/*"
                                        id="service-image-upload"
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>

                            {/* Save/Cancel Buttons positioned at the bottom */}
                            <div className="form-buttons">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    className="save-btn"
                                >
                                    {isSubmitting ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save' : 'Add Service')}
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

export default AddServiceDrawer;