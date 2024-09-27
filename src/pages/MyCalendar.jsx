import React, { useState } from 'react';
import Header from '../components/Header';
import DayView from '../components/DayView';
import WeekView from '../components/WeekView';
import MonthView from '../components/MonthView';
import EventDrawer from '../components/EventDrawer';
import EventModal from '../components/EventModal';
import {Modal, Box, Button, Typography } from '@mui/material';
import { isSameDay, isSameWeek, isSameMonth, parseISO, set } from 'date-fns';
import '../MyCalendar.css';
import { useEvents } from '../context/EventsContext';

const MyCalendar = () => {
    const [currentView, setCurrentView] = useState('day'); // Default to 'day'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for EventDrawer
    const [isModalOpen, setIsModalOpen] = useState(false);  // State for EventModal
    const [hoveredEvent, setHoveredEvent] = useState(null); // State for hovered event
    const [isWarningOpen, setIsWarningOpen] = useState(false); // State for warning modal
    const [submitting, setSubmitting] = useState(false); // State for delete confirmation

    const {
        currEvents,
        selectedEvent,
        setLocalSelectedEvent,
        setLocalCurrEvents,
        updateFlag,
        setUpdateFlag,
        deleteExistingEvent,
    } = useEvents();

    // Handle creating a new event
    const handleCreateEvent = () => {
        setUpdateFlag(false);           // We're in "create" mode
        setLocalSelectedEvent(null);    // Clear any selected event
        setIsDrawerOpen(true);          // Open the drawer for a new event
    };

    const handleEventHover = (event) => {
        setLocalSelectedEvent(event); // Set hovered event as selectedEvent
        console.log("Hovered over event:", event);
    };

    const handleEventClick = () => {
        setIsModalOpen(true);
    };

    // Handle editing an event from the modal
    const handleEditEvent = () => {
        setUpdateFlag(true);            // We're in "edit" mode
        setIsModalOpen(false);          // Close the modal
        setIsDrawerOpen(true);
    };

    // Handle deleting an event
    const handleDeleteEvent = async () => {
        if (selectedEvent) {
            await deleteExistingEvent(selectedEvent.id);
            setIsModalOpen(false);
            const updatedEvents = currEvents.filter((event) => event.id !== selectedEvent.id);
            setLocalCurrEvents(updatedEvents);
            setLocalSelectedEvent({});
        }
    };

    const handleWarningConfirm = () => {
        setSubmitting(true);
        setIsWarningOpen(false);
        handleDeleteEvent();
        setSubmitting(false);
    }

    // Handle closing the modal
    const handleModalClose = () => {
        setIsModalOpen(false);  // Close the modal
    };

    const filterEventsForCurrentView = () => {
        if (currentView === 'day') {
            return currEvents.filter((event) => {
                const eventDate = parseISO(event.start_time);
                return isSameDay(eventDate, currentDate);
            });
        } else if (currentView === 'week') {
            return currEvents.filter((event) => {
                const eventDate = parseISO(event.start_time);
                return isSameWeek(eventDate, currentDate);
            });
        } else if (currentView === 'month') {
            return currEvents.filter((event) => {
                const eventDate = parseISO(event.start_time);
                return isSameMonth(eventDate, currentDate);
            });
        }
        return [];
    };

    const filteredEvents = filterEventsForCurrentView(); // Get filtered events

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
                {currentView === 'day' && <DayView
                    events={filteredEvents}
                    currentDate={currentDate}
                    onEventHover={handleEventHover}
                    onEventClick={handleEventClick} />}
                {currentView === 'week' && <WeekView events={filteredEvents} currentDate={currentDate} onEventHover={handleEventHover} onEventClick={handleEventClick} />}
                {currentView === 'month' && <MonthView events={filteredEvents} currentDate={currentDate} onEventHover={handleEventHover} onEventClick={handleEventClick} />}
            </div>

            <EventDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />

            <EventModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onClickDelete={()=>setIsWarningOpen(true)}
            />
            {/* Delete Confirmation Modal */}
            <Modal
                open={isWarningOpen}
                aria-labelledby="delete-confirmation-modal"
                aria-describedby="ask-for-confirmation"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        minWidth: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="delete-confirmation-modal" variant="h6" component="h2">
                        Are you sure you want to delete this event?
                    </Typography>
                    <Typography id="ask-for-confirmation" sx={{ mt: 2 }}>
                        This action cannot be undone.
                    </Typography>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', }}>
                        <Button
                            sx={{ backgroundColor: 'secondary.main' }}
                            variant="outlined"
                            color="grey"
                            onClick={handleWarningConfirm}
                        >
                            {submitting ? 'Deleting...' : 'Confirm'}
                        </Button>
                        <Button
                            sx={{ boxShadow: 'none', borderRadius: '2px', color: 'black', border: '1px solid grey' }}
                            variant="outlined"
                            color="secondary"
                            onClick={()=>setIsWarningOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default MyCalendar;