import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme } from './utils/theme';
import { AuthProvider } from './context/AuthContext';
import { RailStateProvider } from './context/RailStateContext';
import { Box } from '@mui/material';
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

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [isDark, setIsDark] = useState(prefersDarkMode);
    const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);
    

    const toggleTheme = () => {
        setIsDark((prevDark) => !prevDark);
    };

    const toggleRail = () => {
        setIsRailOpen((prevOpen) => !prevOpen);
    };

    return (
        <Router>
        <ThemeProvider theme={theme}>
            <CssBaseline />
                <AuthProvider>
                    <RailStateProvider>
                    <MenuRail />
                    <Navbar toggleTheme={toggleTheme} toggleRail={toggleRail} />
                    <Box sx={{ flexGrow: 1 }}>
                        <Routes>
                            <Route path="/" element={<HeroPage />} />
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
                    </RailStateProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
};

export default App;