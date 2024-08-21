import { useState, useMemo } from 'react'
import { UserProvider} from './context/UserContext'
import { lightTheme, darkTheme } from './utils/theme'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Route, Routes, Options, BrowserRouter as Router } from 'react-router-dom'
import HeroPage from './pages/HeroPage'
import SignUp from './pages/SignUp'
import LogIn from './pages/Login'
import Dashboard from './pages/Dashboard'
import DogProfileCreate from './pages/DogProfileCreate
'
import Navbar from './components/NavBar'

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
                <Router >
                    <Navbar toggleTheme={toggleTheme} isDark={isDark} />
                    <Routes>
                        <Route path="/" element={<HeroPage />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<LogIn />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/dogs/new" element={<DogProfilePage />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </UserProvider>
    );
}

export default App
