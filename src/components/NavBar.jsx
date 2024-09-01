import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleTheme, isDark, toggleRail }) => {
    const { isAuthenticated, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);  // For the account menu
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);  // For the hamburger menu

    // Handle account menu open/close
    const handleAccountMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAccountMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleAccountMenuClose();
    };

    // Handle hamburger menu open/close
    const handleServiceMenuOpen = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleServiceMenuClose = () => {
        setMenuAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'primary.main', maxHeight: '8vh', width: '100%' }}>
            <Toolbar>
                <Grid container alignItems="center">
                    {/* Left Section */}
                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleServiceMenuOpen}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={menuAnchorEl}
                            open={Boolean(menuAnchorEl)}
                            onClose={handleServiceMenuClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        >
                            <MenuItem onClick={handleServiceMenuClose} component={NavLink} to="/dogs/view">Dog Profile</MenuItem>
                            <MenuItem onClick={handleServiceMenuClose} component={NavLink} to="/health_records">Records</MenuItem>
                            <MenuItem onClick={handleServiceMenuClose} component={NavLink} to="/calendar">Calendar</MenuItem>
                            <MenuItem onClick={handleServiceMenuClose} component={NavLink} to="/map">Map</MenuItem>
                        </Menu>
                    </Grid>

                    {/* Center Section */}
                    <Grid item xs={4} container justifyContent="center">
                        <Typography variant="h6" sx={{ mx: 'auto' }}>
                            Brand Logo
                        </Typography>
                    </Grid>

                    {/* Right Section */}
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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

                        {/* Account Menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleAccountMenuClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            {isAuthenticated ? (
                                <div>
                                    <MenuItem component={NavLink} to="/account" style={{ color: 'text.primary' }}>
                                        Account Settings
                                    </MenuItem>
                                    <MenuItem component={NavLink} onClick={handleLogout} style={{ color: 'text.primary' }}>
                                        Logout
                                    </MenuItem>
                                </div>
                            ) : (
                                <div>
                                        <MenuItem
                                            component={NavLink}
                                            to="/login"
                                            style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Log In
                                    </MenuItem>
                                    <MenuItem component={NavLink} to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Sign Up
                                    </MenuItem>
                                </div>
                            )}
                        </Menu>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;