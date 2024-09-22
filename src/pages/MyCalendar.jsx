import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DayView from '../components/DayView';
import WeekView from '../components/WeekView';
import MonthView from '../components/MonthView';
import EventDrawer from '../components/EventDrawer';
import '../styles/MyCalendar.css';
import { useEvents } from '../context/EventsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const VIEWS = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
};

const MyCalendar = () => {
    const { currEvents, fetchEventsFromAPI, createNewEvent, selectedEvent, setLocalSelectedEvent } = useEvents();
    const { authed, token } = useAuth();
    const [currentView, setCurrentView] = useState(VIEWS.WEEK); // Default to 'week' view
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const adjustDate = (direction) => {
        const newDate = new Date(currentDate);
        switch (currentView) {
            case VIEWS.DAY:
                newDate.setDate(newDate.getDate() + direction);
                break;
            case VIEWS.WEEK:
                newDate.setDate(newDate.getDate() + 7 * direction);
                break;
            case VIEWS.MONTH:
                newDate.setMonth(newDate.getMonth() + direction);
                break;
            default:
                break;
        }
        setCurrentDate(newDate);
    };

    const goNext = () => adjustDate(1);
    const goPrev = () => adjustDate(-1);
    const goToday = () => setCurrentDate(new Date());

    return (
        <div className="calendar-container">
            {loading && <div className="loading-spinner">Loading...</div>}
            {!loading && (
                <>
                    <Header
                        currentView={currentView}
                        currentDate={currentDate.toLocaleDateString(navigator.language, { year: 'numeric', month: 'long' })}
                        onPrev={goPrev}
                        onNext={goNext}
                        onToday={goToday}
                        onViewChange={setCurrentView}
                        setIsDrawerOpen={setIsDrawerOpen}
                    />
                    <div className="calendar-content">
                        {currentView === VIEWS.DAY && <DayView currEvents={currEvents} currentDate={currentDate} />}
                        {currentView === VIEWS.WEEK && <WeekView currEvents={currEvents} currentDate={currentDate} />}
                        {currentView === VIEWS.MONTH && <MonthView currEvents={currEvents} currentDate={currentDate} />}
                    </div>
                    <EventDrawer
                        isOpen={isDrawerOpen}
                        setIsDrawerOpen={setIsDrawerOpen}
                        selectedEvent={selectedEvent}
                        setLocalSelectedEvent={setLocalSelectedEvent}
                    />
                </>
            )}
        </div>
    );
};

export default MyCalendar;