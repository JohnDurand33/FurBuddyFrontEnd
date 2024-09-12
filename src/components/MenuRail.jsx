import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItemIcon, ListItemText, IconButton, Divider, Avatar, ListItemButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';  // Import Auth context
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
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const MenuRail = ({ isMobile, isRailOpen, toggleRail, isCollapsed, toggleCollapse }) => {
    const navigate = useNavigate();
    const { authed, token, currUser, currDog, handleLogout, dogProfiles, fetchDogProfilesFromApi, setLocalCurrDog, setLocalDogProfiles } = useAuth();  // Get auth and state functions
    const theme = useTheme();
    const [isPetsOpen, setIsPetsOpen] = useState(false);
    const [loading, setLoading] = useState(true);  // State for managing loading

    const togglePetsDropdown = () => setIsPetsOpen((prev) => !prev);

    const getDrawerWidth = () => {
        if (!authed || !isRailOpen) {
            return '0px';
        } else if (isMobile) {
            return '64px';
        } else {
            return isCollapsed ? '64px' : '240px';
        }
    };

    // Fetch dog profiles after login
    useEffect(() => {
        const fetchData = async () => {
            if (authed && token) {
                try {
                    const profiles = await fetchDogProfilesFromApi(token); // Fetch the dog profiles after login
                    if (profiles && profiles.length > 0) {
                        const validProfiles = Array.isArray(profiles) ? profiles : [profiles];
                        setLocalDogProfiles(validProfiles);
                        const isCurrDogInDogProfiles = validProfiles.some((dog) => dog.id === currDog.id);
                        // If currDog is not in profiles, set the first dog in profiles as currDog
                        if (!isCurrDogInDogProfiles) {
                            setLocalCurrDog(validProfiles[0]); // Set the first dog in the list as currDog
                            console.log('Setting first dog in profiles as currDog:', validProfiles[0]);
                        }
                        console.log('didn\'t delete currDog:', currDog);
                    }
                } catch (error) {
                    console.error('Error fetching profiles:', error);
                    // Handle error
                }
            }
        };
        fetchData();
    }, [authed, token]);

    const handledogProfileLog = () => {
        console.log('dogProfiles:', dogProfiles);
    };

    const handleCurrDogChange = (dog) => () => {
        setLocalCurrDog(dog);
        navigate('/dogs/view');
    };

    const handleAddDog = () => {
        navigate('/dogs/new');
    };

    return (
        <Drawer
            variant='permanent'  // Use 'temporary' for mobile, 'permanent' otherwise
            anchor="left"
            open={authed}  // Control open state based on authed and isRailOpen
            onClose={toggleRail}  // Handle closing on mobile when clicking outside
            ModalProps={{
                keepMounted: true,  // Keep the Drawer mounted when closed
                disableBackdropClick: false,  // Ensure tapping outside will close the Drawer
            }}
            sx={{
                width: getDrawerWidth(),
                transition: 'width 0.3s ease-in-out',
                color: theme.palette.text.primary,
                backgroundColor: "primary.main" + " !important",
                boxSizing: 'border-box',
                '& .MuiDrawer-paper': {
                    backgroundColor: `${theme.palette.primary.main} !important`,
                    width: getDrawerWidth(),
                    transition: 'width 0.3s ease-in-out',
                    boxSizing: 'border-box',  // Ensure padding/border are included in the width
                },
            }}
        >
                <List>
                    {/* Logo and Toggle Button */}
                    <ListItemButton sx={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                        <ListItemIcon sx={{ minWidth: 'auto' }}>
                            <Icon icon="mdi:paw" width="30" height="30" />
                        </ListItemIcon>
                        {!isMobile && <IconButton onClick={toggleCollapse} sx={{ marginLeft: 'auto' }}>
                            <Icon icon={!isCollapsed ? ChevronLeftIcon : ChevronRightIcon} />
                        </IconButton>}
                    </ListItemButton>

                    <Divider sx={{ marginBottom: '16px' }} />

                    {/* Navigation Links */}
                    <ListItemButton sx={{ marginBottom: '12px' }}>
                        <ListItemIcon><Icon icon={DashboardIcon} onClick={handledogProfileLog}/></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Dashboard" />}
                    </ListItemButton>
                    <ListItemButton sx={{ marginBottom: '12px' }}>
                        <ListItemIcon><Icon icon={CalendarIcon} /></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Calendar" />}
                    </ListItemButton>
                    <ListItemButton sx={{ marginBottom: '12px' }}>
                        <ListItemIcon><Icon icon={RecordsIcon} /></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Medical Records" />}
                    </ListItemButton>
                    <ListItemButton sx={{ marginBottom: '16px' }}>
                        <ListItemIcon><Icon icon={MapIcon} /></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Map" />}
                    </ListItemButton>

                    <Divider sx={{ marginBottom: '16px' }} />

                    {/* Pets Dropdown */}
                    <ListItemButton onClick={togglePetsDropdown} sx={{ marginBottom: '12px' }}>
                        <ListItemIcon><Icon icon={PetsIcon} /></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Pets" />}
                        <IconButton sx={{ marginLeft: 'auto' }}>
                            <Icon icon={isPetsOpen ? ChevronUpIcon : ChevronDownIcon} />
                        </IconButton>
                    </ListItemButton>
                        {isPetsOpen && dogProfiles && dogProfiles.length > 0 && (
                            console.log('Rendering dog profiles', dogProfiles),
                            dogProfiles.map(dog => (
                                <ListItemButton
                                    onClick={handleCurrDogChange(dog)}
                                    key={dog.id}
                                    sx={{
                                        marginBottom: '12px',
                                        '&:hover': {
                                            backgroundColor: theme.palette.secondary.main,
                                            color: '#fff',
                                        },
                                    }}
                                >
                                <ListItemIcon sx={{ textAlign: isMobile ? 'center' : 'start' }}>
                                    {dog.image_path ? <Avatar src={dog.image_path} /> : <Avatar>{dog.name[0]}</Avatar>}
                                </ListItemIcon>
                                {!isMobile && !isCollapsed && <ListItemText primary={dog.name} />}
                            </ListItemButton>
                    )))}
                    {isPetsOpen && (
                    <ListItemButton sx={{ marginBottom: '16px', textAlign: isMobile ? 'center' : 'start' }} onClick={handleAddDog}>
                            <ListItemIcon><Icon icon={AddIcon} /></ListItemIcon>
                            {!isMobile && !isCollapsed && <ListItemText primary="Add Dog" />}
                        </ListItemButton>
                    )}

                    <Divider sx={{ marginBottom: '16px' }} />

                    {/* Settings & Logout */}
                    <ListItemButton sx={{ marginBottom: '12px' }}>
                        <ListItemIcon><Icon icon={SettingsIcon} /></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Settings" />}
                    </ListItemButton>
                    <ListItemButton sx={{ marginBottom: '16px' }} onClick={handleLogout}>
                        <ListItemIcon><Icon icon={LogoutIcon} /></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Logout" />}
                    </ListItemButton>

                    <Divider sx={{ marginBottom: '16px' }} />

                    {/* User Account */}
                    <ListItemButton>
                        <ListItemIcon>
                        <Avatar src="/static/images/avatar/1.jpg" alt={currUser ? currUser.owner_email : "User Avatar"} />
                        </ListItemIcon>
                        {!isMobile && currUser && currUser.owner_email && (
                            <ListItemText primary={currUser.owner_email} />
                        )}
                    </ListItemButton>
                </List>
        </Drawer>
    );
};

export default MenuRail;