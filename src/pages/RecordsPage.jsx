import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ServiceDrawer from '../components/ServiceDrawer';  // Drawer for Add/Edit services
import FilterModal from '../components/FilterModal';      // Modal for Filtering
import { useAuth } from '../context/AuthContext';
import { useRecords } from '../context/RecordsContext';
import axios from 'axios';
import { backEndUrl } from '../utils/config';

const RecordsPage = () => {
    const { currDog, authed, token } = useAuth();  // Get current dog and user token
    const [showDrawer, setShowDrawer] = useState(false);  // Drawer state for adding/editing services
    const [showFilterModal, setShowFilterModal] = useState(false);  // Modal state for filtering
    const [drawerMode, setDrawerMode] = useState('create');  // Mode for the drawer: 'create' or 'edit'
    const { fetchAndSetLocalCurrDogRecords, handleDeleteCurrDogRec, currDogRecords, selectedRecord, setLocalSelectedRecord, fetchCurrDogRecords,  } = useRecords();  // Records context

    // States for filtering and sorting
    const [activeFilteredRecords, setActiveFilteredRecords] = useState([]);  // Holds the filtered records
    const [finalDisplayedRecords, setFinalDisplayedRecords] = useState([]);  // Holds the final, sorted records to display
    const [isFilterActive, setIsFilterActive] = useState(false);  // Tracks if filters are applied
    const [sortConfig, setSortConfig] = useState({ key: 'serviceDate', direction: 'asc' });  // Sorting config

    // Fetch and set records whenever the current dog is updated
    useEffect(() => {
        if (currDog) {
            fetchAndSetLocalCurrDogRecords(currDog);  // Fetch records for the current dog
        }
    }, [currDog]);

    // Initialize working and displayed records from currDogRecords
    useEffect(() => {
        if (currDogRecords) {
            if (!isFilterActive) {
                setActiveFilteredRecords(currDogRecords);  // Initialize filtered records to full dataset
                setFinalDisplayedRecords(currDogRecords);  // Initialize displayed records to full dataset
            }
        }
    }, [currDogRecords]);

    // Function to handle opening the ServiceDrawer (either to create or edit a record)
    const handleOpenDrawer = (mode, record = null) => {
        setDrawerMode(mode);
        setLocalSelectedRecord(record);
        setShowDrawer(true);  // Open the drawer
    };

    // Function to handle closing the ServiceDrawer
    const handleCloseDrawer = () => {
        setShowDrawer(false);  // Close the drawer
    };

    // Function to handle record deletion
    const handleDeleteRecord = async (record) => {
        setLocalSelectedRecord(record);
        console.log('Deleting record:', record);

        try {
            // Perform the delete request
            const response = await axios.delete(`${backEndUrl}/medical_record/profile/${currDog.id}/records/${record.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Deleted record:', response.data);      
            // Fetch updated records after deletion
            const updatedRecords = await fetchCurrDogRecords(currDog);

            // Update filtered records and apply any active filters
            setActiveFilteredRecords(updatedRecords);

            if (isFilterActive) {
                // Reapply the filters to the updated records
                const filteredData = updatedRecords.filter(record =>
                    activeFilteredRecords.some(filteredRecord => filteredRecord.id === record.id)
                );
                applyFilterAndSort(filteredData);  // Apply filters and sort
            } else {
                // No filters applied, so display the updated records
                setFinalDisplayedRecords(updatedRecords);
            }

        } catch (error) {
            console.error('Error deleting record or fetching updated records:', error);
        }
    };

    // Apply filters and sort the records, then update the displayed records
    const applyFilterAndSort = (filteredData) => {
        setIsFilterActive(true);  // Set flag to indicate that filters are applied
        const sortedData = sortRecords(filteredData, sortConfig.key, sortConfig.direction);
        setFinalDisplayedRecords(sortedData);  // Update the final displayed records
    };

    // Handle sorting request from the user
    const handleSortRequest = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        const sortedRecords = sortRecords(activeFilteredRecords, key, direction);  // Sort the filtered records
        setSortConfig({ key, direction });
        setFinalDisplayedRecords(sortedRecords);  // Update the displayed records with sorted results
    };

    // Sort records function
    const sortRecords = (records, key, direction) => {
        return [...records].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {`${currDog ? currDog.name + "'s" : ''} Records`}
            </Typography>

            {/* Add and Filter Buttons */}
            <Button variant="contained" onClick={() => handleOpenDrawer('create')} sx={{ mr: 2 }}>
                + Add Service
            </Button>
            <Button variant="outlined" onClick={() => setShowFilterModal(true)}>
                Filter
            </Button>

            {/* Display filtered and sorted records */}
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => handleSortRequest('service_date')} sx={{ cursor: 'pointer' }}>Service Date</TableCell>
                            <TableCell onClick={() => handleSortRequest('category_name')} sx={{ cursor: 'pointer' }}>Category</TableCell>
                            <TableCell onClick={() => handleSortRequest('service_type_name')} sx={{ cursor: 'pointer' }}>Service Type</TableCell>
                            <TableCell onClick={() => handleSortRequest('follow_up_date')} sx={{ cursor: 'pointer' }}>Follow-Up</TableCell>
                            <TableCell onClick={() => handleSortRequest('fee')} sx={{ cursor: 'pointer' }}>Fee</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Update Record</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Delete Record</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {finalDisplayedRecords.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>{record.service_date}</TableCell>
                                <TableCell>{record.category_name}</TableCell>
                                <TableCell>{record.service_type_name}</TableCell>
                                <TableCell>{record.follow_up_date}</TableCell>
                                <TableCell>{record.fee}</TableCell>
                                <TableCell
                                    onClick={() => handleOpenDrawer('edit', record)}
                                    sx={{
                                        textAlign: 'center', borderLeft: '1px solid lightgrey',
                                        borderRight: '1px solid lightgrey', cursor: 'pointer',
                                        '&:hover': { backgroundColor: '#f5f5f5' }
                                    }}>
                                    Update
                                </TableCell>
                                <TableCell
                                    onClick={() => handleDeleteRecord(record)}
                                    sx={{
                                        textAlign: 'center', borderRight: '1px solid lightgrey',
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: '#f5f5f5' }
                                    }}>
                                    Delete
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Service Drawer */}
            <ServiceDrawer
                isOpen={showDrawer}
                onClose={handleCloseDrawer}
                mode={drawerMode}
                serviceData={selectedRecord}
            />

            {/* Filter Modal */}
            {showFilterModal && (
                <FilterModal
                    onClose={() => setShowFilterModal(false)}
                    setFilteredRecords={applyFilterAndSort}  // Pass filtered records to update finalDisplayedRecords
                />
            )}
        </Box>
    );
};

export default RecordsPage;