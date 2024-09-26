import React, { useState } from 'react';
import { Box, Checkbox, FormControlLabel, Button, Backdrop, IconButton, Divider, TextField, Typography } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import { Icon } from '@iconify/react';
import chevronDownIcon from '@iconify/icons-mdi/chevron-down';
import chevronUpIcon from '@iconify/icons-mdi/chevron-up';
import { useRecords } from '../context/RecordsContext';
import { api } from '../utils/eventApi';

const FilterModal = ({ onClose, setFilteredRecords }) => {
    const [selectedCategories, setSelectedCategories] = useState({});
    const [selectedServiceTypes, setSelectedServiceTypes] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [appliedFilters, setAppliedFilters] = useState([]);
    const { currDogRecords, categories, serviceTypes } = useRecords();
    const [isOpen, setIsOpen] = useState({}); // For toggling categories

    // Toggle category and its associated service types
    const handleCategoryToggle = (category) => {
        setIsOpen({ ...isOpen, [category.id]: !isOpen[category.id] });
    };

    const handleCategorySelection = (category) => {
        const updatedCategories = { ...selectedCategories, [category.id]: !selectedCategories[category.id] };
        setSelectedCategories(updatedCategories);

        const updatedServiceTypes = { ...selectedServiceTypes };
        serviceTypes
            .filter(service => service.category_id === category.id)
            .forEach(service => {
                updatedServiceTypes[service.name] = updatedCategories[category.id];
            });
        setSelectedServiceTypes(updatedServiceTypes);

        if (updatedCategories[category.id]) {
            setAppliedFilters([...appliedFilters, ...serviceTypes.filter(service => service.category_id === category.id).map(service => service.name)]);
        } else {
            setAppliedFilters(appliedFilters.filter(filter => !serviceTypes.some(service => service.category_id === category.id && service.name === filter)));
        }
    };

    // Apply filters and close the modal
    const handleApply = () => {
        const filteredData = currDogRecords.filter(record => appliedFilters.includes(record.service_type_name));
        setFilteredRecords(filteredData);
        onClose();
    };

    // Pass the date field values to the disabled fields on the right
    const handleDateChange = (setter) => (e) => {
        setter(e.target.value);
    };

    return (
        <>
            {/* Backdrop to darken the rest of the screen */}
            <Backdrop open={true} sx={{ zIndex: 999, bgcolor: 'rgba(0, 0, 0, 0.5)' }} onClick={onClose} />

            {/* Modal Container */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-40%, -50%)',
                    zIndex: 1000,
                    p: 3,
                    width: '80vw',
                    maxHeight: '80vh',
                    bgcolor: '#f5f5f5',  // Paper-like background
                    borderRadius: 1,
                    boxShadow: 3,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Top Row: Service Date Fields */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    {/* Service Date From */}
                    <Box sx={{ width: '50%' }}>
                        <TextField
                            label="From"
                            type="date"
                            value={startDate}
                            onChange={handleDateChange(setStartDate)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            sx={{
                                bgcolor: '#ffffff',  // Paper-like background
                                borderRadius: '4px',
                                '& .MuiInputBase-input': { padding: '10px' },
                                boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.2)',  // Subtle shadow
                            }}
                        />
                    </Box>

                    {/* Service Date To */}
                    <Box sx={{ width: '50%' }}>
                        <TextField
                            label="To"
                            type="date"
                            value={endDate}
                            onChange={handleDateChange(setEndDate)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            sx={{
                                bgcolor: '#ffffff',
                                borderRadius: '4px',
                                '& .MuiInputBase-input': { padding: '10px' },
                                boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    </Box>
                </Box>

                {/* Divider between the top row and the two columns */}
                <Divider sx={{ mb: 2 }} />

                {/* Two Column Layout */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    {/* Left Column: Categories and Service Types */}
                    <Box sx={{ width: '50%', pr: 3 }}>
                        {categories.map((category) => (
                            <Box key={category.id} sx={{ mb: 2 }}>
                                <FormControlLabel
                                    control={
                                        <IconButton onClick={() => handleCategoryToggle(category)}>
                                            <Icon icon={isOpen[category.id] ? chevronUpIcon : chevronDownIcon} />
                                        </IconButton>
                                    }
                                    label={category.category_name}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        bgcolor: '#ffffff',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                                    }}
                                />

                                {/* Show Service Types when category is open */}
                                {isOpen[category.id] && (
                                    <Box sx={{ pl: 4 }}>
                                        {serviceTypes
                                            .filter(serviceType => serviceType.category_id === category.id)
                                            .map(serviceType => (
                                                <FormControlLabel
                                                    key={serviceType.id}
                                                    control={
                                                        <Checkbox
                                                            checked={selectedServiceTypes[serviceType.name] || false}
                                                            onChange={() => handleCategorySelection(category)}
                                                        />
                                                    }
                                                    label={serviceType.name}
                                                />
                                            ))}
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Box>

                    {/* Vertical Divider */}
                    <Divider orientation="vertical" flexItem />

                    {/* Right Column: Service Date Fields (mirrored, disabled) and Applied Filters */}
                    <Box sx={{ width: '50%', pl: 3 }}>
                        {/* Mirrored Service Date Fields */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                            <TextField
                                label="From"
                                type="date"
                                value={startDate}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                sx={{
                                    bgcolor: '#ffffff',
                                    borderRadius: '4px',
                                    '& .MuiInputBase-input': { padding: '10px' },
                                    boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.2)',
                                }}
                            />
                            <TextField
                                label="To"
                                type="date"
                                value={endDate}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                sx={{
                                    bgcolor: '#ffffff',
                                    borderRadius: '4px',
                                    '& .MuiInputBase-input': { padding: '10px' },
                                    boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.2)',
                                }}
                            />
                        </Box>

                        {/* Applied Filters */}
                        <Typography variant="h6">Applied Filters</Typography>
                        {appliedFilters.map((filter) => (
                            <Box key={filter} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography>{filter}</Typography>
                                <Button onClick={() => handleCategorySelection({ name: filter })} sx={{ color: 'red', minWidth: 'auto' }}>
                                    <FaTimes />
                                </Button>
                            </Box>
                        ))}

                        {/* Action Buttons */}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button variant="contained" onClick={handleApply}>Apply</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default FilterModal;