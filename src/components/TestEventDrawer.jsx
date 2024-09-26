import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventsContext';
import { api } from '../utils/eventApi';

const EventDrawer = ({ isOpen, onClose, selectedEvent }) => {
    const { createNewEvent, fetchEventById, updateExistingEvent } = useEvents(); // Import necessary functions
    const [formData, setFormData] = useState({
        name: '',
        street: '',
        zip_code: '',
        state: '',
        start_time: '',
        end_time: '',
        notes: '',
        color_id: '', // Use a dropdown or color picker for this
    });
    const [eventId, setEventId] = useState(null); // For fetch-by-id logic

    // Populate form data if editing an existing event
    useEffect(() => {
        if (selectedEvent) {
            setFormData({
                name: selectedEvent.name || '',
                street: selectedEvent.street || '',
                zip_code: selectedEvent.zip_code || '',
                state: selectedEvent.state || '',
                start_time: selectedEvent.start_time || '',
                end_time: selectedEvent.end_time || '',
                notes: selectedEvent.notes || '',
                color_id: selectedEvent.color_id || '',
            });
            setEventId(selectedEvent.id); // Set the event ID for updating
        } else {
            resetForm(); // Reset form if creating a new event
        }
    }, [selectedEvent]);

    // Reset form data
    const resetForm = () => {
        setFormData({
            name: '',
            street: '',
            zip_code: '',
            state: '',
            start_time: '',
            end_time: '',
            notes: '',
            color_id: '',
        });
        setEventId(null);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission (create or update event)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (eventId) {
            updateExistingEvent(eventId, formData); // Update existing event
        } else {
            createNewEvent(formData); // Create a new event
        }
        onClose(); // Close the drawer after submission
    };

    return (
        <div className={`drawer ${isOpen ? 'open' : ''}`}>
            <h3>{eventId ? 'Edit Event' : 'Create Event'}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Event Name"
                    required
                />
                <input
                    type="datetime-local"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    placeholder="Start Time"
                    required
                />
                <input
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    placeholder="End Time"
                    required
                />
                <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Street"
                />
                <input
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                />
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                />
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Notes"
                />
                <select
                    name="color_id"
                    value={formData.color_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Color</option>
                    <option value="1">Red</option>
                    <option value="2">Green</option>
                    <option value="3">Blue</option>
                    <option value="4">Yellow</option>
                    <option value="5">Pink</option>
                </select>

                <button type="submit">
                    {eventId ? 'Update Event' : 'Create Event'}
                </button>
            </form>
        </div>
    );
};

export default EventDrawer;