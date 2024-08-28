import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NavLink from './NavLink';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context/AuthContext'; 

const Navbar = ({ toggleTheme, isDark }) => {
    const { isAuthenticated, logout } = useAuth(); 
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
        <AppBar position="static" sx={{ backgroundColor: 'primary.main', color:"text.opposite", width: '100%' }}>
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
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        slotProps={{
                            paper: {
                                sx: {
                                    width: '25vw',
                                    mt: 1, // margin top to ensure the menu does not overlap the button
                                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
                                },
                            },
                        }}>
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
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
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
                        menuprops={{
                            PaperProps: {
                                sx: {
                                    width: '25vw',
                                },
                            },
                            disableScrollLock: true,
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