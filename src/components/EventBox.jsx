import React, { useState } from 'react';
import EventModal from './EventModal'; // Assuming you already have an EventModal component
import './EventBox.css'; // Custom CSS for styling

const EventBox = ({ event, view, color_id }) => {
    const [hovered, setHovered] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleHover = () => {
        setHovered(true);
        setSelectedEvent(event); // Set the selected event for the modal
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    // Define styles based on the `view` prop
    const getBoxStyle = () => {
        switch (view) {
            case 'day':
                return { width: '100%', height: '50px', backgroundColor: color_id };
            case 'week':
                return { width: '150px', height: '75px', backgroundColor: color_id };
            case 'month':
                return { width: '75px', height: '50px', backgroundColor: color_id };
            default:
                return { width: '100px', height: '50px', backgroundColor: color_id };
        }
    };

    return (
        <div
            className="event-box"
            style={getBoxStyle()}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
        >
            <div className="event-header">
                {event.name}
            </div>
            <div className="event-times">
                <span>FROM: {event.fromTime} </span>
                <span>TO: {event.toTime} </span>
            </div>

            {hovered && <EventModal event={selectedEvent} />}
        </div>
    );
};

export default EventBox;