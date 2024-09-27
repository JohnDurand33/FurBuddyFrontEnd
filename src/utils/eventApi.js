import axios from "axios";
import { backEndUrl } from "./config";

const basePath = `${backEndUrl}/event/`; // Set '/event/' as the base path for the routes

export const api = axios.create({
    baseURL: basePath,
    headers: {
        "Content-Type": "application/json",
    },
});

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

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("API Error:", error.response || error.message);
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
