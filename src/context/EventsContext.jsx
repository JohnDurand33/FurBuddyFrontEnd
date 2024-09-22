import { createContext, useContext, useEffect, useState } from 'react';
import { createEvent, deleteEvent, fetchEvents, updateEvent } from '../utils/api/eventApis';
import { useAuth } from './AuthContext';

// Create the RecordsContext
const EventsContext = createContext();

export const useEvents = () => useContext(EventsContext);

export const EventsProvider = ({ children }) => {
    const [currEvents, setCurrEvents] = useState([]);
    const [currEvent, setCurrEvent] = useState({});
    const [selectedEvent, setSelectedEvent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { authed, token } = useAuth();

    const setLocalCurrEvent = (event) => {
        localStorage.setItem('currEvent', JSON.stringify(event));
        setCurrEvent(event);
    };

    const setLocalCurrEvents = (events) => {
        localStorage.setItem('currEvents', JSON.stringify(events));
        setCurrEvents(events);
    };

    const setLocalSelectedEvent = (event) => {
        localStorage.setItem('selectedEvent', JSON.stringify(event));
        setSelectedEvent(event);
    };


    // Fetch events from the API
    const fetchEventsFromAPI = async (view = 'month', date = new Date()) => {
        setLoading(true);
        const formattedDate = date.toISOString().split('T')[0];  // Format date as 'YYYY-MM-DD'

        // Build the request parameters based on the view type
        let params = { start_date: formattedDate };

        // Only add `year` and `month` when view is `month`
        if (view === 'month') {
            params.year = date.getFullYear();
            params.month = date.getMonth() + 1; // Remember, months are 0-indexed, so add 1
        }

        console.log(`Sending request to fetch events with view: ${view}, params:`, params);

        try {
            const response = await fetchEvents(view, params); // Use the correct parameters
            console.log('Events response:', response);

            // Set the first event as the current event if events exist
            if (response.length > 0) {
                setLocalCurrEvent(response[0]);
            }
        } catch (err) {
            setError('Error fetching events');
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    // Create a new event
    const createNewEvent = async (eventData) => {
        try {
            const response = await createEvent(eventData);
            setLocalCurrEvents([...currEvents, response.event]);
            setLocalCurrEvent(response.event);
        } catch (err) {
            console.error('Error creating event:', err);
        }
    };

    // Update an existing event
    const updateExistingEvent = async (eventId, eventData) => {
        try {
            const response = await updateEvent(eventId, eventData);
            const updatedEvents = currEvents.map((event) =>
                event.id === eventId ? response.event : event
            );
            setLocalCurrEvents(updatedEvents);
            setLocalCurrEvent(response.event);
        } catch (err) {
            console.error('Error updating event:', err);
        }
    };

    // Delete an event
    const deleteExistingEvent = async (eventId) => {
        try {
            await deleteEvent(eventId);
            const updatedEvents = currEvents.filter((event) => event.id !== eventId);
            setLocalCurrEvents(updatedEvents);
        } catch (err) {
            console.error('Error deleting event:', err);
        }
    };



    useEffect(() => {
        if (authed && token) {
            fetchEventsFromAPI();
        }
    }, [authed, token]);

    return(
        <EventsContext.Provider
            value={{
                currEvents,
                currEvent,
                selectedEvent,
                setLocalSelectedEvent,
                setLocalCurrEvent,
                setLocalCurrEvents,
                fetchEventsFromAPI,
                createNewEvent,
                updateExistingEvent,
                deleteExistingEvent,
                loading,
                error,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
};