import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import PreAuthNavbar from '../components/PreAuthNavBar';
import MenuRail from '../components/MenuRail';
import HeroPage from './HeroPage';
import SignUp from './SignUp';
import LogIn from './LogIn';
import Dashboard from './Dashboard';
import DogProfileCreate from './DogProfileCreate';
import DogProfileViewPage from './DogProfileViewPage';
import MyCalendar from '../components/MyCalendar';
import RecordsViewPage from './RecordsViewPage';
import Map from '../components/Map';

function MainView({ toggleTheme, isDark }) {
    const [isRailOpen, setIsRailOpen] = useState(false);
    const [isMin, setIsMin] = useState(true); // Start minimized by default


    const isMobile = useMediaQuery('(max-width:600px)');
    

    useEffect(() => {
        // Adjust the rail state based on screen size after authentication
        if (isMobile) {
            setIsMin(true); // Minimize on mobile
        } else {
            setIsMin(false); // Expand on larger screens
        }
    }, [isMobile]);


    const toggleRail = () => {
        setIsRailOpen((prev) => !prev);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <PreAuthNavbar toggleTheme={toggleTheme} isMobile={isMobile} toggleRail={toggleRail} />
            <MenuRail isMobile={isMobile} isOpen={isRailOpen} toggleRail={toggleRail} isMin={isMin}/>
            <Box
                sx={{
                    flexGrow: 1,
                    marginLeft: isMobile ? 0 : isRailOpen ? '240px' : '64px',
                    transition: 'margin-left 0.3s ease-in-out',
                    padding: 2,
                }}
            >
                <Routes>
                    <Route path="/" element={<SignUp />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dogs/new" element={<DogProfileCreate />} />
                    <Route path="/dogs/view" element={<DogProfileViewPage />} />
                    <Route path="/health_records" element={<RecordsViewPage />} />
                    <Route path="/calendar" element={<MyCalendar />} />
                    <Route path="/map" element={<Map />} />
                </Routes>
            </Box>
        </Box>
    );
}

export default MainView;