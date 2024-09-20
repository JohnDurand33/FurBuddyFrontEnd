import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Box, Grid, IconButton, Menu, MenuItem, Button, Typography, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@emotion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react'; // For Iconify icons

const Navbar = ({ toggleRail, isMobile }) => {
    const { logout, authed, setAuthed, clearAllStateAndLocalStorage, currDog } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);  // For the combined Home/Account dropdown menu

    // Handle opening/closing of the combined dropdown
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        clearAllStateAndLocalStorage();
        setAuthed(false);
        logout();
        navigate('/login');
    };
    const currentPath = window.location.pathname.split('/')[1];
    const getDisplayText = (currDog, path) => {
        let currentPath = path.split('/')[1];
        console.log(currentPath);

        

        switch (true) {
            case currentPath === 'dogs' :
                return { text: isMobile ? 'Dogs' : 'My Dogs', ml: isMobile ? 2 : 7 };
            case currentPath === 'records':
                return {
                    text: isMobile ? 'Recs' : 'Medical Records', ml: 2
                };
            case currentPath === 'calendar':
                return {
                    text: isMobile ? 'Cal' : 'Calendar', ml: 2
                };
            case currentPath === 'map':
                return { text: 'Map', ml: 2
                };
            case currentPath === ('' || 'login' || 'signup'):
                return {text: '', ml: 0 };
            default:
                return { text: '', ml: 0 };
        }
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: 'background.default',
                maxHeight: '8vh',
                width: '100%',
                boxShadow: 'none',
                borderBottom: authed ? '1px solid grey' : null,
            }}
        >
            <Toolbar>
                <Grid container alignItems="center" justifyContent="space-between">
                    {/* Left Section: Logo or Dog Name */}
                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                        {authed ? (
                            <Typography fontSize='2rem' color="grey" sx={{ ml: getDisplayText(currDog, window.location.pathname)['ml'] }}>
                                {getDisplayText(currDog, window.location.pathname)['text']}
                            </Typography>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    src="https://res.cloudinary.com/dkeozpkpv/image/upload/v1725361244/PawHub_fvafym.png"
                                    alt="Logo"
                                    style={{ maxHeight: '5vh', marginLeft: isMobile ? '0' : '10px' }}
                                />
                            </Box>
                        )}
                    </Grid>

                    {/* Right Section */}
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {isMobile ? (
                            <>
                                <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                                    <MenuIcon />
                                </IconButton>
                            </>
                        ) : authed ? (
                            <>
                                <IconButton>
                                    <Icon icon="mdi:magnify" width="24" height="24" />
                                </IconButton>
                                <IconButton>
                                    <Icon icon="mdi:bell-outline" width="24" height="24" />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Button
                                    component={NavLink}
                                    to="/login"
                                    sx={{ ml: 1, color: theme.palette.text.primary }}
                                >
                                    Log In
                                </Button>
                                <Button
                                    component={NavLink}
                                    to="/signup"
                                    sx={{
                                        ml: 1,
                                        color: theme.palette.secondary.main,
                                        backgroundColor: theme.palette.primary.main,
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Toolbar>

            {/* Combined Home and Account Menu for Mobile */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {/* Home Items */}
                <MenuItem onClick={handleMenuClose}>
                    <NavLink to="/" style={{ color: theme.palette.text.primary }}>
                        Home
                    </NavLink>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <NavLink to="/about" style={{ color: theme.palette.text.primary }}>
                        About
                    </NavLink>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <NavLink to="/how-it-works" style={{ color: theme.palette.text.primary }}>
                        How It Works
                    </NavLink>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <NavLink to="/blog" style={{ color: theme.palette.text.primary }}>
                        Blog
                    </NavLink>
                </MenuItem>

                {/* Divider between Home and Account sections */}
                <Divider />

                {/* Conditionally render Account items based on authed status */}
                {authed ? (
                    [
                        <MenuItem key="account-settings" onClick={handleMenuClose}>
                            <NavLink to="/account" style={{ color: theme.palette.text.primary }}>
                                Account Settings
                            </NavLink>
                        </MenuItem>,
                        <MenuItem key="logout" onClick={handleLogout}>
                            Logout
                        </MenuItem>
                    ]
                ) : (
                    [
                        <MenuItem key="login" onClick={handleMenuClose}>
                            <NavLink to="/login" style={{ color: theme.palette.text.primary }}>
                                Log In
                            </NavLink>
                        </MenuItem>,
                        <MenuItem key="signup" onClick={handleMenuClose}>
                            <NavLink to="/signup" style={{ color: theme.palette.secondary.main }}>
                                Sign Up
                            </NavLink>
                        </MenuItem>
                    ]
                )}
            </Menu>
        </AppBar>
    );
};

export default Navbar;