import { useEffect } from 'react';
import { Box, List, ListItem } from '@mui/material';
import NavLink from './NavLink';

const MenuRail = ({ isRailOpen, onClose, isMed }) => {

    useEffect(() => {
        const handleOutsideClick = (e) => {
            const railElement = document.querySelector('.custom-menu-rail');
            if (isMed && railElement && !railElement.contains(e.target)) {
                onClose();
            } else if (!isMed && railElement && !railElement.contains(e.target)) {
                onClose();
            }
        };

        if (isRailOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isRailOpen, onClose ]);

    return (
        <Box
            className="custom-menu-rail"
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: isRailOpen ? '200px' : '0px',
                height: '100vh',
                backgroundColor: 'primary.main',
                overflowX: 'hidden',
                transition: '0.3s ease',
                zIndex: 1200,
            }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the rail from closing it
        >
            {isRailOpen && (
                <List>
                    <ListItem>
                        <NavLink to="/dogs/view">Dog Profile</NavLink>
                    </ListItem>
                    <ListItem>
                        <NavLink to="/health_records">Records</NavLink>
                    </ListItem>
                    <ListItem>
                        <NavLink to="/calendar">Calendar</NavLink>
                    </ListItem>
                    <ListItem>
                        <NavLink to="/map">Map</NavLink>
                    </ListItem>
                </List>
            )}
        </Box>
    );
};

export default MenuRail;