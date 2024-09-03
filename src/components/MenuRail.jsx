import React, { useState, useEffect, useRef } from 'react';
import { Drawer, List, ListItemIcon, ListItemText, IconButton, Divider, Avatar, ListItemButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Icon } from '@iconify/react';
import DashboardIcon from '@iconify-icons/mdi/view-dashboard-outline';
import CalendarIcon from '@iconify-icons/mdi/calendar-outline';
import RecordsIcon from '@iconify-icons/mdi/clipboard-outline';
import MapIcon from '@iconify-icons/mdi/map-outline';
import PetsIcon from '@iconify-icons/mdi/paw-outline';
import SettingsIcon from '@iconify-icons/mdi/cog-outline';
import LogoutIcon from '@iconify-icons/mdi/logout';
import ChevronRightIcon from '@iconify-icons/mdi/chevron-right';
import ChevronLeftIcon from '@iconify-icons/mdi/chevron-left';
import ChevronUpIcon from '@iconify-icons/mdi/chevron-up';
import ChevronDownIcon from '@iconify-icons/mdi/chevron-down';
import AddIcon from '@iconify-icons/mdi/plus-circle-outline';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const MenuRail = ({ isMobile, isOpen, toggleRail }) => {
    const drawerRef = useRef(null);
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);    
    const { authed, user, userID, setLocalUserId, getUserId, handleLogout } = useAuth();  // Get authentication status
    const [isPetsOpen, setIsPetsOpen] = useState(true);  // State for the pets dropdown
    const [dogProfiles, setDogProfiles] = useState([]);  // State for the dog profiles

    const togglePetsDropdown = () => setIsPetsOpen((prev) => !prev);  // Toggle the pets dropdown


    // Render nothing if the user is not authenticated
    if (!authed) {
        return null;
    }

    useEffect(() => {
        // Function to handle click events
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                toggleRail(); // Close the drawer if click is outside
            }
        };

        // Add the event listener if the drawer is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup the event listener when component unmounts or when isOpen changes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!authed) return null;

    return (
        <Drawer
            ref={drawerRef}
            variant={isMobile ? 'temporary' : 'permanent'}
            anchor="left"
            open={isOpen}
            onClose={toggleRail}
            PaperProps={{
                sx: {
                    width: isMobile && isExpanded ? '64px' : isExpanded ? '200px' : 0,  // Width based on state
                    transition: 'width 0.5s ease-in-out',
                    backgroundColor: "#H7CA57",
                    color: (theme) => theme.palette.text.primary,
                    // overflowX: 'hidden',
                },
            }}
        >
            <List sx={{ padding: '5% 0' }}>
                {/* Logo and Toggle Button */}
                <ListItemButton sx={{ marginBottom: '16px', justifyContent: 'center' }}>
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                        <Icon icon="mdi:paw" width="30" height="30" />
                    </ListItemIcon>
                    {!isMobile && <ListItemText primary="FurBuddy" />}
                    <IconButton onClick={toggleRail} sx={{ marginLeft: 'auto' }}>
                        <Icon icon={isMobile ? ChevronRightIcon : ChevronLeftIcon} />
                    </IconButton>
                </ListItemButton>

                {/* Navigation Links */}
                <ListItemButton sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={DashboardIcon} /></ListItemIcon>
                    {!isMobile && <ListItemText primary="Dashboard" />}
                </ListItemButton>
                <ListItemButton sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={CalendarIcon} /></ListItemIcon>
                    {!isMobile && <ListItemText primary="Calendar" />}
                </ListItemButton>
                <ListItemButton sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={RecordsIcon} /></ListItemIcon>
                    {!isMobile && <ListItemText primary="Medical Records" />}
                </ListItemButton>
                <ListItemButton sx={{ marginBottom: '16px' }}>
                    <ListItemIcon><Icon icon={MapIcon} /></ListItemIcon>
                    {!isMobile && <ListItemText primary="Map" />}
                </ListItemButton>

                <Divider sx={{ marginBottom: '16px' }} />

                {/* Pets Dropdown */}
                <ListItemButton onClick={togglePetsDropdown} sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={PetsIcon} /></ListItemIcon>
                    {!isMobile && <ListItemText primary="Pets" />}
                    {!isMobile && (
                        <IconButton sx={{ marginLeft: 'auto' }}>
                            <Icon icon={isPetsOpen ? ChevronUpIcon : ChevronDownIcon} />
                        </IconButton>
                    )}
                </ListItemButton>
                {isPetsOpen && dogProfiles.map(dog => (
                    <ListItemButton
                        key={dog.id}
                        sx={{
                            marginBottom: '12px',
                            '&:hover': {
                                backgroundColor: (theme) => theme.palette.secondary.main,
                                color: '#fff',
                            },
                        }}
                    >
                        <ListItemIcon>
                            {dog.imagePath ? <Avatar src={dog.imagePath} /> : <Avatar>{dog.name[0]}</Avatar>}
                        </ListItemIcon>
                        {!isMobile && <ListItemText primary={dog.name} />}
                    </ListItemButton>
                ))}
                {isPetsOpen && (
                    <ListItemButton sx={{ marginBottom: '16px' }}>
                        <ListItemIcon><Icon icon={AddIcon} /></ListItemIcon>
                        {!isMobile && <ListItemText primary="Add Dog" />}
                    </ListItemButton>
                )}

                <Divider sx={{ marginBottom: '16px' }} />

                {/* Settings & Logout */}
                <ListItemButton sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={SettingsIcon} /></ListItemIcon>
                    {!isMobile && <ListItemText primary="Settings" />}
                </ListItemButton>
                <ListItemButton sx={{ marginBottom: '16px' }} onClick={handleLogout}>
                    <ListItemIcon><Icon icon={LogoutIcon} /></ListItemIcon>
                    {!isMobile && <ListItemText primary="Logout" />}
                </ListItemButton>

                <Divider sx={{ marginBottom: '16px' }} />

                {/* User Account */}
                <ListItemButton>
                    <ListItemIcon>
                        <Avatar src="/static/images/avatar/1.jpg" alt="User Avatar" />
                    </ListItemIcon>
                    {!isMobile && user.owner_name && user.owner_email ? <ListItemText primary={user.owner_name} secondary={user.owner_email} /> : !isMobile && user.owner_email ? <ListItemText primary={user.owner_email} /> : <ListItemText secondary={user.owner_email} />}
                </ListItemButton>
            </List>
        </Drawer>
    );
};

export default MenuRail;