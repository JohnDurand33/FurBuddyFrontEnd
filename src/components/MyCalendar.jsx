import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Box } from '@mui/system';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function MyCalendar() {
    const [view, setView] = useState('month'); 

    return (
        <>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <h2>Calendar</h2></Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '80vh', width: '100%' }}>
            <Calendar
                localizer={localizer}
                events={[]}
                startAccessor="start"
                endAccessor="end"
                defaultView={view}
                onView={(newView) => setView(newView)}
                views={['month', 'week', 'day']}
                style={{ }}
                toolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,week,day'
                }}
            />
            </Box>
        </>
    );
}

export default MyCalendar;