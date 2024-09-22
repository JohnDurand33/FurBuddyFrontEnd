import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import DayView from '../components/DayView';
import WeekView from '../components/WeekView';
import MonthView from '../components/MonthView';
import EventDrawer from '../components/EventDrawer';
import '../styles/MyCalendar.css';
import { useEvents } from '../context/EventsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { debounce } from 'lodash';
import EventModal from '../components/EventModal';
import { fetchEvents } from '../utils/api/eventApis';
import { ensureArray } from '../utils/helpers';

const VIEWS = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
};



const MyCalendar = () => {
    const { currEvents, createNewEvent, selectedEvent, setLocalSelectedEvent, updateFlag, setUpdateFlag, setLocalCurrEvent, setLocalCurrEvents, fetchEventsFromAPI } = useEvents();
    const { authed, token } = useAuth();
    const [currentView, setCurrentView] = useState(VIEWS.WEEK); // Default to 'week' view
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const normalizeDate = (date) => {
        const newDate = new Date(date);
        newDate.setSeconds(0, 0);  // Zero out seconds and milliseconds
        return newDate;
    };
    

    const adjustDate = (currentView, direction) => {
        const newDate = normalizeDate(currentDate);
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

    const handleCreateNewEvent = () => {
        setLocalSelectedEvent(null);
        setIsDrawerOpen(true);
    };

    const handleUpdateEvent = (event) => {  
        setLocalSelectedEvent(event);
        setShowModal(true);
    }

    const handleModalSubmission = (eventData) => {
        setLocalSelectedEvent(eventData);  // Ensure selected event is updated
        setShowModal(false);  // Close modal
        setIsDrawerOpen(true);  // Open drawer to edit the selected event
    };


    
    useEffect(() => {
        const normalizedCurrentDate = normalizeDate(currentDate);
        console.log('Fetching events for normalized date:', normalizedCurrentDate);
        fetchEventsFromAPI(currentView, normalizedCurrentDate); // Use normalized date
    }, [currentDate, currentView]);  // Run effect when currentDate or currentView changes

    return (
        <div className="calendar-container">
            {loading && <div className="loading-spinner">Loading...</div>}
            {!loading && (
                <>
                    <Header
                        currentView={currentView}
                        currentDate={currentDate}
                        onPrev={goPrev}
                        onNext={goNext}
                        onToday={goToday}
                        onViewChange={setCurrentView}
                        setIsDrawerOpen={setIsDrawerOpen}
                        handleCreateNewEvent={handleCreateNewEvent}
                    />
                    <div className="calendar-content">
                        {currentView === VIEWS.DAY && <DayView currEvents={currEvents}
                            currentDate={currentDate}
                            handleUpdateEvent={handleUpdateEvent}
                            setIsDrawerOpen={setIsDrawerOpen} />}
                        {currentView === VIEWS.WEEK && <WeekView currEvents={currEvents}
                            currentDate={currentDate}
                            handleUpdateEvent={handleUpdateEvent} />}
                        {currentView === VIEWS.MONTH && <MonthView currEvents={currEvents} currentDate={currentDate} handleUpdateEvent={handleUpdateEvent} />}
                    </div>
                    <EventDrawer
                        isOpen={isDrawerOpen}
                        setIsDrawerOpen={setIsDrawerOpen}
                        handleUpdateEvent={handleUpdateEvent}
                    />
                    {/* Event Modal */}
                    {showModal && (
                        <EventModal
                            onClose={() => setShowModal(false)}  // Close modal
                            onSubmit={handleModalSubmission}  // Submit from modal opens the drawer
                        />
                    )}
                </>
            )}
        </div>
    );
};


export default MyCalendar;