import React from 'react';
import '../styles/DayView.css';

const DayView = ({ events, currEvents }) => {

    return (
        <div className="day-view">
            {Array.from({ length: 24 }).map((_, index) => {
                const hour = index === 0 ? 12 : index % 12; // Convert to 12-hour format
                const period = index < 12 ? 'AM' : 'PM'; // AM or PM period
                return (
                    <div className="day-time-slot" key={index}>
                        <div className="time-label">
                            {`${hour}:00 ${period}`}
                        </div>
                        <div className="time-content">
                            {currEvents
                                .filter(event => event.startTime === index)
                                .map(event => (
                                    <div className="event" key={event.title}>
                                        <strong>{event.title}</strong>
                                        <p>{`${event.startTime}:00 - ${event.endTime}:00`}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DayView;