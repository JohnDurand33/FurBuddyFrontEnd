import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    appBar: {
        position: 'sticky',
        top: 0,
    },
    linkButton: {
        color: 'inherit',
        textDecoration: 'none',
    }
}));

function Navbar() {
    const classes = useStyles();

    return (
        <AppBar className={classes.appBar} position="sticky">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    FurBuddy
                </Typography>
                <Button color="inherit">
                    <Link to="/" className={classes.linkButton}>Home</Link>
                </Button>
                <Button color="inherit">
                    <Link to="/signup" className={classes.linkButton}>Sign Up</Link>
                </Button>
                <Button color="inherit">
                    <Link to="/profile" className={classes.linkButton}>Profile</Link>
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;