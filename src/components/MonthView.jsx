import React from 'react';
import '../styles/MonthView.css';

const getMonthDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysBeforeStart = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start
    const totalDays = daysInMonth + daysBeforeStart; // Total days, including empty cells
    return { daysInMonth, daysBeforeStart, totalDays };
};

const MonthView = ({ currentDate, currEvents }) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const { daysInMonth, daysBeforeStart, totalDays } = getMonthDays(year, month);

    // Create an array for the 42 day boxes (6 weeks)
    const dayBoxes = Array.from({ length: 42 }).map((_, index) => {
        const dayNumber = index - daysBeforeStart + 1;
        const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;

        const dayEvents = currEvents.filter(event => event.day === dayNumber && isCurrentMonth);
        return {
            dayNumber: isCurrentMonth ? dayNumber : '',
            events: dayEvents,
            isCurrentMonth,
        };
    });

    return (
        <>
            {/* Day Headers */}
            <div className="month-day-headers">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div className="month-day-header-box" key={index}>
                        {day}
                    </div>
                ))}
            </div>
            <button>
                
            </button>

            {/* Day Boxes */}
            <div className="month-view">
                {dayBoxes.map((box, index) => (
                    <div
                        className={`month-day-box ${!box.isCurrentMonth ? 'grey-box' : ''}`}
                        key={index}
                    >
                        <div className="month-day-header">{box.dayNumber}</div>
                        <div className="month-day-content">
                            {box.events.map(event => (
                                <div className="event" key={event.title}>
                                    <strong>{event.title}</strong>
                                    <p>{event.startTime}:00 - {event.endTime}:00</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default MonthView;