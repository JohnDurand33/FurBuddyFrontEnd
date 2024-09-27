import React, { useMemo } from 'react';
import EventBox from './EventBox'; // Import the EventBox component
import { parseISO } from 'date-fns';
import '../DayView.css';

const DayView = ({ events, currentDate, onEventHover, onEventClick }) => {
    // Filter events for the current day
    const eventsForCurrentDay = useMemo(() => {
        return events.filter((event) => {
            const eventDate = parseISO(event.start_time);
            return eventDate.toDateString() === currentDate.toDateString();
        });
    }, [events, currentDate]);

    return (
        <div className="day-view">
            {/* Loop over 24 hours for the day view */}
            {Array.from({ length: 24 }).map((_, hour) => {
                const hourLabel = hour === 0 ? 12 : hour % 12;
                const period = hour < 12 ? 'AM' : 'PM';

                return (
                    <div className="day-time-slot" key={hour}>
                        <div className="time-label">
                            {`${hourLabel}:00 ${period}`}
                        </div>
                        <div className="time-content">
                            {/* Only render the event once for the current day */}
                            {hour === 0 && (
                                <div className="event-container">
                                    {eventsForCurrentDay.map((event) => (
                                        <EventBox
                                            key={event.id}
                                            event={event}
                                            sx={{ width: '100%' }}
                                            onEventHover={() => onEventHover(event)}
                                            onEventClick={() => onEventClick(event)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DayView;