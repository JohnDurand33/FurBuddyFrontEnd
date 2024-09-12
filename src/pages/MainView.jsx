import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/NavBar';
import MenuRail from '../components/MenuRail';
import HeroPage from './HeroPage';
import SignUp from './SignUp';
import LogIn from './LogIn';
import DogProfileCreate from './DogProfileCreate';
import DogProfileViewPage from './DogProfileView';
import MyCalendar from '../components/MyCalendar';
import RecordsPage from './RecordsPage';
import { useAuth } from '../context/AuthContext';

function MainView({ toggleTheme, isDark }) {
    const { authed } = useAuth();
    const [isRailOpen, setIsRailOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false); 
    const isMobile = useMediaQuery('(max-width:600px)');

    const handleCollapseToggle = () => {
        console.log('Toggling Collapse MenuRail');
        setIsCollapsed((prev) => !prev);
    };

    const toggleRail = () => {
        console.log('Toggling isRailOpen:', !isRailOpen);
        setIsRailOpen((prev) => !prev);
    };

    const getMarginLeft = () => {
        if (!authed) return '0px'
        else {
            if (!isMobile) {
                if (isRailOpen) {
                    return isCollapsed ? '64px' : '240px';
                }
            } else return '64px';
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            ml: !isMobile ? getMarginLeft() : 0,
            height: '100vh',
            transition: 'margin-left 0.3s ease-in-out',
        }}>
            <Navbar toggleTheme={toggleTheme} isMobile={isMobile} toggleRail={toggleRail} />
            <MenuRail isMobile={isMobile} isRailOpen={isRailOpen} toggleRail={toggleRail} isCollapsed={isCollapsed}
                toggleCollapse={handleCollapseToggle} />
            <Box
                sx={{
                    flexGrow: 1,
                    transition: 'margin-left 0.3s ease-in-out',
                    padding: 2,
                }}
            >
                <Routes>
                    <Route path="/" element={<SignUp />} />
                    <Route path="/signup" element={<SignUp isMobile={isMobile} toggleRail={toggleRail} />} />
                    <Route path="/login" element={<LogIn isMobile={isMobile} toggleRail={toggleRail} setIsRailOpen={setIsRailOpen} />} />
                    <Route path="/heropage" element={<HeroPage isMobile={isMobile} />} />
                    <Route path="/dogs/new" element={<DogProfileCreate isMobile={isMobile} />} />
                    <Route path="/dogs/view" element={<DogProfileViewPage isMobile={isMobile} getMarginLeft={getMarginLeft} isRailOpen={isRailOpen}/>} />
                    <Route path="/records" element={<RecordsPage />} />
                    {/* <Route path="/calendar" element={<MyCalendar />} />
                    <Route path="/map" element={<Map />} /> */}
                </Routes>
            </Box>
        </Box>
    );
}

export default MainView;