import React, { useState, useEffect } from 'react';
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

const MenuRail = ({ isMobile , isOpen , toggleRail, isMin}) => {
    const theme = useTheme();
    const { authed, userID, setLocalUserId, getUserId, handleLogout } = useAuth();  // Get authentication status

    const [isPetsOpen, setIsPetsOpen] = useState(true);  // State for the pets dropdown
    const [dogProfiles, setDogProfiles] = useState([]);  // State for the dog profiles

    const togglePetsDropdown = () => setIsPetsOpen((prev) => !prev);  // Toggle the pets dropdown


    // Render nothing if the user is not authenticated
    if (!authed) {
        return null;
    }

    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            anchor="left"
            open={isOpen}
            PaperProps={{
                sx: {
                    width: isMin ? '64px' : '200px',  // Width based on state
                    transition: 'width 0.5s ease-in-out',
                    backgroundColor: "#H7CA57",
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
                    {!isMin && <ListItemText primary="FurBuddy" />}
                    <IconButton onClick={toggleRail} sx={{ marginLeft: 'auto' }}>
                        <Icon icon={isMin ? ChevronRightIcon : ChevronLeftIcon} />
                    </IconButton>
                </ListItemButton>

                {/* Navigation Links */}
                <ListItemButton sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={DashboardIcon} /></ListItemIcon>
                    {!isMin && <ListItemText primary="Dashboard" />}
                </ListItemButton>
                <ListItemButton sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={CalendarIcon} /></ListItemIcon>
                    {!isMin && <ListItemText primary="Calendar" />}
                </ListItemButton>
                <ListItemButton sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={RecordsIcon} /></ListItemIcon>
                    {!isMin && <ListItemText primary="Medical Records" />}
                </ListItemButton>
                <ListItemButton sx={{ marginBottom: '16px' }}>
                    <ListItemIcon><Icon icon={MapIcon} /></ListItemIcon>
                    {!isMin && <ListItemText primary="Map" />}
                </ListItemButton>

                <Divider sx={{ marginBottom: '16px' }} />

                {/* Pets Dropdown */}
                <ListItemButton onClick={togglePetsDropdown} sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={PetsIcon} /></ListItemIcon>
                    {!isMin && <ListItemText primary="Pets" />}
                    {!isMin && (
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
                        {!isMin && <ListItemText primary={dog.name} />}
                    </ListItemButton>
                ))}
                {isPetsOpen && (
                    <ListItemButton sx={{ marginBottom: '16px' }}>
                        <ListItemIcon><Icon icon={AddIcon} /></ListItemIcon>
                        {!isMin && <ListItemText primary="Add Dog" />}
                    </ListItemButton>
                )}

                <Divider sx={{ marginBottom: '16px' }} />

                {/* Settings & Logout */}
                <ListItemButton sx={{ marginBottom: '12px' }}>
                    <ListItemIcon><Icon icon={SettingsIcon} /></ListItemIcon>
                    {!isMin && <ListItemText primary="Settings" />}
                </ListItemButton>
                <ListItemButton sx={{ marginBottom: '16px' }} onClick={handleLogout}>
                    <ListItemIcon><Icon icon={LogoutIcon} /></ListItemIcon>
                    {!isMin && <ListItemText primary="Logout" />}
                </ListItemButton>

                <Divider sx={{ marginBottom: '16px' }} />

                {/* User Account */}
                <ListItemButton>
                    <ListItemIcon>
                        <Avatar src="/static/images/avatar/1.jpg" alt="User Avatar" />
                    </ListItemIcon>
                    {!isMin && user.owner_name && user.owner_email ? <ListItemText primary={user.owner_name} secondary={user.owner_email} /> : !isMin && user.owner_email ? <ListItemText primary={user.owner_email} /> : <ListItemText secondary={user.owner_email} />}
                </ListItemButton>
            </List>
        </Drawer>
    );
};

export default MenuRail;