import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function ThreeColumnGrid() {
    const items = Array.from({ length: 9 }, (_, index) => `Item ${index + 1}`);

    return (
        <Grid container spacing={2}>
            {items.map((item, index) => (
                <Grid item xs={4} key={index}>
                    <Paper style={{ padding: '16px', textAlign: 'center' }}>
                        <Typography>{item}</Typography>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
}

export default ThreeColumnGrid;