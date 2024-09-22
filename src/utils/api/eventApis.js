import axios from "axios";
import { backEndUrl } from "../config";

const basePath = `${backEndUrl}/event/`; // Set '/event/' as the base path for the routes

// Create an Axios instance with the base URL
const api = axios.create({
    baseURL: basePath,  // Combine the base URL and event path
    headers: {
    'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token-based authentication
    },
});

// Fetch all events with optional view filters (day/week/month)
export const fetchEvents = async (view, params) => {
    const response = await api.get("events", { params: { view, ...params } }); // '/event/events'
    return response.data;
};

// Fetch a specific event by ID
export const fetchEventById = async (eventId) => {
    const response = await api.get(`${eventId}`); // '/event/{eventId}'
    return response.data;
};

// Create a new event
export const createEvent = async (eventData) => {
    const response = await api.post('', eventData); // '/event/' (POST to create new event)
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