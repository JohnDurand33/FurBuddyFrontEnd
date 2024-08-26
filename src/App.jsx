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

const App = ({ isDark, setIsDark }) => {
    console.log("App component received isDark:", isDark);
    console.log("App component received setIsDark:", setIsDark);
    const toggleTheme = () => {
        console.log('Before toggle:', isDark);  // Log before toggle
        setIsDark(prevDark => !prevDark);
        console.log('After toggle:', !isDark);  // Log after toggle
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
                        <Route path="/dog" element={<DogProfileViewPage />} />
                        <Route path="/calendar" element={<MyCalendar />} />
                    </Routes>
                </Box>
            </AuthProvider>
        </Router>
    );
};

export default App;