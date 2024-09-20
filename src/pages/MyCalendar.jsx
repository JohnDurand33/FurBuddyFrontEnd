import React, { useState } from 'react';
import Header from '../components/Header';
import DayView from '../components/DayView';
import WeekView from '../components/WeekView';
import MonthView from '../components/MonthView';
import '../MyCalendar.css';

const MyCalendar = () => {
    const [currentView, setCurrentView] = useState('week'); // Default to 'week'
    const [currentDate, setCurrentDate] = useState(new Date());

    // State for events (mock data for now)
    const [events, setEvents] = useState([
        {
            title: 'Vet Appointment',
            startTime: 13, // 1 PM
            endTime: 14,   // 2 PM
            day: 16,       // August 16th for Month view, Monday for Week view
        },
        {
            title: 'Play Date',
            startTime: 10,
            endTime: 11,
            day: 21,
        },
    ]);

    // Navigate to next/previous day/week/month based on the current view
    const goNext = () => {
        const newDate = new Date(currentDate);
        switch (currentView) {
            case 'day':
                newDate.setDate(newDate.getDate() + 1); // Next day
                break;
            case 'week':
                newDate.setDate(newDate.getDate() + 7); // Next week
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() + 1); // Next month
                break;
            default:
                break;
        }
        setCurrentDate(newDate);
    };

    const goPrev = () => {
        const newDate = new Date(currentDate);
        switch (currentView) {
            case 'day':
                newDate.setDate(newDate.getDate() - 1); // Previous day
                break;
            case 'week':
                newDate.setDate(newDate.getDate() - 7); // Previous week
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() - 1); // Previous month
                break;
            default:
                break;
        }
        setCurrentDate(newDate);
    };

    const goToday = () => {
        setCurrentDate(new Date());
    };

    // Handle view switching (Day, Week, Month)
    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    // Formatting the header date based on the current view
    const formatHeaderDate = () => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        switch (currentView) {
            case 'day': {
                const fullDayOptions = {
                    weekday: 'long', // Full day name (e.g., "Monday")
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                };
                return currentDate.toLocaleDateString('en-US', fullDayOptions);
            }
            case 'week': {
                const monthYearOptions = { year: 'numeric', month: 'long' };
                return currentDate.toLocaleDateString('en-US', monthYearOptions);
            }
            case 'month': {
                const monthYearOptions = { year: 'numeric', month: 'long' };
                return currentDate.toLocaleDateString('en-US', monthYearOptions);
            }
            default:
                return currentDate.toLocaleDateString('en-US', options);
        }
    };

    // Dynamic view rendering based on currentView
    return (
        <div className="calendar-container">
            <Header
                currentView={currentView}
                currentDate={formatHeaderDate()} // Pass the formatted date string
                onPrev={goPrev}
                onNext={goNext}
                onToday={goToday}
                onViewChange={handleViewChange}
            />

            {/* Render the appropriate view */}
            <div className="calendar-content">
                {currentView === 'day' && <DayView events={events} currentDate={currentDate} />}
                {currentView === 'week' && <WeekView events={events} currentDate={currentDate} />}
                {currentView === 'month' && <MonthView events={events} currentDate={currentDate} />}
            </div>
        </div>
    );
};

export default MyCalendar;