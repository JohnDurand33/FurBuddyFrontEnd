import React, { useEffect, useState } from 'react';
import '../WeekView.css';

const WeekView = ({ currentDate, events }) => {
    const [currentWeekDates, setCurrentWeekDates] = useState([]);

    // Function to get the dates for the current week
    const getWeekDates = (date) => {
        const weekDates = [];
        const startOfWeek = new Date(date);
        const dayOfWeek = startOfWeek.getDay() || 7; // Make Sunday (0) to be the last day
        startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1); // Start on Monday

        for (let i = 0; i < 7; i++) {
            const weekDate = new Date(startOfWeek);
            weekDate.setDate(startOfWeek.getDate() + i);
            weekDates.push(weekDate);
        }

        return weekDates;
    };

    useEffect(() => {
        setCurrentWeekDates(getWeekDates(currentDate));
    }, [currentDate]);

    return (
        <div className="week-view">
            {/* Fixed Day Headers */}
            <div className="week-days-header">
                {['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div className="week-day-header" key={day}>
                        {day && (
                            <div className="day-date">
                                <div className="week-day-box">
                                    {currentWeekDates[index - 1] && currentWeekDates[index - 1].getDate()}
                                </div>
                            </div>
                        )}
                        {day}
                    </div>
                ))}
            </div>

            {/* Scrollable Time Slots */}
            <div className="week-content">
                {Array.from({ length: 24 }).map((_, hourIndex) => {
                    const hour = hourIndex === 0 ? 12 : hourIndex % 12; // Convert to 12-hour format
                    const period = hourIndex < 12 ? 'AM' : 'PM'; // AM/PM period
                    return (
                        <div className="time-row" key={hourIndex}>
                            {/* Time Label for the row */}
                            <div className="week-time-label">
                                {`${hour}:00 ${period}`}
                            </div>
                            {/* Week Days for each time slot */}
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                <div className="week-time-slot" key={day + hourIndex}>
                                    {/* Add events that match the specific day/time */}
                                    <div className="time-content"></div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeekView;