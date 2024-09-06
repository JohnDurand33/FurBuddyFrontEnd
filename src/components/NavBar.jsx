import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Box, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context/AuthContext';

const Navbar = ({toggleRail, toggleTheme, isDark, isMobile}) => {
    const { logout, authed, user } = useAuth();

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
        <AppBar
            position="static"
            sx={{
                mt:2,
                backgroundColor: 'background.default',
                maxHeight: '8vh',
                width: '100%',
                boxShadow: 'none', 
                borderBottom: isMobile ? null : '1px solid grey',
            }}>
            <Toolbar >
                <Grid container alignItems="center">
                    {/* Left Section */}
                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                        {isMobile && <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleRail}>
                            <MenuIcon />
                    </IconButton>}
                        {/* <Menu
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
                        </Menu> */}
                    </Grid>

                    {/* Center Section */}
                    <Grid item xs={4} container justifyContent="center">
                        <Box sx={{ transform: '' }}>
                            <img src="https://res.cloudinary.com/dkeozpkpv/image/upload/v1725361244/PawHub_fvafym.png" alt="" />
                        </Box>
                    </Grid>

                    {/* Right Section */}
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <IconButton sx={{ ml: 1, color:"secondary.main" }} onClick={toggleTheme} >
                            {isDark ? <Brightness7Icon sx={{ color: "secondary.main" }} /> : <Brightness4Icon sx={{ ml: 1, color: "secondary.main" }} />}
                        </IconButton>
                        <IconButton
                            edge="end"
                            color="primary.main"
                            aria-label="account"
                            onClick={handleAccountMenuOpen}
                        >
                            <AccountCircle sx={{ color: "secondary.main" }}/>
                        </IconButton>

                        

                        {/* Account Menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleAccountMenuClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            {authed ? (
                                <div >
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