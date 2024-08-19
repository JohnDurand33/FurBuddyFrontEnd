import { useState } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { lightTheme, darkTheme } from './utils/theme'
import { Route, Routes, Router } from 'react-router-dom'

function App() {
    const [isDark, setIsDark] = useState(false)
    
    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HeroPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LogInPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App
