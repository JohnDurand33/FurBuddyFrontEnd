import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../src/calendar.css'; // Custom styles
import { Calendar, Views } from 'react-big-calendar';
import { Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Import necessary date-fns functions
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { dateFnsLocalizer } from 'react-big-calendar';

// Setup date-fns localizer
const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format: (date, formatStr) => format(date, formatStr, { locale: enUS }),
    parse: (value, formatStr) => parse(value, formatStr, new Date(), { locale: enUS }),
    startOfWeek: () => startOfWeek(new Date(), { locale: enUS }),
    getDay: (date) => getDay(date),
    locales,
});

const CalendarPage = ({ events, onCreateEvent }) => {
    const [view, setView] = useState(Views.MONTH); // default view as month
    const theme = useTheme();

    const handleViewChange = (newView) => {
        setView(newView); // Set the current view when a button is clicked
    };

    return (
        <Box sx={{ padding: 4, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Toolbar for Day, Week, Month Views */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                {/* Day, Week, Month View Buttons */}
                <Box>
                    <Button
                        onClick={() => handleViewChange(Views.DAY)}
                        sx={{
                            color: view === Views.DAY ? theme.palette.primary.main : '#555',
                            fontWeight: view === Views.DAY ? 'bold' : 'normal',
                            borderBottom: view === Views.DAY ? `2px solid ${theme.palette.primary.main}` : 'none',
                            padding: '10px 20px',
                            marginRight: '10px',
                            '&:hover': {
                                color: theme.palette.primary.main,
                            },
                        }}
                    >
                        Day
                    </Button>
                    <Button
                        onClick={() => handleViewChange(Views.WEEK)}
                        sx={{
                            color: view === Views.WEEK ? theme.palette.primary.main : '#555',
                            fontWeight: view === Views.WEEK ? 'bold' : 'normal',
                            borderBottom: view === Views.WEEK ? `2px solid ${theme.palette.primary.main}` : 'none',
                            padding: '10px 20px',
                            marginRight: '10px',
                            '&:hover': {
                                color: theme.palette.primary.main,
                            },
                        }}
                    >
                        Week
                    </Button>
                    <Button
                        onClick={() => handleViewChange(Views.MONTH)}
                        sx={{
                            color: view === Views.MONTH ? theme.palette.primary.main : '#555',
                            fontWeight: view === Views.MONTH ? 'bold' : 'normal',
                            borderBottom: view === Views.MONTH ? `2px solid ${theme.palette.primary.main}` : 'none',
                            padding: '10px 20px',
                            marginRight: '10px',
                            '&:hover': {
                                color: theme.palette.primary.main,
                            },
                        }}
                    >
                        Month
                    </Button>
                </Box>

                {/* Create Event Button */}
                <Button
                    variant="contained"
                    className="custom-create-btn"
                    onClick={onCreateEvent}
                    sx={{
                        backgroundColor: theme.palette.secondary.main,
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '5px',
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.dark,
                        },
                    }}
                >
                    Create Event
                </Button>
            </Box>

            {/* Calendar Display */}
            <Box sx={{ flexGrow: 1, height: '100%', overflowY: view !== Views.MONTH ? 'auto' : 'hidden' }}> {/* Make both day and week views scrollable */}
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}  // Pass the view state here
                    onView={handleViewChange}  // Ensures view can change externally
                    views={[Views.DAY, Views.WEEK, Views.MONTH]} // Supported views
                    style={{ height: '100%' }}  // Ensure the calendar takes full height
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            borderRadius: '4px',
                            padding: '2px 6px',
                        },
                    })}
                />
            </Box>
        </Box>
    );
};

export default CalendarPage;