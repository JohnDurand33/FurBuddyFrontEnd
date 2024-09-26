import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react'; // Iconify for the close icon
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext'; // Import the Events context
import '../EventDrawer.css';

const colorOptions = [
    { id: 1, color: '#F7CA57' },
    { id: 2, color: '#F44336' },
    { id: 3, color: '#4CAF50' },
    { id: 4, color: '#03A9F4' },
    { id: 5, color: '#9C27B0' },
];

const EventDrawer = ({ onClose, isOpen }) => {
    const { createNewEvent, updateExistingEvent, selectedEvent, updateFlag, fetchEventsFromAPI, colorOptions } = useEvents();
    const [errorMessages, setErrorMessages] = useState('');

    const { token } = useAuth(); // We don't need all of `AuthContext`, just the token here
    
    // Validation Schema using Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Event Name is required'),
        date: Yup.string().required('Date is required'),  // Required for combining date and time
        start_time: Yup.string().required('Start time is required'),
        end_time: Yup.string().required('End time is required'),
        zip_code: Yup.string(),
        state: Yup.string(),
        notes: Yup.string(),
        color_id: Yup.number().required('Please select a color'),
    });
    

    // Helper to combine date and time and get them from stamp
    const combineDateAndTime = (date, time) => {
        return `${date}T${time}:00`;
    };
    const getDateFromDateTime = (dateTime) => dateTime ? new Date(dateTime).toISOString().split('T')[0] : '';
    const getTimeFromDateTime = (dateTime) => dateTime ? new Date(dateTime).toISOString().split('T')[1].slice(0, 5) : '';
    
    // Function to handle saving the event (either create or update)
    const handleSaveEvent = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setErrorMessages('');
        console.log('Formik values:', values);

        try {
            const formattedStartTime = combineDateAndTime(values.date, values.start_time);
            const formattedEndTime = combineDateAndTime(values.date, values.end_time);

            const { date, notification, share_with_friends, ...eventData } = values;

            if (updateFlag && selectedEvent) {
                // Update existing event
                const updatedData = {
                    ...eventData, 
                    start_time: formattedStartTime,
                    end_time: formattedEndTime,
                };
                console.log('Updating- updatedData',updatedData)
                await updateExistingEvent(selectedEvent.id, updatedData);
            } else {
                // Create new event
                const newEventData = {
                    ...eventData,
                    start_time: formattedStartTime,
                    end_time: formattedEndTime,
                };
                console.log('Creating- newEventData',newEventData)
                await createNewEvent(newEventData);
            }

            // Close the drawer and reset the form after successful save
            resetForm();  // Reset form values
            onClose();  // Close the drawer
            fetchEventsFromAPI();  // Refresh events list
        } catch (error) {
            console.error('Error saving event:', error);
            setErrorMessages('Error saving event. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Prevent click inside the drawer from closing it
    const handleDrawerClick = (e) => {
        e.stopPropagation();  // Prevents the event from bubbling up to the overlay
    };

    return (
        // isOpen && (
        <div className={`event-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className={`event-custom-drawer ${isOpen ? 'open' : ''}`} onClick={handleDrawerClick}>
                <div className="event-drawer-header">
                    {console.log('isOpen',isOpen)}
                    <h3>{updateFlag ? 'Edit Event' : 'Create Event'}</h3>
                    <Icon icon="mdi:close" className="event-close-icon" onClick={onClose} />
                </div>

                {/* Formik Form */}
                <Formik
                    initialValues={{
                        name: selectedEvent?.name || '',
                        date: getDateFromDateTime(selectedEvent?.start_time) || '',
                        start_time: getTimeFromDateTime(selectedEvent?.start_time) || '',
                        end_time: getTimeFromDateTime(selectedEvent?.end_time) || '',
                        street: selectedEvent?.street || '',
                        zip_code: selectedEvent?.zip_code || '',
                        state: selectedEvent?.state || '',
                        color_id: selectedEvent?.color_id || '',
                        notes: selectedEvent?.notes || '',
                    }}
                    validationSchema={validationSchema}
                    enableReinitialize={true} // Allow reinitializing the form when eventData changes
                    onSubmit={handleSaveEvent}
                >
                    {({ values, isSubmitting, setFieldValue }) => (
                        <Form className="event-form">
                            {/* Event Name */}
                            <div className="event-form-field">
                                <label htmlFor="name" className="event-form-label">Event Name</label>
                                <Field id="name" name="name" type="text" className="event-form-input" />
                                <ErrorMessage name="name" component="div" className="event-error-message" />
                            </div>

                            {/* Date and Time - Single Row */}
                            <div className="event-form-field date-time-row">
                                <div className="event-date-time">
                                    <label htmlFor="date" className="event-form-label">Date</label>
                                    <Field id="date" name="date" type="date" className="event-form-input" />
                                </div>
                                <div className="event-time">
                                    <label htmlFor="start_time" className="event-form-label">Time</label>
                                    <Field name="start_time" type="time" className="event-form-input" />
                                </div>
                                <div className="event-time">
                                    <label htmlFor="end_time" className="event-form-label">To</label>
                                    <Field name="end_time" type="time" className="event-form-input" />
                                </div>
                            </div>

                            {/* Zip Code and State */}
                            <div className="event-form-field">
                                <div className="event-form-row">
                                    <div className="event-form-field half-width-event">
                                        <label htmlFor="zip_code" className="event-form-label">Zip Code</label>
                                        <Field id="zip_code" name="zip_code" type="text" className="event-form-input" />
                                        <ErrorMessage name="zip_code" component="div" className="event-error-message" />
                                    </div>
                                    <div className="event-form-field half-width-event">
                                        <label htmlFor="state" className="event-form-label">State</label>
                                        <Field id="state" name="state" type="text" className="event-form-input" />
                                        <ErrorMessage name="state" component="div" className="event-error-message" />
                                    </div>
                                </div>
                            </div>

                            {/* Color Picker */}
                            <div className="event-form-field">
                                <label className="event-form-label">Select Event Color</label>
                                <div className="event-color-picker">
                                    {colorOptions.map((colorOption) => (
                                        <div
                                            key={colorOption.id}
                                            className={`event-color-circle ${values.color_id === colorOption.id ? 'event-selected' : ''}`}
                                            style={{ backgroundColor: colorOption.color }}
                                            onClick={() => setFieldValue('color_id', colorOption.id)}  // Update color_id on click
                                        />
                                    ))}
                                </div>
                                <ErrorMessage name="color_id" component="div" className="event-error-message" />
                            </div>

                            {/* Toggles */}
                            <div className="event-toggle-section">
                                <label className="event-form-label">Turn On Notification</label>
                                <label className="toggle-switch">
                                    <Field type="checkbox" name="notification" />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="event-toggle-section">
                                <label className="event-form-label">Share with friends</label>
                                <label className="toggle-switch">
                                    <Field type="checkbox" name="share_with_friends" />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            {/* Address Field */}
                            <div className="event-form-field">
                                <label htmlFor="street" className="event-form-label">Street Address</label>
                                <Field name="street" type="text" className="event-form-input" />
                                <ErrorMessage name="street" component="div" className="event-error-message" />
                            </div>

                            {/* Notes Field - Expand Rows */}
                            <div className="event-form-field">
                                <label htmlFor="notes" className="event-form-label">Add Notes</label>
                                <Field as="textarea" name="notes" className="event-form-input" style={{ height: '150px' }} />
                                <ErrorMessage name="notes" component="div" className="event-error-message" />
                            </div>

                            {/* Action Buttons */}
                            <div className="event-drawer-buttons">
                                <button type="button" className="event-cancel-btn" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="event-save-btn" disabled={isSubmitting}>
                                    Save
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
        )
    // );
};

export default EventDrawer;