import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import NavLink from './NavLink';
import AccountMenu from './AccountMenu';

const Navbar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: 'background.paper' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <NavLink to="/">My Application</NavLink>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NavLink to="/dogs">My Dogs</NavLink>
                    <NavLink to="/vaccinations">Vaccinations</NavLink>
                    <NavLink to="/calendar">Calendar</NavLink>
                    <AccountMenu />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;