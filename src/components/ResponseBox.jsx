import React from 'react';
import { Box } from '@mui/material';

const ResponseBox = () => (
    <Box
        sx={{
            width: {
                xs: '100%',  // full-width on extra-small screens
                sm: '75%',   // 75% width on small screens
                md: '60%',   // 60% width on medium screens
                lg: '50%',   // 50% width on large screens
                xl: '40%',   // 40% width on extra-large screens
            },
            margin: '0 auto',  // center the box
        }}
    >
        {/* Your content here */}
    </Box>
);

export default ResponseBox;
