import React, { useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react'; // Iconify for the close icon
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext'; // Import the Events context
import '../EventDrawer.css';
import { Switch, FormControlLabel, Box } from '@mui/material';

// Helper to extract local date from ISO 8601
const extractDateFromISO = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format for the input field
};

// Helper to extract local time from ISO 8601 (HH:mm format)
const extractTimeFromISO = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false }); // Local time as HH:mm
};

// Helper to combine date and time into an ISO 8601 UTC string (YYYY-MM-DDTHH:mm:ssZ)
const combineDateAndTimeToISO = (date, time) => {
    console.log('date', date);  // For debugging
    console.log('time', time);  // For debugging

    // Create a local date-time string, assuming the time is in local time zone
    const localDateTimeString = `${date}T${time}:00`;

    // Create a Date object
    const combinedDate = new Date(localDateTimeString);

    // Format the output to match '%Y-%m-%dT%H:%M:%S' (remove milliseconds and the 'Z')
    const isoString = combinedDate.toISOString().split('.')[0];  // Remove milliseconds
    const formattedString = isoString.replace('Z', '');  // Remove the 'Z' from the string

    console.log('Formatted ISO string:', formattedString);  // For debugging

    return formattedString;  // Return the formatted ISO string
};

const EventDrawer = ({ onClose, isOpen }) => {
    const { createNewEvent, updateExistingEvent, selectedEvent, updateFlag, fetchEventsFromAPI, colorOptions } = useEvents();
    const [errorMessages, setErrorMessages] = useState('');
    const [notificationEnabled, setNotificationEnabled] = useState(false); // Initialize with a default false
    const [shareWithFriendsEnabled, setShareWithFriendsEnabled] = useState(false); // Initialize with default false
    
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
    
    // Function to handle saving the event (either create or update)
    const handleSaveEvent = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setErrorMessages('');
        console.log('Formik values:', values);
        try {
            const startTimeISO = combineDateAndTimeToISO(values.date, values.start_time);
            const endTimeISO = combineDateAndTimeToISO(values.date, values.end_time);

            const { date, notification, share_with_friends, ...eventData } = values;

            if (updateFlag && selectedEvent) {
                // Update existing event
                const updatedData = {
                    ...eventData, 
                    start_time: startTimeISO,
                    end_time: endTimeISO,
                };
                console.log('Updating- updatedData',updatedData)
                const response = await updateExistingEvent(selectedEvent.id, updatedData);
                console.log('Update response',response)
            } else {
                // Create new event
                const newEventData = {
                    ...eventData,
                    start_time: startTimeISO,
                    end_time: endTimeISO,
                };
                console.log('Creating- newEventData',newEventData)
                const res = await createNewEvent(newEventData);
                console.log('Create response',res)
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
                        date: extractDateFromISO(selectedEvent?.start_time) || '',
                        start_time: extractTimeFromISO(selectedEvent?.start_time) || '',
                        end_time: extractTimeFromISO(selectedEvent?.end_time) || '',
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
                                <div className="event-drawer-header">
                                    <div className="half-width-event">
                                        <label htmlFor="zip_code" className="event-form-label">Zip Code</label>
                                        <Field id="zip_code" name="zip_code" type="text" className="event-form-input" />
                                        <ErrorMessage name="zip_code" component="div" className="event-error-message" />
                                    </div>
                                    <div className="half-width-event">
                                        <label htmlFor="state" className="event-form-label">State</label>
                                        <Field id="state" name="state" type="text" className="event-form-input" />
                                        <ErrorMessage name="state" component="div" className="event-error-message" />
                                    </div>
                                </div>
                            </div>

                            {/* Color Picker */}
                            <div className="event-form-field">
                                <label className="color-label">Select Event Color</label>
                                <div className="event-color-picker">
                                    {colorOptions.map((colorOption) => (
                                        <div
                                            key={colorOption.id}
                                            className={`event-color-circle ${values.color_id === colorOption.id ? 'event-color-selected' : ''}`}
                                            style={{ backgroundColor: colorOption.backgroundColor }}
                                            onClick={() => setFieldValue('color_id', colorOption.id)}  // Update color_id on click
                                        />
                                    ))}
                                </div>
                                <ErrorMessage name="color_id" component="div" className="event-error-message" />
                            </div>

                            {/* MUI Toggle Switches */}
                            <div className="event-form-field">
                            <div className="event-form-field">
                                        <Switch
                                            checked={notificationEnabled}
                                            onChange={() => setNotificationEnabled(!notificationEnabled)}
                                    sx={{ color: 'green',  aspectRatio: 1 }}
                                            border='1px solid black'
                                            width='auto'
                                        />
                                <label style={{}}>Enable Notifications</label>
                            </div>

                            <div className="event-form-field">
                                        <Switch
                                            checked={shareWithFriendsEnabled}
                                            onChange={() => setShareWithFriendsEnabled(!shareWithFriendsEnabled)}
                                            color="yellow"
                                            border='1px solid black'
                                        />
                                <label style={{}}>Share with Friends</label>
                                
                                </div>
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
                                <Field as="textarea" name="notes" className="input-notes" style={{ height: '150px' }} />
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