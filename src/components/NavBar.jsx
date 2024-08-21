import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import NavLink from './NavLink';
import AccountMenu from './AccountMenu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ toggleTheme, isDark }) => {

    return (
        <span><AppBar
            position="static"
            sx={{ backgroundColor: 'background.paper', color: 'text.primary', width: '100vw' }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ mr: 2 }}>
                        <NavLink to="/">Brand Logo</NavLink>
                    </Typography>
                    <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                        {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NavLink to="/dogs" sx={{ mx: 1 }}>Dogs</NavLink>
                    <NavLink to="/vaccinations" sx={{ mx: 1 }}>Vax</NavLink>
                    <NavLink to="/calendar" sx={{ mx: 1 }}>CAL</NavLink>
                    <AccountMenu />
                </Box>
            </Toolbar>
        </AppBar></span>
    );
};

export default Navbar;