import React, { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import Navbar from '../components/NavBar';
import MenuRail from '../components/MenuRail';
import HeroPage from './HeroPage';
import SignUp from './SignUp';
import LogIn from './LogIn';
import DogProfileCreate from './DogProfileCreate';
import DogProfileViewPage from './DogProfileView';
import RecordsPage from './RecordsPage';
import CalendarPage from './CalendarPage';
import { useAuth } from '../context/AuthContext';

function MainView({ toggleTheme, isDark }) {
    const { authed } = useAuth();
    const [isRailOpen, setIsRailOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false); 
    const isMobile = useMediaQuery('(max-width:600px)');
    const location = useLocation(); // Get the current location

    const handleCollapseToggle = () => {
        setIsCollapsed((prev) => !prev);
    };

    const toggleRail = () => {
        setIsRailOpen((prev) => !prev);
    };

    // Conditionally apply margin and padding based on the current path
    const isCalendarPage = location.pathname === '/calendar'; // Check if on the calendar page

    // Function to calculate margin-left based on authed, isMobile, and isRailOpen states
    const getMarginLeft = () => {
        if (!authed || !isRailOpen) {
            return '0px';
        } else if (isMobile) {
            return '64px';
        } else {
            return isCollapsed ? '64px' : '240px';
        }
    };

    

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            ml: !isMobile ? getMarginLeft() : 0,
            pr: isCalendarPage ? '20px' : '16px', // Adjust margin based on calendar page
            mb: isCalendarPage ? '0px' : '16px', // No bottom margin for calendar
            height: '100vh',
            transition: 'margin-left 0.3s ease-in-out',
        }}>
            {!isCalendarPage && ( // Hide Navbar on calendar page if desired
                <Navbar toggleTheme={toggleTheme} isMobile={isMobile} />
            )}
            <MenuRail
                isMobile={isMobile}
                isRailOpen={isRailOpen}
                toggleRail={toggleRail}
                isCollapsed={isCollapsed}
                toggleCollapse={handleCollapseToggle}
                toggleTheme={toggleTheme}
                isDark={isDark}
            />
            <Box
                sx={{
                    flexGrow: 1,
                    transition: 'margin-left 0.3s ease-in-out',
                    padding: isCalendarPage ? '0px' : '16px', // No padding on calendar page
                }}
            >
                <Routes>
                    <Route path="/" element={<SignUp />} />
                    <Route path="/signup" element={<SignUp isMobile={isMobile} toggleRail={toggleRail} />} />
                    <Route path="/login" element={<LogIn isMobile={isMobile} toggleRail={toggleRail} setIsRailOpen={setIsRailOpen} />} />
                    <Route path="/heropage" element={<HeroPage isMobile={isMobile} />} />
                    <Route path="/dogs/new" element={<DogProfileCreate isMobile={isMobile} />} />
                    <Route path="/dogs/view" element={<DogProfileViewPage isMobile={isMobile} getMarginLeft={getMarginLeft} isRailOpen={isRailOpen} />} />
                    <Route path="/records" element={<RecordsPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    {/* <Route path="/map" element={<Map />} /> */}
                </Routes>
            </Box>
        </Box>
    );
}

export default MainView;