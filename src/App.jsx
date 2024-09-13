import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme } from './utils/theme';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import MainView from './pages/MainView';
import { RecordsProvider } from './context/RecordsContext'; 
import { FilterProvider } from './context/FilterContext';


function App() {
       
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [isDark, setIsDark] = useState(prefersDarkMode);
    const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

    
    
    const toggleTheme = () => {
        setIsDark((prevDark) => !prevDark);
        };
        
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <RecordsProvider>
                        <FilterProvider>
                            <MainView toggleTheme={toggleTheme} isDark={isDark} />
                        </FilterProvider>
                    </RecordsProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;