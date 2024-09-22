import React, { useEffect, useState } from 'react';
import { fetchEventById } from '../api'; // Adjust the path to where your API calls are

const EventDetails = ({ eventId }) => {
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEventDetails = async () => {
            try {
                const event = await fetchEventById(eventId); // Fetch event by its ID
                setEventDetails(event);
            } catch (err) {
                setError('Error fetching event details');
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            loadEventDetails(); // Only call if eventId is valid
        }
    }, [eventId]);

    if (loading) return <p>Loading event details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Event Details</h1>
            {eventDetails ? (
                <div>
                    <p><strong>Name:</strong> {eventDetails.name}</p>
                    <p><strong>Start Time:</strong> {eventDetails.start_time}</p>
                    <p><strong>End Time:</strong> {eventDetails.end_time}</p>
                    <p><strong>Notes:</strong> {eventDetails.notes}</p>
                    {/* Render other event fields as needed */}
                </div>
            ) : (
                <p>No event found</p>
            )}
        </div>
    );
};

export default EventDetails;