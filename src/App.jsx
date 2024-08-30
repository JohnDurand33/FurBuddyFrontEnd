import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Box, Drawer } from '@mui/material';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/NavBar';
import MenuRail from './components/MenuRail';
import HeroPage from './pages/HeroPage';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import Dashboard from './pages/Dashboard';
import DogProfileCreate from './pages/DogProfileCreate';
import DogProfileViewPage from './pages/DogProfileViewPage';
import MyCalendar from './components/MyCalendar';
import RecordsViewPage from './pages/RecordsViewPage';
import Map from './components/Map';
import { useMediaQuery } from '@mui/material';

const App = ({ isDark, setIsDark }) => {
    const isMed = useMediaQuery('(min-width:768px)');
    const [isRailOpen, setIsRailOpen] = useState(isMed);

    useEffect(() => {
        setIsRailOpen(isMed);
    }, [isMed]);

    const toggleTheme = () => {
        setIsDark((prevDark) => !prevDark);
    };

    const toggleRail = () => {
        setIsRailOpen((prevOpen) => !prevOpen);
    };

    return (
        <Router>
            <AuthProvider>
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'background.main',
                    }}
                >
                    <Navbar toggleTheme={toggleTheme} isMed={isMed} toggleRail={toggleRail} />
                    <MenuRail setIsRailOpen={setIsRailOpen} isOpen={isRailOpen} onClose={toggleRail} />
                    <Box sx={{ flexGrow: 1, paddingLeft: isMed && isRailOpen ? '200px' : '0px' }}>
                        <Routes>
                            <Route path="/" element={<HeroPage />} />
                            <Route path="/signup" element={<SignUp isDark={isDark} />} />
                            <Route path="/login" element={<LogIn isDark={isDark} />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/dogs/new" element={<DogProfileCreate />} />
                            <Route path="/dogs/view" element={<DogProfileViewPage />} />
                            <Route path="/health_records" element={<RecordsViewPage />} />
                            <Route path="/calendar" element={<MyCalendar />} />
                            <Route path="/map" element={<Map />} />
                        </Routes>
                    </Box>
                </Box>
            </AuthProvider>
        </Router>
    );
};

export default App;