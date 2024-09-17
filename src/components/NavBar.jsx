import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Box, Grid, IconButton, Menu, MenuItem, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@emotion/react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ toggleRail, toggleTheme, isDark, isMobile, isCollapsed }) => {
    const { logout, authed, setAuthed, clearAllStateAndLocalStorage } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);  // For the account menu
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);  // For the hamburger menu

    // Handle account menu open/close
    const handleAccountMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAccountMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = (e) => {
        clearAllStateAndLocalStorage();
        setAuthed(false);
        logout();
        navigate('/login');
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
                mt: 2,
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
                        {!authed ?
                            (isMobile && <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleRail}>
                                <MenuIcon />
                            </IconButton>) : location.pathname === ('dogs/new' || 'dogs/create') ? 'My Dogs' : location.pathname === '/records' ? 'My Records' : location.pathname === '/Map' ? 'Map' : null}
                    </Grid>


                    {/* Center Section */}
                    <Grid item xs={4} container justifyContent="center">
                        <Box sx={{ transform: '' }}>
                            {!authed ? <img src="https://res.cloudinary.com/dkeozpkpv/image/upload/v1725361244/PawHub_fvafym.png" alt="Logo" />
                                : ''}
                        </Box>
                    </Grid>

                    {/* Right Section */}
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <IconButton sx={{ ml: 1, color: "secondary" }} onClick={toggleTheme}>
                            {isDark ? <Brightness7Icon sx={{ color: "secondary" }} /> : <Brightness4Icon sx={{ ml: 1, color: "grey" }} />}
                        </IconButton>

                        {/* Conditionally Render Log In/Sign Up or Account based on `authed` and screen size */}
                        {isMobile ? (
                            <IconButton
                                edge="end"
                                color="primary"
                                aria-label="account"
                                onClick={handleAccountMenuOpen}
                            >
                                <AccountCircle sx={{ color: "grey" }} />
                            </IconButton>
                        ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                                {/* Render Log In / Sign Up or Account Settings / Logout */}
                                {authed ? (
                                    <>
                                        <Button component={NavLink} to="/account" sx={{ ml: 1, color: theme.palette.text.primary }}>
                                            Account Settings
                                        </Button>
                                        <Button onClick={handleLogout} sx={{ ml: 1, color: theme.palette.text.primary }}>
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                            <>
                                        <Button component={NavLink} style={{ color: theme.palette.text.primary }}>
                                            Home
                                        </Button>
                                        <Button component={NavLink} style={{ color: theme.palette.text.primary }}>
                                            About
                                        </Button>
                                        <Button component={NavLink} style={{ color: theme.palette.text.primary, textWrap:false }}>
                                            How It Works
                                        </Button>
                                        <Button component={NavLink} style={{ color: theme.palette.text.primary }}>
                                            Blog
                                        </Button>
                                        <Button component={NavLink} to="/login" sx={{ ml: 1, color: theme.palette.text.primary }}>
                                            Log In
                                        </Button>
                                        <Button component={NavLink} to="/signup" sx={{ ml: 1, color: theme.palette.secondary.main, backgroundColor: theme.palette.primary.main }}>
                                            Sign Up
                                        </Button>
                                    </>
                                )}
                                </div>
                        )}

                        {/* Account Menu for Mobile */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleAccountMenuClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            {authed ? (
                                <div>
                                    <MenuItem component={NavLink} to="/account" style={{ color: 'text.primary' }}>
                                        Account Settings
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout} style={{ color: 'text.primary' }}>
                                        Logout
                                    </MenuItem>
                                </div>
                            ) : (
                                <div>
                                    <MenuItem component={NavLink} to="/login" style={{ backgroundColor:'primary.main', textDecoration: 'none', color: 'text.primary',  }}>
                                        Log In
                                    </MenuItem>
                                        <MenuItem component={NavLink} to="/signup" style={{ backgroundColor: 'primary.main', textDecoration: 'none', color: 'text.primary' }}>
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