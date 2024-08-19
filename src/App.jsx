import { useState, useMemo } from 'react'
import { UserProvider} from './context/UserContext'
import { lightTheme, darkTheme } from './utils/theme'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import HeroPage from './pages/HeroPage'
import SignUpPage from './pages/SignUpPage'
import LogInPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'

function App() {
    const [isDark, setIsDark] = useState(false)
    const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);
    
    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <UserProvider>
            <ThemeProvider theme={theme}>
            <CssBaseline />
                <Router>
                    <Routes>
                        <Route path="/" element={<HeroPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/login" element={<LogInPage />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </UserProvider>
    );
}

export default App
