import axios from "axios";
import { backEndUrl } from "../config";

const basePath = `${backEndUrl}/event/`; // Set '/event/' as the base path for the routes

// Create an Axios instance with the base URL
const api = axios.create({
    baseURL: basePath,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add an interceptor to dynamically set the Authorization header before each request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Fetch token before every request
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for handling errors globally
api.interceptors.response.use(
    (response) => {
        return response; // If response is successful, just return it
    },
    (error) => {
        // Handle the error globally here (e.g., log it, alert the user, etc.)
        console.error("API Error:", error.response || error.message);

        // Optionally, you can throw an error to be handled by the caller
        return Promise.reject(error);
    }
);

// Fetch all events with optional view filters (day/week/month)
export const fetchEvents = async (view = "month", params = {}) => {
    const response = await api.get("events", { params: { view, ...params } });
    return response.data;
};

// Fetch a specific event by ID
export const fetchEventById = async (eventId) => {
    const response = await api.get(`${eventId}`); // '/event/{eventId}'
    return response.data;
};

// Create a new event
export const createEvent = async (eventData) => {
    const response = await api.post("", eventData); // '/event/' (POST to create new event)
    return response.data;
};

// Update an event by ID
export const updateEvent = async (eventId, eventData) => {
    const response = await api.put(`${eventId}`, eventData); // '/event/{eventId}' (PUT to update)
    return response.data;
};

// Delete an event by ID
export const deleteEvent = async (eventId) => {
    const response = await api.delete(`${eventId}`); // '/event/{eventId}' (DELETE to remove event)
    return response.data;
};

export // Fetch events from the API based on view type (day/week/month)
const fetchEventsFromAPI = async (view = "month", date = new Date()) => {
    setLoading(true); // Start loading when fetching begins

    let params = {};
    const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

    if (view === "day") {
        // For 'day', just send the start_date (the full day will be fetched)
        params = { start_date: formattedDate };
    } else if (view === "week") {
        // For 'week', calculate the start date of the week (Monday or Sunday, based on your needs)
        const startOfWeek = new Date(
            date.setDate(date.getDate() - date.getDay())
        ); // Get the start of the week (Sunday)
        const formattedStartOfWeek = startOfWeek.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
        params = { start_date: formattedStartOfWeek };
    } else if (view === "month") {
        // For 'month', send year and month as additional params
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 0-indexed months
        params = { start_date: formattedDate, year, month };
    }

    try {
        const response = await fetchEvents(view, params); // Fetch events using the correct parameters for the view
        setLocalCurrEvents(response); // Set fetched events in state
        if (response.length > 0) {
            setLocalCurrEvent(response[0]); // Optionally set the first event as the current event
        }
    } catch (err) {
        setError("Error fetching events");
        console.error("Error fetching events:", err);
    } finally {
        setLoading(false); // Stop loading after fetching completes
    }
};
