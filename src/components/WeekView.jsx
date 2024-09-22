import React, { useEffect, useState, useMemo } from 'react';
import { formatTimeTo12Hour } from '../utils/helpers';  
import EventBox from './EventBox';
import { useEvents } from '../context/EventsContext';
import '../styles/WeekView.css';

const getWeekDates = (date) => {
    const weekDates = [];
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay() || 7;  
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1); 

    for (let i = 0; i < 7; i++) {
        const weekDate = new Date(startOfWeek);
        weekDate.setDate(startOfWeek.getDate() + i);
        weekDates.push(weekDate);
    }

    return weekDates;
};
const WeekView = ({ currentDate, currEvents }) => {
    const { colorOptions } = useEvents();
    const currentWeekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

    // Helper function to extract date and match events to the day/hour slots.
    const getDayEvents = useMemo(() => {
        return (date, hourIndex) => {
            return currEvents.filter((event) => {
                const eventDate = new Date(event.start_time);
                return (
                    eventDate.toDateString() === date.toDateString() &&
                    eventDate.getHours() === hourIndex
                );
            });
        };
    }, [currEvents]);

    return (
        <div className="week-view">
            {/* Week Day Headers */}
            <div className="week-days-header">
                {['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div className="week-day-header" key={day}>
                        <div className="day-date">
                            {day !== '' && currentWeekDates[index - 1] && (
                                <div className="week-day-box">
                                    {currentWeekDates[index - 1] && currentWeekDates[index - 1].getDate()}
                                </div>
                            )}
                        </div>
                        {day}
                    </div>
                ))}
            </div>

            {/* Week Time Slots */}
            <div className="week-content">
                {Array.from({ length: 24 }).map((_, hourIndex) => {
                    const hour = hourIndex === 0 ? 12 : hourIndex % 12;  // 12-hour format
                    const period = hourIndex < 12 ? 'AM' : 'PM';

                    return (
                        <div className="time-row" key={hourIndex}>
                            <div className="week-time-label">
                                {`${hour}:00 ${period}`}
                            </div>
                            {currentWeekDates.map((date, dateIndex) => {
                                // Filter events for this specific day and hour
                                const dayEvents = currEvents.filter(event => {
                                    const eventDate = new Date(event.start_time);
                                    return eventDate.toDateString() === date.toDateString() &&
                                        eventDate.getHours() === hourIndex;
                                });

                                return (
                                    <div className="week-time-slot" key={dateIndex}>
                                        <div className="time-content">
                                            {dayEvents.map(event => (
                                                <EventBox className='event-week' key={event.id} event={event} colorOptions={colorOptions}></EventBox>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeekView;