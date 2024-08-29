import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context/AuthContext';
import { useMediaQuery } from '@mui/material';
import NavLink from './NavLink';

const Navbar = ({ toggleTheme, isDark, isMed, toggleRail }) => {
    const { isAuthenticated, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);  // For the account menu
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);  // For the hamburger menu

    // Handle account menu open/close
    const handleAccountMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        logout();
        handleAccountMenuClose();
    };

    // Handle hamburger menu open/close
    const handlAccountMenuOpen = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleAccountMenuClose = () => {
        setMenuAnchorEl(null);
    };
    

    return (
        <AppBar position="static" sx={{ backgroundColor: 'primary.main', maxHeight: '8vh', width: '100%' }}>
            <Toolbar>
                <Grid container alignItems="center">
                    {/* Left Section */}
                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                        {!isMed ? (
                            <>
                                <IconButton edge="start" color="inherit" aria-label="menu" >
                                    <MenuIcon onClick={toggleRail} />
                                </IconButton>
                                <Menu
                                    anchorEl={menuAnchorEl}
                                    open={Boolean(menuAnchorEl)}
                                    onClose={handleAccountMenuClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                >
                                    <MenuItem onClick={handleAccountMenuClose}>
                                        <NavLink to="/dogs/view">Dog Profile</NavLink>
                                    </MenuItem>
                                    <MenuItem onClick={handleAccountMenuClose}>
                                        <NavLink to="/health_records">Records</NavLink>
                                    </MenuItem>
                                    <MenuItem onClick={handleAccountMenuClose}>
                                        <NavLink to="/calendar">Calendar</NavLink>
                                    </MenuItem>
                                    <MenuItem onClick={handleAccountMenuClose}>
                                        <NavLink to="/map">Map</NavLink>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                                <IconButton edge="start" color="inherit" aria-label="toggle-rail" onClick={toggleRail}>
                                    {<MenuIcon onClick={toggleRail} />}
                            </IconButton>
                        )}
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
                                    <MenuItem >
                                        <NavLink to="/account" style={{ textDecoration: 'none', color: 'inherit' }}>
                                            Account Settings
                                        </NavLink>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        Logout
                                    </MenuItem>
                                </div>
                            ) : (
                                    <div>
                                    <MenuItem >
                                        <NavLink to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                                            Log In
                                        </NavLink>
                                    </MenuItem>
                                    <MenuItem >
                                        <NavLink to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
                                            Sign Up
                                        </NavLink>
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