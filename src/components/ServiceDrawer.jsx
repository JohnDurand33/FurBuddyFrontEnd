import { Button, Typography } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Field, Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { storage } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useRecords } from '../context/RecordsContext';
import '../styles/ServiceDrawer.css';  // Note change to specific CSS file
import { backEndUrl } from '../utils/config';


const ServiceDrawer = ({ isOpen, setShowDrawer, serviceData = null, mode = 'create' }) => {
    const formikRef = useRef(null);
    const [formResetFunction, setformResetFunction] = useState(null);
    const { currDog, token } = useAuth();
    const { serviceTypes, categories, refetchCurrDogRecords } = useRecords();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(serviceData ? serviceData.image_path : '');
    const [selectedCategory, setSelectedCategory] = useState(serviceData?.category_id || '');
    const [filteredServiceTypes, setFilteredServiceTypes] = useState([]);
    const [isEditMode, setIsEditMode] = useState(mode === 'edit');
    const [errorMessage, setErrorMessage] = useState(null);

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

    const handleCloseDrawer = () => {
        if (formikRef.current) {
            formikRef.current.resetForm(); // Access resetForm through the ref
        }
        setShowDrawer(false);
    };

    const formatDateToUTC = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return format(new Date(date.getTime() + date.getTimezoneOffset() * 60000), 'yyyy-MM-dd');
    };

    const validationSchema = Yup.object().shape({
        service_date: Yup.date().required('Service Date is required'),
        service_type_id: Yup.string(),
        category_id: Yup.string(),
        fee: Yup.number(),
        follow_up_date: Yup.date(),
    });

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setImage(file);
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (image) {
            const storageRef = ref(storage, `service_images/${Date.now()}_${image.name}`);
            const snapshot = await uploadBytes(storageRef, image);
            return await getDownloadURL(snapshot.ref);
        }
        return serviceData?.image_path || '';
    };

    const handleSave = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setErrorMessage('');
        try {
            const imgUrl = await handleImageUpload();

            const updatedData = {
                ...values,
                image_path: imgUrl || serviceData?.image_path || '',
                profile_id: currDog.id,
                service_date: values.service_date,
                follow_up_date: values.follow_up_date || null,
            };

            if (isEditMode) {
                await axios.put(`${backEndUrl}/medical_record/profile/${currDog.id}/records/${serviceData.id}`, updatedData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                await axios.post(`${backEndUrl}/medical_record/profile/${currDog.id}`, updatedData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }

            await refetchCurrDogRecords();
            setShowDrawer(false);
            resetForm();
        } catch (error) {
            console.error('Error saving new record:', error);
            setErrorMessage('An error occurred while saving the record. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={handleCloseDrawer}>
                <div className={`custom-service-drawer ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                        {isEditMode ? `Update ${currDog?.name || 'Dog'}'s Record` : `Add ${currDog?.name || 'Dog'}'s Record`}
                    </Typography>

                    <Formik
                        innerRef={formikRef}
                        initialValues={{
                            service_date: serviceData?.service_date ? formatDateToUTC(serviceData.service_date) : '',
                            service_type_id: serviceData?.service_type_id || '',
                            category_id: serviceData?.category_id || '',
                            fee: serviceData?.fee || '',
                            follow_up_date: serviceData?.follow_up_date ? formatDateToUTC(serviceData.follow_up_date) : '',
                            image_path: serviceData?.image_path || '',
                        }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={handleSave}
                    >
                        {({ values, errors, touched, isSubmitting, setFieldValue, resetForm }) => (
                            <Form>
                                <div className="form-field-service">
                                    <label>Service Date</label>
                                    <Field
                                        name="service_date"
                                        type="date"
                                        className={`form-input-service-1 ${touched.service_date && errors.service_date ? 'error' : ''}`}
                                    />
                                    {touched.service_date && errors.service_date && <div className="error-message">{errors.service_date}</div>}
                                </div>

                                <div className="form-field-service">
                                    <label>Category</label>
                                    <Field
                                        as="select"
                                        name="category_id"
                                        className={`form-input-service-1 ${touched.category_id && errors.category_id ? 'error' : ''}`}
                                        onChange={(e) => {
                                            setFieldValue('category_id', e.target.value);
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

                                <div className="form-field-service">
                                    <label>Service Type</label>
                                    <Field
                                        as="select"
                                        name="service_type_id"
                                        className={`form-input-service-1 ${touched.service_type_id && errors.service_type_id ? 'error' : ''}`}
                                        value={values.service_type_id}
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

                                <div className="fee-followup-wrapper-service">
                                    <div className="form-field-service">
                                        <label>Follow-Up Date</label>
                                        <Field
                                            name="follow_up_date"
                                            type="date"
                                            className={`form-input-service-2 ${touched.follow_up_date && errors.follow_up_date ? 'error' : ''}`}
                                        />
                                        {touched.follow_up_date && errors.follow_up_date && <div className="error-message">{errors.follow_up_date}</div>}
                                    </div>

                                    <div className="form-field-service">
                                        <label>Fee</label>
                                        <Field
                                            name="fee"
                                            type="number"
                                            className={`form-input-service-2 ${touched.fee && errors.fee ? 'error' : ''}`}
                                        />
                                        {touched.fee && errors.fee && <div className="error-message">{errors.fee}</div>}
                                    </div>
                                </div>

                                <div className="form-field-service upload-receipt-service">
                                    <label>Upload Receipt</label>
                                    <div className="file-upload-service">
                                        <input
                                            accept="image/*"
                                            id="service-image-upload"
                                            type="file"
                                            onChange={handleImageChange} />
                                        {imageUrl ? <img src={imageUrl} alt="Preview" width="100" /> : serviceData?.image_path ? <img src={serviceData.image_path} alt="Preview" width="100" /> : null}
                                    </div>
                                </div>

                                <div className="form-buttons-service">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                        className="save-btn-service"
                                    >
                                        {isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...') : isEditMode ? 'Update Service' : 'Add Service'}
                                    </Button>
                                    <Button variant="outlined" onClick={() => handleCloseDrawer()} className="cancel-btn-service">
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default ServiceDrawer;