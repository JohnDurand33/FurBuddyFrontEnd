import { useState, useMemo } from 'react'
import { AuthProvider } from './context/AuthContext'
import { lightTheme, darkTheme } from './utils/theme'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/NavBar'
import HeroPage from './pages/HeroPage'
import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import Dashboard from './pages/Dashboard'
import DogProfileCreate from './pages/DogProfileCreate'
import DogProfileViewPage from './pages/DogProfileViewPage'
import MyCalendar from './components/MyCalendar'


function App() {
    const [isDark, setIsDark] = useState(false)
    const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);
    
    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router >
                <AuthProvider>
                        <Navbar toggleTheme={toggleTheme} isDark={isDark} />
                    <Routes>
                        <Route path="/" element={<HeroPage />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<LogIn />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/dogs/new" element={<DogProfileCreate />} />
                        <Route path="/dog" element={<DogProfileViewPage />} />
                        <Route path="/calendar" element={<MyCalendar />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </ThemeProvider>
        
    );
}

export default App
