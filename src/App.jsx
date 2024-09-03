import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme } from './utils/theme';
import { AuthProvider } from './context/AuthContext';
import { RailStateProvider } from './context/RailStateContext';
import { BrowserRouter as Router } from 'react-router-dom';
import MainView from './pages/MainView';


function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [isDark, setIsDark] = useState(prefersDarkMode);
    const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);
    const [isRailOpen, setIsRailOpen] = useState(false);

    const toggleRail = () => {
        setIsRailOpen((prev) => !prev);
    }

    const toggleTheme = () => {
        setIsDark((prevDark) => !prevDark);
    };



    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <RailStateProvider>
                        <MainView toggleTheme={toggleTheme} toggleRail={toggleRail} isRaileOpen={isRailOpen} setIsRailOpen={setIsRailOpen}/>
                    </RailStateProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;