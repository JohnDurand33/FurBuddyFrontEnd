import React, { useState } from 'react';
import Header from '../components/Header';
import DayView from '../components/DayView';
import WeekView from '../components/WeekView';
import MonthView from '../components/MonthView';
import EventDrawer from '../components/EventDrawer';
import EventModal from '../components/EventModal';
import '../MyCalendar.css';
import { useEvents } from '../context/EventsContext';

const MyCalendar = () => {
    const [currentView, setCurrentView] = useState('week'); // Default to 'week'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for EventDrawer
    const [isModalOpen, setIsModalOpen] = useState(false);  // State for EventModal
    const [hoveredEvent, setHoveredEvent] = useState(null); // State for hovered event

    const {
        currEvents,
        selectedEvent,
        setLocalSelectedEvent,
        updateFlag,
        setUpdateFlag,
    } = useEvents();

    // Handle creating a new event
    const handleCreateEvent = () => {
        setUpdateFlag(false); // We are in "create" mode
        setLocalSelectedEvent(null); // Clear any selected event
        setIsDrawerOpen(true);  // Open the drawer for a new event
    };

    // Handle hovering over an event
    const handleEventHover = (event) => {
        if (event) {
            setLocalSelectedEvent(event);  // Set the hovered event
            setHoveredEvent(event);        // Update the state for the modal to show
            setIsModalOpen(true);          // Show modal on hover
        } else {
            setIsModalOpen(false);         // Close modal when not hovering
        }
    };

    // Handle closing the modal
    const handleModalClose = () => {
        setIsModalOpen(false);  // Close the modal
    };

    // Navigate to the next time period based on current view
    const goNext = () => {
        const newDate = new Date(currentDate);
        switch (currentView) {
            case 'day':
                newDate.setDate(newDate.getDate() + 1); break;
            case 'week':
                newDate.setDate(newDate.getDate() + 7); break;
            case 'month':
                newDate.setMonth(newDate.getMonth() + 1); break;
            default: break;
        }
        setCurrentDate(newDate);
    };

    // Navigate to the previous time period
    const goPrev = () => {
        const newDate = new Date(currentDate);
        switch (currentView) {
            case 'day':
                newDate.setDate(newDate.getDate() - 1); break;
            case 'week':
                newDate.setDate(newDate.getDate() - 7); break;
            case 'month':
                newDate.setMonth(newDate.getMonth() - 1); break;
            default: break;
        }
        setCurrentDate(newDate);
    };

    // Return to the current date
    const goToday = () => {
        setCurrentDate(new Date());
    };

    // Render the view based on currentView state
    return (
        <div className="calendar-container">
            <Header
                currentView={currentView}
                currentDate={currentDate}
                onPrev={goPrev}
                onNext={goNext}
                onToday={goToday}
                onViewChange={setCurrentView}
                onCreateEvent={handleCreateEvent}
            />

            {/* Render the appropriate view */}
            <div className="calendar-content">
                {currentView === 'day' && <DayView events={currEvents} currentDate={currentDate} onEventHover={handleEventHover} />}
                {currentView === 'week' && <WeekView events={currEvents} currentDate={currentDate} onEventHover={handleEventHover} />}
                {currentView === 'month' && <MonthView events={currEvents} currentDate={currentDate} onEventHover={handleEventHover} />}
            </div>

            <EventDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />

            <EventModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                event={hoveredEvent} // Pass the hovered event to the modal
            />
        </div>
    );
};

export default MyCalendar;