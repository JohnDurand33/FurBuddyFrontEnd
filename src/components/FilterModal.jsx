import React, { useState } from 'react';
import { useFilter } from '../context/FilterContext';
import { Box, Button, TextField, Modal, Typography } from '@mui/material';

const FilterModal = ({ onClose }) => {
    const { filters, applyFilters } = useFilter();
    const [serviceDateFrom, setServiceDateFrom] = useState(filters.serviceDateFrom || '');
    const [serviceDateTo, setServiceDateTo] = useState(filters.serviceDateTo || '');
    const [selectedCategories, setSelectedCategories] = useState(filters.selectedCategories || []);

    const handleApplyFilters = () => {
        applyFilters({
            serviceDateFrom,
            serviceDateTo,
            selectedCategories,
        });
        onClose();
    };

    return (
        <Modal open onClose={onClose}>
            <Box sx={{ padding: 4 }}>
                <Typography variant="h6">Filter Records</Typography>
                <TextField
                    label="Service Date From"
                    type="date"
                    value={serviceDateFrom}
                    onChange={(e) => setServiceDateFrom(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Service Date To"
                    type="date"
                    value={serviceDateTo}
                    onChange={(e) => setServiceDateTo(e.target.value)}
                    fullWidth
                />
                {/* Add more filter fields (categories, etc.) */}
                <Button onClick={handleApplyFilters} variant="contained">Apply Filters</Button>
            </Box>
        </Modal>
    );
};

export default FilterModal;