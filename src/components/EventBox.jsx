import React from 'react';
import { parseISO, differenceInMinutes, getHours, getMinutes } from 'date-fns';
import { useEvents } from '../context/EventsContext';

// Helper function to format event times
const formatTime = (date) => {
    const hour = date.getHours() === 0 ? 12 : date.getHours() % 12;
    const period = date.getHours() < 12 ? 'AM' : 'PM';
    return `${hour}:${date.getMinutes().toString().padStart(2, '0')} ${period}`;
};

const EventBox = ({ event, onEventHover, onEventClick }) => {
    const { colorOptions } = useEvents();

    // Helper to get the background color from color_id
    const getColorFromId = (colorId) => {
        const color = colorOptions.find((color) => color.id === colorId);
        return color ? color.backgroundColor : 'lightgrey'; // Default to light grey if no match
    };

    const eventStart = parseISO(event.start_time); // Parse ISO string to Date object
    const eventEnd = parseISO(event.end_time);     // Parse ISO string to Date object

    // Calculate the top position based on the event's start time
    const startHour = getHours(eventStart);
    const startMinutes = getMinutes(eventStart);
    const topPosition = (startHour * 60 + startMinutes) * (90 / 60); // 90px per hour slot

    // Calculate the event's duration in minutes and height in pixels
    const durationInMinutes = differenceInMinutes(eventEnd, eventStart);
    const height = (durationInMinutes / 60) * 90; // 90px per hour slot

    // Event style based on top position and height
    const eventStyle = {
        position: 'absolute',
        top: `${topPosition}px`,
        height: `${height}px`,
        width: '100%',
        backgroundColor: event.color_id ? getColorFromId(event.color_id) : '#ffeb3b',
        padding: '5px',
        borderRadius: '4px',
        zIndex: 1,
        boxSizing: 'border-box',
    };

    return (
        <div
            className="event-box"
            style={eventStyle}
            onMouseEnter={() => onEventHover(event)}  // Trigger the hover function passed from DayView
            onClick={() => { onEventClick(event) }}
        >
            <strong>{event.name}</strong>
            <p>{formatTime(eventStart)} - {formatTime(eventEnd)}</p>
        </div>
    );
};

export default EventBox;