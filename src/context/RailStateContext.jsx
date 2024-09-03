import React, { createContext, useState, useContext, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';

const RailStateContext = createContext();

export const RailStateProvider = ({ children }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [isMin, setIsMin] = useState(true); // Start minimized by default

    useEffect(() => {
        // Adjust the rail state based on screen size after authentication
        if (isMobile) {
            setIsMin(true); // Minimize on mobile
        } else {
            setIsMin(false); // Expand on larger screens
        }
    }, [isMobile]);

    const toggleRail = () => setIsMin((prev) => !prev);
    const closeRail = () => setIsMin(true);  // Close to minimized state

    return (
        <RailStateContext.Provider value={{ isMin, toggleRail, closeRail }}>
            {children}
        </RailStateContext.Provider>
    );
};

export const useRailState = () => useContext(RailStateContext);