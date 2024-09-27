import React from 'react';
import { format, set } from 'date-fns';
import '../EventModal.css'
import { IoMdClose } from 'react-icons/io';  // React icon for close button
import { useEvents } from '../context/EventsContext';

// Helper to format event date and time to local string
const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    const [date, time] = dateTime.split('T');
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${minutes} ${period}`;
};

const formatDisplayDate = (dateTime) => {
    if (!dateTime) return '';
    return dateTime.split('T')[0]; // Extract the date part (YYYY-MM-DD)
};

const EventModal = ({ onClose, isOpen, onEdit, onDelete, onClickDelete }) => {
    const { selectedEvent, setLocalSelectedEvent, updateFlag, setUpdateFlag } = useEvents();

    // Ensure selectedEvent is valid before trying to access its properties
    if (!selectedEvent) return null;

    // Format event times for display in local time
    const formattedDate = formatDisplayDate(selectedEvent.start_time);
    const formattedStartTime = formatDateTime(selectedEvent.start_time);
    const formattedEndTime = formatDateTime(selectedEvent.end_time);

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : 'close'}`} onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>{selectedEvent.name}</h3>
                    <button className="close-btn" onClick={onClose}>
                            <IoMdClose size={24} />
                        </button>
                    </div>

                    {/* Modal body with event details */}
                    <div className="modal-body">
                        <div className="modal-item">
                            <div className="modal-icon">📅</div>
                            <div className="modal-details">
                                <strong>Date</strong>
                                <p>{formattedDate}</p>
                            </div>
                        </div>

                        <div className="modal-item">
                            <div className="modal-icon" >📍</div>
                            <div className="modal-details">
                                <strong>Location</strong>
                                <p>{selectedEvent.street}, {selectedEvent.state}, {selectedEvent.zip_code}</p>
                            </div>
                        </div>

                        <div className="modal-item">
                            <div className="modal-icon">⏰</div>
                            <div className="modal-details">
                                <strong>Time</strong>
                                <p>
                                    {formattedStartTime} - {formattedEndTime}
                                </p>
                            </div>
                        </div>
                        

                        <div className="modal-item">
                            <strong>Notes</strong>
                            <p>{selectedEvent.notes || "No notes"}</p>
                    </div>
                </div>
                    
                    

                    <div className="modal-footer">
                    <button className="delete-btn" onClick={onClickDelete}>Delete</button>
                        <button className="edit-btn"onClick={onEdit}>Edit</button>

                    
                </div>
            </div>
        </div>
    );
};

export default EventModal;
