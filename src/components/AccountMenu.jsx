import { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AccountMenu = () => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    return (
        <div>
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
                {!user && [
                    <MenuItem key="signup" component={Link} to="/signup" onClick={handleMenuClose}>
                        Sign Up
                    </MenuItem>,
                    <MenuItem key="login" component={Link} to="/login" onClick={handleMenuClose}>
                        Log In
                    </MenuItem>
                ]}
                {user && [
                    <MenuItem key="profile" component={Link} to="/profile" onClick={handleMenuClose}>
                        My Account
                    </MenuItem>,
                    <MenuItem key="logout" onClick={handleLogout}>Log Out</MenuItem>
                ]}
            </Menu>
        </div>
    );
};

export default AccountMenu;