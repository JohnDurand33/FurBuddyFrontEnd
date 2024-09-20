import React from 'react';
import '../Header.css';

const Header = ({ currentView, currentDate, onPrev, onNext, onToday, onViewChange }) => {
    return (
        <div className="calendar-header">
            {/* Left group: Date + Navigation buttons */}
            <div className="left-header-group">
                <div className="calendar-title">
                    <h3>{currentDate}</h3> {/* Removed inline styling */}
                </div>
                <div className="calendar-nav">
                    <button type="button" className="nav-button" onClick={onPrev}>&lt;</button>
                    <button type="button" className="nav-button" onClick={onNext}>&gt;</button>
                    <button type="button" className="today-button" onClick={onToday}>Today</button>
                </div>
            </div>

            {/* Right group: Create + View buttons */}
            <div className="right-header-group">
                <button type="button" className="create-btn">+ Create</button>
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