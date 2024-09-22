import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react'; // Iconify for the close icon
import '../styles/EventDrawer.css';  // Updated to avoid conflict with ServiceDrawer
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext'; // Import the Events context

const colorOptions = [
    { id: 1, color: '#F7CA57' },
    { id: 2, color: '#F44336' },
    { id: 3, color: '#4CAF50' },
    { id: 4, color: '#03A9F4' },
    { id: 5, color: '#9C27B0' },
];

const EventDrawer = ({ isOpen, setIsDrawerOpen, selectedEvent=null }) => {
    const formikRef = useRef(null);
    const { token } = useAuth(); // We don't need all of `AuthContext`, just the token here
    const { createNewEvent, updateExistingEvent, fetchEventsFromAPI } = useEvents(); // Import event creation and update methods
    const [errorMessages, setErrorMessages] = useState('');

    // Validation Schema using Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Event Name is required'),
        start_time: Yup.string().required('Start time is required'),
        end_time: Yup.string().required('End time is required'),
        zip_code: Yup.number(),
        state: Yup.string(),
        notes: Yup.string(),
        color_id: Yup.number().required('Please select a color'),
    });

    // Function to format date and time into ISO 8601 format
    const formatDateTime = (date, time) => {
        return `${date}T${time}:00`; // Format to 'YYYY-MM-DDTHH:MM:SS'
    };

    const getDateFromDateTime = (dateTime) => {
        return dateTime ? dateTime.split('T')[0] : ''; // Extract 'YYYY-MM-DD' from 'YYYY-MM-DDTHH:MM:SS'
    };

    // Handle closing the drawer and resetting the form
    const handleCloseDrawer = () => {
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
        setIsDrawerOpen(false);
    };

    // Function to handle saving the event (either create or update)
    const handleSaveEvent = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setErrorMessages('');

        try {
            const startTime = formatDateTime(values.date, values.start_time);
            const endTime = formatDateTime(values.date, values.end_time);

            const updatedData = {
                name: values.name,
                street: values.street,
                zip_code: values.zip_code,
                state: values.state,
                start_time: startTime,
                end_time: endTime,
                notes: values.notes,
                color_id: values.color_id,
            };

            console.log('Updated event data:', updatedData);

            if (selectedEvent && selectedEvent.id) {
                // Update existing event
                await updateExistingEvent(selectedEvent.id, updatedData);
            } else {
                // Create new event
                const response = await createNewEvent(updatedData);
                console.log(response);
            }

            

            // After saving, close the drawer and refresh the events
            handleCloseDrawer();
            resetForm();
            fetchEventsFromAPI(); // Refetch events to reflect changes
        } catch (error) {
            console.error('Error saving event:', error);
            setErrorMessages('Error saving event. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={handleCloseDrawer}>
            <div className={`custom-event-drawer ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                {/* Drawer Header */}
                <div className="drawer-header-event">
                    <h3>{selectedEvent ? 'Edit Event' : 'Create Event / Activity'}</h3>
                    <Icon icon="mdi:close" className="close-icon-event" onClick={handleCloseDrawer} />
                </div>

                {/* Formik Form */}
                <Formik
                    
                    initialValues={{
                        name: selectedEvent?.name || '',
                        street: selectedEvent?.street || '',
                        zip_code: selectedEvent?.zip_code || '',
                        state: selectedEvent?.state || '',
                        start_time: selectedEvent?.start_time ? selectedEvent.start_time.split('T')[1] : '', 
                        end_time: selectedEvent?.end_time ? selectedEvent.end_time.split('T')[1] : '', 
                        notes: selectedEvent?.notes || '',
                        date: getDateFromDateTime(selectedEvent?.start_time), 
                        color_id: selectedEvent?.color_id || '',
                    }}
                    validationSchema={validationSchema}
                    enableReinitialize={true} // Allow reinitializing the form when eventData changes
                    onSubmit={handleSaveEvent}
                    innerRef={formikRef}
                >
                    {({ values, isSubmitting, setFieldValue }) => (
                        <Form className="event-form-event">
                            {/* Event Name Field */}
                            <div className="form-field-event">
                                <label htmlFor="name" className="form-label-event">Event Name</label>
                                <Field
                                    id="name"
                                    name="name"
                                    type="text"
                                    className={`form-input-event`}
                                />
                                <ErrorMessage name="name" component="div" className="error-message" />
                            </div>

                            {/* Date Picker */}
                            <div className="form-field-event">
                                <label htmlFor="date" className="form-label-event">Date</label>
                                <Field
                                    id="date"
                                    name="date"
                                    type="date"
                                    className={`form-input-event`}
                                />
                                <ErrorMessage name="date" component="div" className="error-message" />
                            </div>

                            {/* Time Fields */}
                            <div className="form-row-event">
                                <div className="form-field-event half-width-event">
                                    <label htmlFor="start_time" className="form-label-event">From</label>
                                    <Field
                                        name="start_time"
                                        type="time"
                                        className={`form-input-event`}
                                    />
                                    <ErrorMessage name="start_time" component="div" className="error-message" />
                                </div>
                                <div className="form-field-event half-width-event">
                                    <label htmlFor="end_time" className="form-label-event">To</label>
                                    <Field
                                        name="end_time"
                                        type="time"
                                        className={`form-input-event`}
                                    />
                                    <ErrorMessage name="end_time" component="div" className="error-message" />
                                </div>
                            </div>

                            {/* Color Picker */}
                            <div className="form-field-event">
                                <label className="form-label-event">Select Event Color</label>
                                <div className="color-picker-event">
                                    {colorOptions.map((colorOption) => (
                                        <div
                                            key={colorOption.id}
                                            className={`color-circle-event ${values.color_id === colorOption.id ? 'selected-event' : ''}`}
                                            style={{ backgroundColor: colorOption.color }}
                                            onClick={() => setFieldValue("color_id", colorOption.id)} // Set color_id when clicked
                                        ></div>
                                    ))}
                                </div>
                                <ErrorMessage name="color_id" component="div" className="error-message" />
                            </div>

                            {/* Address Field */}
                            <div className="form-field-event">
                                <label htmlFor="street" className="form-label-event">Street Address</label>
                                <Field
                                    name="street"
                                    type="text"
                                    className={`form-input-event`}
                                />
                                <ErrorMessage name="street" component="div" className="error-message" />
                            </div>

                            {/* Zip Code and State Fields */}
                            <div className="form-row-event">
                                <div className="form-field-event half-width-event">
                                    <label htmlFor="zip_code" className="form-label-event">Zip Code</label>
                                    <Field
                                        name="zip_code"
                                        type="text"
                                        className={`form-input-event`}
                                    />
                                    <ErrorMessage name="zip_code" component="div" className="error-message" />
                                </div>

                                <div className="form-field-event half-width-event">
                                    <label htmlFor="state" className="form-label-event">State</label>
                                    <Field
                                        name="state"
                                        type="text"
                                        className={`form-input-event`}
                                    />
                                    <ErrorMessage name="state" component="div" className="error-message" />
                                </div>
                            </div>

                            {/* Notes Field */}
                            <div className="form-field-event">
                                <label htmlFor="notes" className="form-label-event">Notes</label>
                                <Field
                                    as="textarea"
                                    name="notes"
                                    className={`form-input-event`}
                                />
                                <ErrorMessage name="notes" component="div" className="error-message" />
                            </div>

                            {/* Action Buttons */}
                            <div className="drawer-buttons-event">
                                <button type="button" className="cancel-btn-event" onClick={handleCloseDrawer}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn-event" disabled={isSubmitting}>
                                    Save
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EventDrawer;