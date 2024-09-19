import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Select, MenuItem, CircularProgress } from '@mui/material';
import ServiceDrawer from '../components/ServiceDrawer';
import FilterModal from '../components/FilterModal';
import { useAuth } from '../context/AuthContext';
import { useRecords } from '../context/RecordsContext';
import axios from 'axios';
import { backEndUrl } from '../utils/config';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const RecordsPage = () => {
    const { currDog, authed, token, logout } = useAuth();
    const { currDogRecords, setLocalCurrDogRecords, refetchCurrDogRecords } = useRecords();
    const [showDrawer, setShowDrawer] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [drawerMode, setDrawerMode] = useState('create');
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Sorting configuration
    const [sortConfig, setSortConfig] = useState({ key: 'service_date', direction: 'asc' });

    // Intermediary and Final State for displayed records
    const [intermediaryRecords, setIntermediaryRecords] = useState([]);
    const [finalDisplayedRecords, setFinalDisplayedRecords] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!authed) {
            logout();
            navigate('/login');
        }
    }, [authed]);

    // 1. Fetch records from the backend
    useEffect(() => {
        fetchRecords(); // Fetch records from the backend
    }, [currDog, authed, token, page, limit]);  // Fetch only when these dependencies change

    // 2. Apply sorting and pagination when `currDogRecords` changes
    useEffect(() => {
        if (currDogRecords && currDogRecords.length > 0) {
            const sortedRecords = applySorting(currDogRecords);  // Sort the raw records
            setIntermediaryRecords(sortedRecords);  // Update intermediary state
            applyPagination(sortedRecords);  // Paginate the sorted records
            setTotalRecords(currDogRecords.length);
        }
    }, [currDogRecords, sortConfig]);  // Trigger when `currDogRecords` or `sortConfig` changes

    // Fetch records from the backend
    const fetchRecords = async () => {
        if (authed && token && currDog) {
            setLoading(true);
            try {
                const response = await axios.get(`${backEndUrl}/medical_record/profile/${currDog.id}/records`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        page,
                        limit,
                        offset: (page - 1) * limit,
                    },
                });

                const fetchedRecords = response.data || [];

                // Only update `currDogRecords` if fetched records are different
                if (JSON.stringify(fetchedRecords) !== JSON.stringify(currDogRecords)) {
                    setLocalCurrDogRecords(fetchedRecords);  // Update global state
                }

                setTotalRecords(fetchedRecords.length || 0);  // Update total records count
            } catch (error) {
                console.error('Error fetching records:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Sorting logic
    const applySorting = (records) => {
        return [...records].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    
    // Pagination logic
    const applyPagination = (records) => {
        const paginatedRecords = records.slice((page - 1) * limit, page * limit);
        setFinalDisplayedRecords(paginatedRecords);  // Update state for display
    };

    // Sort request handler
    const handleSortRequest = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';  // Toggle sorting direction
        }
        setSortConfig({ key, direction });  // Update sorting configuration
    };

    // Page change handler
    const handlePageChange = (newPage) => {
        setPage(newPage);
        applyPagination(intermediaryRecords);  // Apply pagination based on sorted records
    };

    // Limit change handler
    const handleLimitChange = (event) => {
        setLimit(event.target.value);
        setPage(1);  // Reset page when changing limit
        applyPagination(intermediaryRecords);  // Apply pagination based on sorted records
    };

    const formatDisplay = (date) => {
        if (!date) return '';
        return dayjs(date).format('YYYY-MM-DD');
    };

    const handleDeleteRecord = async (record) => {
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
            const updatedRecords = await refetchCurrDogRecords();
            

        } catch (error) {
            console.error('Error deleting record or fetching updated records:', error);
        }
    };

    // Drawer handling for updating a record
    const handleUpdateRecord = (record) => {
        setDrawerMode('edit');
        setSelectedRecord(record);
        setShowDrawer(true);
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setSelectedRecord(null);  // Clear the selected record after closing
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {`${currDog ? currDog.name + "'s" : ''} Records`}
            </Typography>

            {/* Add and Filter Buttons */}
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Select value={limit} onChange={handleLimitChange}>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={() => setDrawerMode('create') & setShowDrawer(true)} sx={{ mr: 2 }}>
                        + Add
                    </Button>
                    <Button variant="outlined" onClick={() => setShowFilterModal(true)}>
                        Filter
                    </Button>
                </Grid>
            </Grid>

            {/* Loading spinner */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Display filtered and sorted records */}
            <TableContainer component={Paper} sx={{ mt: 3, border: '1px solid lightgrey' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => handleSortRequest('service_date')} sx={{ cursor: 'pointer', fontWeight: 600 }}>
                                Service Date
                            </TableCell>
                            <TableCell onClick={() => handleSortRequest('category_name')} sx={{ cursor: 'pointer', fontWeight: 600 }}>
                                Category
                            </TableCell>
                            <TableCell onClick={() => handleSortRequest('service_type_name')} sx={{ cursor: 'pointer', fontWeight: 600 }}>
                                Service Type
                            </TableCell>
                            <TableCell onClick={() => handleSortRequest('follow_up_date')} sx={{ cursor: 'pointer', fontWeight: 600 }}>
                                Follow-Up
                            </TableCell>
                            <TableCell onClick={() => handleSortRequest('fee')} sx={{ cursor: 'pointer', fontWeight: 600 }}>
                                Fee
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>Update</TableCell>
                            <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {finalDisplayedRecords && finalDisplayedRecords.length > 0 ? (
                            finalDisplayedRecords.map((record, index) => (
                                <TableRow key={record.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5' }}>
                                    <TableCell>{formatDisplay(record.service_date)}</TableCell>
                                    <TableCell>{record.category_name}</TableCell>
                                    <TableCell>{record.service_type_name}</TableCell>
                                    <TableCell>{formatDisplay(record.follow_up_date)}</TableCell>
                                    <TableCell>{record.fee}</TableCell>
                                    <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleUpdateRecord(record)}>
                                        Update
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleDeleteRecord(record)}>Delete</TableCell>
                                </TableRow>
                            ))
                        ) : null}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Typography>
                    Showing {finalDisplayedRecords.length} of {totalRecords} records
                </Typography>
                <Box>
                    <Button disabled={page === 1} onClick={() => handlePageChange(page - 1)} sx={{ mr: 2 }}>
                        Previous
                    </Button>
                    <Button disabled={page * limit >= totalRecords} onClick={() => handlePageChange(page + 1)}>
                        Next
                    </Button>
                </Box>
            </Box>

            {/* Add/Edit Service Drawer */}
            <ServiceDrawer
                isOpen={showDrawer}
                onClose={handleCloseDrawer}
                mode={drawerMode}
                serviceData={selectedRecord}  // Pass the selected record for editing
            />

            {/* Filter Modal */}
            {showFilterModal && (
                <FilterModal
                    onClose={() => setShowFilterModal(false)}
                    setFilteredRecords={applyFiltering} // Set filtered records using the filtering logic
                />
            )}
        </Box>
    );
};

export default RecordsPage;