import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/NavBar';
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
    const isMobile = useMediaQuery('(max-width:600px)');



    const toggleRail = () => {
        setIsRailOpen((prev) => !prev);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Navbar toggleTheme={toggleTheme} isMobile={isMobile} toggleRail={toggleRail} />
            <MenuRail isMobile={isMobile} isOpen={isRailOpen} toggleRail={toggleRail} />
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