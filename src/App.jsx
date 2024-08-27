import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Box } from '@mui/material';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/NavBar';
import HeroPage from './pages/HeroPage';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import Dashboard from './pages/Dashboard';
import DogProfileCreate from './pages/DogProfileCreate';
import DogProfileViewPage from './pages/DogProfileViewPage';
import MyCalendar from './components/MyCalendar';
import RecordsViewPage from './pages/RecordsViewPage';
import Map from './components/NavBar';

const App = ({ isDark, setIsDark }) => {

    const toggleTheme = () => {
        setIsDark(prevDark => !prevDark);
    };

    return (
        <Router>
            <AuthProvider>
                <Navbar toggleTheme={toggleTheme} isDark={isDark} />
                <Box sx={{ backgroundColor: 'secondary.main', color: 'text.opposite', minHeight: '100vh', p: 3 }}>
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
            </AuthProvider>
        </Router>
    );
};

export default App;