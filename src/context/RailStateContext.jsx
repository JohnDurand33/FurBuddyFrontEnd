import React, { createContext, useState, useContext, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';

const RailStateContext = createContext();

export const RailStateProvider = ({ children }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        if (isMobile) {
            setIsMinimized(true);
        }
    }, [isMobile]);

    const toggleRail = () => setIsMinimized(!isMinimized);

    return (
        <RailStateContext.Provider value={{ isMinimized, toggleRail }}>
            {children}
        </RailStateContext.Provider>
    );
};

export const useRailState = () => useContext(RailStateContext);