import React, { useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import { lightTheme, darkTheme, applyTheme } from './utils/theme';
import './global.css';

function Root() {
    const [isDark, setIsDark] = React.useState(false);
    const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <React.StrictMode>
                <App isDark={isDark} setIsDark={setIsDark} />
            </React.StrictMode>
        </ThemeProvider>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);

// Render the Root component
root.render(<Root />);