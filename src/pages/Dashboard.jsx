import React from 'react';
import { Box } from '@mui/material';

const Dashboard = () => {

    return (
        <Box
            sx={{
                marginLeft: isMin ? '64px' : '18%', // Adjust margin based on rail state
                transition: 'margin-left 0.5s ease-in-out', // Smooth transition when toggling
                width: `calc(100% - ${isMin ? '64px' : '18%'})`, // Adjust width accordingly
                padding: '16px', // Padding inside the MainView
                boxSizing: 'border-box', // Ensure padding is included in the width calculation
            }}
        >
            {/* Your main content goes here */}
            <h1>Welcome to the Dashboard</h1>
            <p>This is the main content area that adjusts based on the state of the MenuRail.</p>
        </Box>
    );
};

export default Dashboard;