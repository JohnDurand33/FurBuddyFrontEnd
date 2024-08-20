import { useState, useContext } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const AccountMenu = () => {
    const { user, setUser } = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        // Logic to handle logout
        setUser(null);
        handleMenuClose();
    };

    return (
        <>
            <IconButton
                edge="end"
                aria-controls="account-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
            <Menu
                id="account-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {!user && (
                    <>
                        <MenuItem component={Link} to="/signup" onClick={handleMenuClose}>
                            Sign Up
                        </MenuItem>
                        <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                            Log In
                        </MenuItem>
                    </>
                )}
                {user && (
                    <>
                        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                            My Account
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                    </>
                )}
            </Menu>
        </>
    );
};

export default AccountMenu;