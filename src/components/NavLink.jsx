import React from 'react'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'

const NavLink = ({ to, children }) => {
    return (
        <Button color="inherit" component={Link} to={to}>
            {children}
        </Button>
    )
}

export default NavLink