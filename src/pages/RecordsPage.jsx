import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddServiceDrawer from '../components/AddServiceDrawer';
import FilterModal from '../components/FilterModal';
import { useFilter } from '../context/FilterContext';
import { useAuth } from '../context/AuthContext';
import { useRecords } from '../context/RecordsContext';

const RecordsPage = () => {
    const { currDog, authed } = useAuth();
    const { records, fetchRecords } = useRecords();
    const { filters } = useFilter();
    const [showDrawer, setShowDrawer] = useState(false); // Control AddServiceDrawer visibility
    const [selectedRecord, setSelectedRecord] = useState(null); // For editing a record
    const [isEditMode, setIsEditMode] = useState(false); // To distinguish between Add and Edit modes
    const [showFilterModal, setShowFilterModal] = useState(false); // Control FilterModal visibility

    // useEffect(() => {
    //     if (currDog) {
    //         fetchRecords(currDog.id);
    //     }
    // }, [currDog, fetchRecords]);

    const handleAddService = () => {
        setSelectedRecord(null); // Clear selected record for add mode
        setIsEditMode(false); // Set to add mode
        setShowDrawer(true); // Open the drawer
    };

    const handleEditService = (record) => {
        setSelectedRecord(record); // Set selected record for edit mode
        setIsEditMode(true); // Set to edit mode
        setShowDrawer(true); // Open the drawer
    };

    // Apply filter logic
    const filteredRecords = records.filter((record) => {
        const { serviceDateFrom, serviceDateTo, selectedCategories } = filters;

        // Filter by date range
        const serviceDate = new Date(record.serviceDate);
        if (serviceDateFrom && serviceDate < new Date(serviceDateFrom)) return false;
        if (serviceDateTo && serviceDate > new Date(serviceDateTo)) return false;

        // Filter by category
        if (selectedCategories.length && !selectedCategories.includes(record.category)) return false;

        return true;
    });

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {`${currDog ? currDog.name + "'s" : ''} Records`}
            </Typography>

            {/* Add and Filter Buttons */}
            <Button variant="contained" onClick={handleAddService} sx={{ mr: 2 }}>
                + Add Service
            </Button>
            <Button variant="outlined" onClick={() => setShowFilterModal(true)}>
                Filter
            </Button>

            {/* Display filtered records */}
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Service Date</TableCell>
                            <TableCell>Service Type</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Follow-Up</TableCell>
                            <TableCell>Fee</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.map((record) => (
                            <TableRow key={record.id} onClick={() => handleEditService(record)} sx={{ cursor: 'pointer' }}>
                                <TableCell>{record.serviceDate}</TableCell>
                                <TableCell>{record.serviceType}</TableCell>
                                <TableCell>{record.category}</TableCell>
                                <TableCell>{record.followUpDate}</TableCell>
                                <TableCell>{record.fee}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Service Drawer */}
            <AddServiceDrawer
                isOpen={showDrawer} // Control the drawer's visibility
                onClose={() => setShowDrawer(false)} // Close drawer callback
                serviceData={selectedRecord} // Pass selected record for editing
                isEditMode={isEditMode} // Determine whether it's Add or Edit mode
            />

            {/* Filter Modal */}
            {showFilterModal && <FilterModal onClose={() => setShowFilterModal(false)} />}
        </Box>
    );
};

export default RecordsPage;