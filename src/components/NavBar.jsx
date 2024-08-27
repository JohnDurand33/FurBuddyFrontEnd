import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NavLink from './NavLink';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const Navbar = ({ toggleTheme, isDark }) => {
    const { isAuthenticated, logout } = useAuth(); // Access auth state and logout function
    const [anchorEl, setAnchorEl] = useState(null);
    const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAccountMenuOpen = (event) => {
        setAccountMenuAnchorEl(event.currentTarget);
    };

    const handleAccountMenuClose = () => {
        setAccountMenuAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleAccountMenuClose();
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'primary.main', width: '100%' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Hamburger Icon for Mobile Menu */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    width: '25vw',
                                    backgroundColor: 'secondary.main', // Adjust the background color here
                                    color: 'text.primary', // Adjust the text color here
                                },
                            },
                            disableScrollLock: true,
                        }}
                    >
                        <MenuItem onClick={handleMenuClose}>
                            <NavLink to="/dogs/view">Dog Profile</NavLink>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <NavLink to="/health_records">Records</NavLink>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <NavLink to="/calendar">Calendar</NavLink>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <NavLink to="/map">Map</NavLink>
                        </MenuItem>
                    </Menu>
                </Box>

                {/* Brand Logo Centered */}
                <Typography variant="h6" sx={{ mx: 'auto' }}>
                    <NavLink to="/">Brand Logo</NavLink>
                </Typography>

                {/* Account Settings and Theme Toggle */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                        {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="account"
                        onClick={handleAccountMenuOpen}
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={accountMenuAnchorEl}
                        open={Boolean(accountMenuAnchorEl)}
                        onClose={handleAccountMenuClose}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    width: '25vw',
                                    backgroundColor: 'secondary.main', // Adjust the background color here
                                    color: 'text.opposite', // Adjust the text color here
                                },
                            }
                        }}
                    >
                        {isAuthenticated ? (
                            <>
                                <MenuItem onClick={handleAccountMenuClose}>
                                    <NavLink to="/account/settings">Account Settings</NavLink>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    Logout
                                </MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem onClick={handleAccountMenuClose}>
                                    <NavLink to="/login">Log In</NavLink>
                                </MenuItem>
                                <MenuItem onClick={handleAccountMenuClose}>
                                    <NavLink to="/signup">Sign Up</NavLink>
                                </MenuItem>
                            </>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;