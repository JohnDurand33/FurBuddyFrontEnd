import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItemIcon, ListItemText, IconButton, Divider, Avatar, ListItemButton } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Assuming you have this hook to manage auth state
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
import AddIcon from '@iconify-icons/mdi/plus-circle-outline';

const MenuRail = () => {
    const { user, handleLogout } = useAuth();
    const [isMinimized, setIsMinimized] = useState(false); // Default to expanded on desktop
    const [isPetsOpen, setIsPetsOpen] = useState(false);
    const [dogProfiles, setDogProfiles] = useState([]); // Dynamic list of dogs

    // Simulate fetching dog profiles from backend
    useEffect(() => {
        const fetchDogProfiles = async () => {
            // Replace with actual API call
            const dogs = [
                { id: 1, name: 'Irene', imagePath: null },
                { id: 2, name: 'Buddy', imagePath: '/static/images/dogs/buddy.jpg' }
            ];
            setDogProfiles(dogs);
        };

        fetchDogProfiles();
    }, []);

    const toggleRail = () => setIsMinimized(!isMinimized);
    const togglePetsDropdown = () => setIsPetsOpen(!isPetsOpen);

    // Check if user is logged in by checking for a populated id or email
    if (!user.id && !user.owner_email) {
        return null;
    }

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            open={!isMinimized}
            PaperProps={{
                sx: {
                    width: isMinimized ? '64px' : '18%',
                    transition: 'width 0.5s ease-in-out',
                    backgroundColor: (theme) => theme.palette.background.default,
                    color: (theme) => theme.palette.text.primary,
                    overflowX: 'hidden',
                },
            }}
        >
            <List sx={{ padding: '5% 0' }}>
                {/* Logo and Toggle Button */}
                <ListItemButton sx={{ marginBottom: '16px', justifyContent: 'center' }}>
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                        <Icon icon="mdi:paw" width="30" height="30" />
                    </ListItemIcon>
                    {!isMinimized && <ListItemText primary="FurBuddy" />}
                    <IconButton onClick={toggleRail} sx={{ marginLeft: 'auto' }}>
                        <Icon icon={isMinimized ? ChevronRightIcon : ChevronLeftIcon} />
                    </IconButton>
                </ListItemButton>

                {/* Navigation Links */}
                <ListItemButton sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={DashboardIcon} /></ListItemIcon>
                    {!isMinimized && <ListItemText primary="Dashboard" />}
                </ListItemButton>
                <ListItemButton sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={CalendarIcon} /></ListItemIcon>
                    {!isMinimized && <ListItemText primary="Calendar" />}
                </ListItemButton>
                <ListItemButton sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={RecordsIcon} /></ListItemIcon>
                    {!isMinimized && <ListItemText primary="Medical Records" />}
                </ListItemButton>
                <ListItemButton sx={{ marginBottom: '16px' }}>
                    <ListItemIcon><Icon icon={MapIcon} /></ListItemIcon>
                    {!isMinimized && <ListItemText primary="Map" />}
                </ListItemButton>

                <Divider sx={{ marginBottom: '16px' }} />

                {/* Pets Dropdown */}
                <ListItemButton onClick={togglePetsDropdown} sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={PetsIcon} /></ListItemIcon>
                    {!isMinimized && <ListItemText primary="Pets" />}
                    {!isMinimized && (
                        <IconButton sx={{ marginLeft: 'auto' }}>
                            <Icon icon={isPetsOpen ? ChevronLeftIcon : ChevronRightIcon} />
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
                        {!isMinimized && <ListItemText primary={dog.name} />}
                    </ListItemButton>
                ))}
                {isPetsOpen && (
                    <ListItemButton sx={{ marginBottom: '16px' }}>
                        <ListItemIcon><Icon icon={AddIcon} /></ListItemIcon>
                        {!isMinimized && <ListItemText primary="Add Dog" />}
                    </ListItemButton>
                )}

                <Divider sx={{ marginBottom: '16px' }} />

                {/* Settings & Logout */}
                <ListItemButton sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={SettingsIcon} /></ListItemIcon>
                    {!isMinimized && <ListItemText primary="Settings" />}
                </ListItemButton>
                <ListItemButton sx={{ marginBottom: '16px' }} onClick={handleLogout}>
                    <ListItemIcon><Icon icon={LogoutIcon} /></ListItemIcon>
                    {!isMinimized && <ListItemText primary="Logout" />}
                </ListItemButton>

                <Divider sx={{ marginBottom: '16px' }} />

                {/* User Account */}
                <ListItemButton>
                    <ListItemIcon>
                        <Avatar src="/static/images/avatar/1.jpg" alt="User Avatar" />
                    </ListItemIcon>
                    {!isMinimized && <ListItemText primary={user.owner_name || "Hannah"} secondary={user.owner_email || "Hannah123@gmail.com"} />}
                </ListItemButton>
            </List>
        </Drawer>
    );
};

export default MenuRail;