import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, List, ListItemButton, Drawer } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { FaDog, FaFileAlt, FaCalendarAlt, FaMapMarkedAlt } from 'react-icons/fa';

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
                width : "15%",
                backgroundColor: 'primary.main',
                color: 'text.primary', // Adjust text color using theme
                }
            }}
        >
            <Box>
                <List>
                    <ListItemButton component={NavLink} to="/dogs/view">
                        <FaDog style={{ marginRight: '10px' }} />
                        Dog Profile
                    </ListItemButton>
                    <ListItemButton component={NavLink} to="/health_records">
                        <FaFileAlt style={{ marginRight: '10px' }} />
                        Records
                    </ListItemButton>
                    <ListItemButton component={NavLink} to="/calendar">
                        <FaCalendarAlt style={{ marginRight: '10px' }} />
                        Calendar
                    </ListItemButton>
                    <ListItemButton component={NavLink} to="/map">
                        <FaMapMarkedAlt style={{ marginRight: '10px' }} />
                        Map
                    </ListItemButton>
                </List>
            </Box>
        </Drawer>
    );
};

export default MenuRail;