import React, {useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEvents } from '../context/EventsContext';

const getFirstWord = (str) => {
    return str.split(' ')[0];
}

const EventBox = ({ event, colorOptions, updateEvent }) => {
    const { setLocalSelectedEvent } = useEvents();
    // Find the matching color option based on the event's color_id
    const colorOption = colorOptions.find(opt => opt.id === event.color_id) || { backgroundColor: '#FFFFFF', textColor: '#000000' };
    const location = useLocation();
    const startTime = new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });  
    const title = getFirstWord(event.name);



    return (
        <div
            onClick={updateEvent}
            className="event-month"
            style={{
                color: colorOption.textColor,
                textDecoration: 'underline',
            }}
        >
            <strong>{title} </strong>
            <span className="time-divider" style={{ backgroundColor: colorOption.backgroundColor || '' }}></span>
                {new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            
        </div>
    );
};

export default EventBox;