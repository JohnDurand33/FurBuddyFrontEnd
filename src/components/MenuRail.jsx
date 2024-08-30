import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, List, ListItemButton, Drawer } from '@mui/material';
import { useMediaQuery } from '@mui/material';


const MenuRail = ({ isOpen, onClose, setIsRailOpen }) => {
    const isMed = useMediaQuery('(min-width:768px)');
    useEffect(() => {
        setIsRailOpen(isMed);
    }, [isMed]);
    return (
        <Drawer
            anchor="left"
            open={isOpen}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '200px',
                    backgroundColor: 'primary.main',
                    color: 'white', // Adjust text color if needed
                }
            }}
        >
            <Box>
            <List>
                <ListItemButton component={NavLink} to="/dogs/view">
                    Dog Profile
                    </ListItemButton>
                <ListItemButton component={NavLink} to="/health_records">
                    Records
                </ListItemButton>
                <ListItemButton component={NavLink} to="/calendar">
                    Calendar
                </ListItemButton>
                <ListItemButton component={NavLink} to="/map">
                    Map
                </ListItemButton>
                </List>
            </Box>
        </Drawer>
    );
};

export default MenuRail;