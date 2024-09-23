import { createContext, useContext, useEffect, useState } from 'react';
import { createEvent, deleteEvent, fetchEvents, updateEvent, fetchEventById, fetchEventsFromAPI } from '../utils/eventApi';
import { useAuth } from './AuthContext';

// Create the RecordsContext
const EventsContext = createContext();

export const useEvents = () => useContext(EventsContext);

export const EventsProvider = ({ children }) => {
    const colorOptions = [
        { id: 1, backgroundColor: '#F7CA57', textColor: '#000000' },
        { id: 2, backgroundColor: '#F44336', textColor: '#000000' },
        { id: 3, backgroundColor: '#4CAF50', textColor: '#000000' },
        { id: 4, backgroundColor: '#03A9F4', textColor: '#000000' },
        { id: 5, backgroundColor: '#9C27B0', textColor: '#000000' },
    ];

    const [currEvents, setCurrEvents] = useState([]);
    const [currEvent, setCurrEvent] = useState({});
    const [selectedEvent, setSelectedEvent] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updateFlag, setUpdateFlag] = useState(false);
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

    const fetchEventsFromAPI = async (view = 'month', date = new Date()) => {
        setLoading(true);
        let params = {};
        const formattedDate = date.toISOString().split('T')[0];

        if (view === 'day') {
            params = { start_date: formattedDate };
        } else if (view === 'week') {
            const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
            const formattedStartOfWeek = startOfWeek.toISOString().split('T')[0];
            params = { start_date: formattedStartOfWeek };
        } else if (view === 'month') {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            params = { start_date: formattedDate, year, month };
        }

        try {
            const response = await fetchEvents(view, params);
            setLocalCurrEvents(response);
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

    // Automatically fetch events when the component mounts, based on user authentication
    useEffect(() => {
        if (authed && token) {
            fetchEventsFromAPI(); // Fetch events when the user is authenticated
        }
    }, [authed, token]);

    return (
        <EventsContext.Provider
            value={{
                currEvents,
                currEvent,
                selectedEvent,
                setLocalSelectedEvent,
                setLocalCurrEvent,
                setLocalCurrEvents,
                createNewEvent,
                updateExistingEvent,
                deleteExistingEvent,
                fetchEventById,
                loading,
                error,
                colorOptions,
                updateFlag,
                setUpdateFlag,
                fetchEventsFromAPI,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
};
