import React from 'react';
import '../DayView.css';

// Helper function to format event times
const formatTime = (date) => {
    const hour = date.getHours() === 0 ? 12 : date.getHours() % 12; // Convert 24-hour time to 12-hour format
    const period = date.getHours() < 12 ? 'AM' : 'PM';
    return `${hour}:00 ${period}`;
};

const DayView = ({ events, currentDate, onEventHover }) => {
    // Filter events that occur on the current day
    const eventsForCurrentDay = events.filter((event) => {
        const eventDate = new Date(event.start_time);
        return eventDate.toDateString() === currentDate.toDateString(); // Match the exact date
    });

    return (
        <div className="day-view">
            {/* Loop over 24 hours for the day view */}
            {Array.from({ length: 24 }).map((_, hour) => {
                const hourLabel = hour === 0 ? 12 : hour % 12; // Convert 24-hour to 12-hour format
                const period = hour < 12 ? 'AM' : 'PM';

                return (
                    <div className="day-time-slot" key={hour}>
                        {/* Display the time label */}
                        <div className="time-label">
                            {`${hourLabel}:00 ${period}`}
                        </div>
                        <div className="time-content">
                            {/* Render events that start during this hour */}
                            {eventsForCurrentDay
                                .filter((event) => {
                                    const eventStartHour = new Date(event.start_time).getHours();
                                    const eventEndHour = new Date(event.end_time).getHours();
                                    return hour >= eventStartHour && hour < eventEndHour; // Check if the event is active in this hour
                                })
                                .map((event) => (
                                    <div
                                        className="event"
                                        key={event.id}
                                        onMouseEnter={() => onEventHover(event)} // Hover triggers event selection
                                        onMouseLeave={() => onEventHover(null)}  // Clear selection on leave
                                    >
                                        <strong>{event.title}</strong>
                                        <p>
                                            {formatTime(new Date(event.start_time))} - {formatTime(new Date(event.end_time))}
                                        </p>
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