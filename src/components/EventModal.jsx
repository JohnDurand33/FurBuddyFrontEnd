import React from 'react';
import { format, set } from 'date-fns';
import '../styles/EventModal.css';  // You'll create this CSS file for modal styling
import { IoMdClose } from 'react-icons/io';  // React icon for close button
import { useEvents } from '../context/EventsContext';

const EventModal = ({ onClose, onSubmit, isOpen }) => {
    const { selectedEvent, setLocalSelectedEvent, updateFlag, setUpdateFlag } = useEvents();

    const formatDateTime = (dateTime) => {
        console.log("before updatedDateTime data: ", dateTime)
        const result = dateTime ? dateTime.split('T')[1].split(':').slice(0, 2).join(':') : '';
        console.log('updated time dateTime', result)
        return result;
    };

    const formatDisplayDate = (dateTime) => {
        console.log("before displayDate: ", dateTime)
        const result = dateTime ? dateTime.split('T')[0] : '';
        console.log('displayDate', result)
        return result;
    };

    const formattedDate = formatDisplayDate(selectedEvent.start_time);

    const updatedStartDateTime = formatDateTime(selectedEvent.start_time)
    const updateEndDateTime = formatDateTime(selectedEvent.end_time)

    const startTime = selectedEvent.start_time;
    const endTime = selectedEvent.end_time

    const handleModalDrawerDataUpdate = (eventData) => {
        try {
            console.log('eventData', eventData)
            console.log('formattedDate', formattedDate)
            console.log('updatedStartDateTime', updatedStartDateTime)
            console.log('updateEndDateTime', updateEndDateTime)
            console.log('startTime', startTime)
            console.log('endTime', endTime)

            if (updateFlag) {
                setUpdateFlag(false)
                console.log('updateFlag is true', selectedEvent)
            } else {
                console.log('updateFlag is false', selectedEvent)
                const updatedEventData = {
                    id: eventData.id,
                    name: eventData?.name || '',
                    street: eventData?.street || '',
                    zip_code: eventData?.zip_code || '',
                    state: eventData?.state || '',
                    date: formattedDate,
                    start_time: updatedStartDateTime,
                    end_time: updateEndDateTime,
                    notes: eventData?.notes || '',
                    color_id: eventData?.color_id || '',
                }
                setUpdateFlag(true)
                handleLogNewSelectedEvent(updatedEventData);
                handleUpdateEvent(updatedEventData);
            }
        } catch (error) {
            console.log('Error updating event data', error)
        }
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{selectedEvent.name}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <IoMdClose size={24} />
                    </button>
                </div>

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
                            <p>{selectedEvent.street}, {selectedEvent.zip_code}, {selectedEvent.state}</p>
                        </div>
                    </div>

                    <div className="modal-item">
                        <div className="modal-icon">⏰</div>
                        <div className="modal-details">
                            <strong>Time</strong>
                            <p>
                                {startTime} - {endTime}
                            </p>
                        </div>
                    </div>

                    <div className="modal-item">
                        <strong>Notes</strong>
                        <p>{selectedEvent.notes || "No notes"}</p>
                    </div>

                    <div className="modal-item notification-toggle">
                        <strong>Turn On Notification</strong>
                        <input type="checkbox" className="toggle-switch" />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="delete-btn">Delete</button>
                    <button onClick={() => onSubmit(selectedEvent)} className="edit-btn">Edit</button>

                </div>
            </div>
        </div>
    );
};

export default EventModal;
