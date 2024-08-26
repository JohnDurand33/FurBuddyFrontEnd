import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NavLink from './NavLink';
import AccountMenu from './AccountMenu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ toggleTheme, isDark }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'primary.main', width: '100%' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Hamburger Icon for Mobile Menu */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
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

                {/* Theme Toggle */}
                <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                    {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>

                {/* Account Settings and Theme Toggle */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountMenu />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;