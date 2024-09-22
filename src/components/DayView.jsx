import React, { useState } from 'react';
import { formatTimeTo12Hour } from '../utils/helpers'; 
import EventBox from './EventBox';
import { useEvents } from '../context/EventsContext';  
import EventModal from './EventModal';
import '../styles/DayView.css';

const DayView = ({ currEvents, currentDate, handleUpdateEvent, setIsDrawerOpen }) => {
    const { colorOptions } = useEvents();
    const { selectedEvent, setLocalSelectedEvent, updateFlag } = useEvents();
    const [showModal, setShowModal] = useState(false);


    const dayEvents = currEvents.filter(event => {
        const eventDate = new Date(event.start_time);
        return eventDate.toDateString() === currentDate.toDateString();  // Compare full day
    });

    // Function to handle event click
    const handleEventUpdate = (event) => {
        console.log('event clicked', event)
        setLocalSelectedEvent(event);
        setShowModal(true)  // Set the clicked event to state
    };

    // Function to close the modal
    const closeModal = () => {
        setIsDrawerOpen(true)
        setShowModal(false)// Clear the selected event to close the modal
    };

    const handleModalSubmission = (event) => {
        handleUpdateEvent(event)
        console.log('updateFlag in Modal param- handleModalwSubmission', updateFlag)
        closeModal()
    }

    return (
        <div className="day-view">
            {Array.from({ length: 24 }).map((_, index) => {
                const hourEvents = dayEvents.filter(event => {
                    const eventHour = new Date(event.start_time).getHours();
                    return eventHour === index;  // Match events to the current hour
                });

                const hour = index === 0 ? 12 : index % 12;  // Convert to 12-hour format
                const period = index < 12 ? 'AM' : 'PM';

                return (
                    <div className="day-time-slot" key={index}>
                        <div className="time-label">
                            {`${hour}:00 ${period}`}
                            <button onClick={() => handleModalSubmission(event)}>Open Modal</button>
                        </div>
                        <div className="time-content">
                            {hourEvents.map(event => (
                                <EventBox className="event-day" key={event.id} event={event} colorOptions={colorOptions} updateEvent={() => handleEventUpdate(event)} />
                            ))}
                        </div>
                    </div>
                );
            })}
            {/* Event Modal */}
            {updateFlag === true  && (
                <EventModal
                    onClose={closeModal} 
                    onSubmit={()=>handleUpdateEvent(eventData)}
                    isOpen={showModal}
                />
            )}
        </div>
    );
};

export default DayView;