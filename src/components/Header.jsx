import React from 'react';
import '../styles/Header.css';

const Header = ({ currentView, currentDate, onPrev, onNext, onToday, onViewChange, setIsDrawerOpen, handleCreateNewEvent }) => {

    const formatDateForView = (currentDate, currentView) => {
        if (currentView === 'day') {
            return currentDate.toLocaleDateString(navigator.language, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        // For VIEWS.MONTH or VIEWS.WEEK, return the date as is (e.g., no special formatting)
        const formattedDate = currentDate.toLocaleDateString(navigator.language, {
            month: 'long',  // "September"
            year: 'numeric' // "2024"
        })
        return formattedDate.replace(' ', ', ');
    };

    const displayedDate = formatDateForView(currentDate, currentView);

    return (
        <div className="calendar-header">
            {/* Left group: Date + Navigation buttons */}
            <div className="left-header-group">
                <div className="calendar-title">
                    <h3>{displayedDate}</h3> {/* Removed inline styling */}
                </div>
                <div className="calendar-nav">
                    <button type="button" className="nav-button" onClick={onPrev}>&lt;</button>
                    <button type="button" className="nav-button" onClick={onNext}>&gt;</button>
                    <button type="button" className="today-button" onClick={onToday}>Today</button>
                </div>
            </div>

            {/* Right group: Create + View buttons */}
            <div className="right-header-group">
                <button type="button" className="create-btn" onClick={handleCreateNewEvent}>Create Event</button>
                <div className="view-buttons">
                    <button
                        type="button"
                        className={currentView === 'day' ? 'active' : ''}
                        onClick={() => onViewChange('day')}
                    >
                        Day
                    </button>
                    <button
                        type="button"
                        className={currentView === 'week' ? 'active' : ''}
                        onClick={() => onViewChange('week')}
                    >
                        Week
                    </button>
                    <button
                        type="button"
                        className={currentView === 'month' ? 'active' : ''}
                        onClick={() => onViewChange('month')}
                    >
                        Month
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;