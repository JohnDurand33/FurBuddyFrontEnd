import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItemIcon, ListItemText, IconButton, Divider, Avatar, ListItemButton, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';  // Import Auth context
import { Icon } from '@iconify/react';
import defaultashboardIcon from '@iconify/icons-mdi/view-dashboard-outline';
import calendarIcon from '@iconify/icons-mdi/calendar-outline';
import recordsIcon from '@iconify/icons-mdi/clipboard-outline';
import mapIcon from '@iconify/icons-mdi/map-outline';
import petsIcon from '@iconify/icons-mdi/paw-outline';
import settingsIcon from '@iconify/icons-mdi/cog-outline';
import logoutIcon from '@iconify/icons-mdi/logout';
import addIcon from '@iconify/icons-mdi/plus-circle-outline';
import chevronsRightIcon from '@iconify-icons/mdi/chevron-double-right';
import chevronsLeftIcon from '@iconify-icons/mdi/chevron-double-left';
import chevronUpIcon from '@iconify-icons/mdi/chevron-up';
import chevronDownIcon from '@iconify-icons/mdi/chevron-down';
import pawIcon from '@iconify-icons/mdi/paw';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ImGift } from 'react-icons/im';

const MenuRail = ({ isMobile, isRailOpen, toggleRail, isCollapsed, toggleCollapse }) => {
    const navigate = useNavigate();
    const { authed, token, currUser, currDog, handleLogout, dogProfiles, fetchCurrDogProfiles, setLocalCurrDog, setLocalDogProfiles } = useAuth();  // Get auth and state functions
    const theme = useTheme();
    const [isPetsOpen, setIsPetsOpen] = useState(true);
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
            if (authed && token && currUser) {
                try {
                    let profiles = await fetchCurrDogProfiles(token); // Fetch the dog profiles after login
                    if (profiles && profiles.length > 0) {
                        if (!Array.isArray(profiles)) {
                            setLocalCurrDog(profiles);  
                            profiles = [profiles];
                            setLocalDogProfiles(profiles); 
                        } else {
                            setLocalCurrDog(profiles[0]); 
                            setLocalDogProfiles(profiles); 
                        }
                        
                    } else {
                        console.log('didn\'t have any dogs -> response from fetchDogProfilesFromApi:', profiles);
                    }
                } catch (error) {
                    console.error('Error fetching profiles:', error);
                }
            }
        };
        fetchData();
    }, [authed, token, currUser]);

    const handledogProfileLog = () => {
        console.log('dogProfiles:', dogProfiles);
    };

    const handleCurrDogChange = (dog) => {
        setLocalCurrDog(dog);
    };

    const handleAddDog = () => {
        navigate('/dogs/new');
    };

    const handleNavigateTo = (path) => () => {
        navigate(path);
    }

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
                <ListItemButton sx={{ marginBottom: '16px' }}>
                    
                    {/* Conditionally Render Based on isMobile and isCollapsed */}
                    <ListItemIcon sx={{ minWidth: 'auto', mr: -.5, mb: -2 }}>
                        {!isMobile && !isCollapsed ? (
                            <img src="https://res.cloudinary.com/dkeozpkpv/image/upload/v1725361244/PawHub_fvafym.png" alt="Logo" />
                        ) : isMobile ? (
                                <Icon icon="mdi:pawicon" width="30" height="30" />
                        ) : null}
                    </ListItemIcon>

                    {/* Chevron Icons only show when not mobile */}
                    {!isMobile && (
                        <IconButton onClick={toggleCollapse} sx={{ marginLeft: isCollapsed ? -1 : .5, mb: -2 }}>
                            <Paper
                                elevation={3} // Give it a slight shadow for a paper-like feel
                                sx={{
                                    width: '40px', height: '40px',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    backgroundColor: '#f5f5f5', // Paper-like color
                                    borderRadius: '8px',
                                }}
                            >
                                <Icon
                                    icon={!isCollapsed ? chevronsLeftIcon : chevronsRightIcon}
                                    width="24"
                                    height="24"
                                    style={{ color: 'gray' }} // Keep chevron arrow grey
                                />
                            </Paper>
                        </IconButton>
                    )}
                </ListItemButton>


                    <Divider sx={{ marginBottom: '16px' }} />

                    {/* Navigation Links */}
                    <ListItemButton sx={{ marginBottom: '12px', ml:.5 }}>
                        <ListItemIcon><Icon icon={defaultashboardIcon} onClick={handledogProfileLog}/></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Dashboard" />}
                    </ListItemButton>
                <ListItemButton sx={{ marginBottom: '12px', ml: .5 }}>
                    <ListItemIcon><Icon icon={calendarIcon} /></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Calendar" />}
                    </ListItemButton>
                <ListItemButton sx={{ marginBottom: '12px', ml: .5 }} onClick={handleNavigateTo('/records')}>
                        <ListItemIcon><Icon icon={recordsIcon} /></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Medical Records" />}
                    </ListItemButton>
                <ListItemButton sx={{ marginBottom: '16px', ml: .5 }}>
                        <ListItemIcon><Icon icon={mapIcon} /></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Map" />}
                    </ListItemButton>

                <Divider sx={{ marginBottom: '16px' }} />

                    {/* Pets Dropdown */}
                <ListItemButton onClick={togglePetsDropdown} sx={{ marginBottom: '12px', ml: .5 }}>
                        <ListItemIcon><Icon icon={petsIcon} /></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Pets" />}
                        <IconButton sx={{ marginLeft: 'auto' }}>
                            <Icon icon={isPetsOpen ? chevronUpIcon : chevronDownIcon} />
                        </IconButton>
                    </ListItemButton>
                        {isPetsOpen && dogProfiles && dogProfiles.length > 0 && (
                            console.log('Rendering dog profiles', dogProfiles),
                            dogProfiles.map(dog => (
                                <ListItemButton
                                    onClick={() => handleCurrDogChange(dog)}
                                    key={dog.id}
                                    sx={{
                                        marginBottom: '12px',
                                        ml: -.5,
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
                    <ListItemButton sx={{ ml: .5, marginBottom: '16px', textAlign: isMobile ? 'center' : 'start' }} onClick={handleAddDog}>
                            <ListItemIcon><Icon icon={addIcon} /></ListItemIcon>
                            {!isMobile && !isCollapsed && <ListItemText primary="Add Dog" />}
                        </ListItemButton>
                    )}

                    <Divider sx={{ marginBottom: '16px' }} />

                    {/* Settings & Logout */}
                <ListItemButton sx={{ marginBottom: '12px', ml: .5 }}>
                        <ListItemIcon><Icon icon={settingsIcon} /></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Settings" />}
                    </ListItemButton>
                <ListItemButton sx={{ marginBottom: '16px', ml: .5 }} onClick={handleLogout}>
                        <ListItemIcon><Icon icon={logoutIcon} /></ListItemIcon>
                        {!isMobile && !isCollapsed && <ListItemText primary="Logout" />}
                    </ListItemButton>

                    <Divider sx={{ marginBottom: '16px' }} />

                    {/* User Account */}
                <ListItemButton >
                    <ListItemIcon >
                        <Avatar sx={{ ml: -.5 }} src="/static/images/avatar/1.jpg" alt={currUser ? currUser.owner_email : "User Avatar"}  />
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