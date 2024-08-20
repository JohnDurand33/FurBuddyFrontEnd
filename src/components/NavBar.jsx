import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import NavLink from './NavLink';
import AccountMenu from './AccountMenu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ toggleTheme, isDark }) => {
    return (
        <AppBar position="static" sx={{backgroundColor: 'background.paper', color: 'text.primary'
        }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
                <Box sx={{ display: 'flex', justifySelf:'start', alignItems: 'center', justifyContent: 'space-between', mx:2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <NavLink to="/">Brand Logo</NavLink>
                    </Typography>
                    <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                    {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifySelf:'end', alignItems: 'center', justifyContent: 'space-between' }}>
                    <NavLink to="/dogs" >Dogs</NavLink>
                    <NavLink to="/vaccinations" style={{ pe: 2 }}>Vax</NavLink>
                    <NavLink to="/calendar" style={{ pe: 2 }}>CAL</NavLink>
                    <AccountMenu />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;