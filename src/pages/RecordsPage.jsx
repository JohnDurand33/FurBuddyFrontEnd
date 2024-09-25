import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Select, MenuItem, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useRecords } from '../context/RecordsContext';
import ServiceDrawer from '../components/ServiceDrawer';
import FilterModal from '../components/FilterModal';
import axios from 'axios';
import { backEndUrl } from '../utils/config';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ensureArray } from '../utils/helpers';

const RecordsPage = () => {
    const { currDog, authed, token, logout, currUser } = useAuth();
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
        refetchCurrDogRecords();
    }, [currDog, authed, token]);

    useEffect(() => {
        if (currDogRecords && currDogRecords.length > 0) {

            const filteredRecords = applyFilter(currDogRecords); // Apply any active filters
            console.log('filteredRecords:', filteredRecords);
            const sortedRecords = applySorting(filteredRecords); // Sort the filtered records
            console.log('sortedRecords:', sortedRecords);
            setIntermediaryRecords(sortedRecords);
            console.log('sortedRecords:', sortedRecords);
            applyPagination(sortedRecords); // Paginate the sorted and filtered records
            setTotalRecords(filteredRecords.length); // Set the total after filtering
        } else {
            setFinalDisplayedRecords([]);

        }
    }, [currDogRecords, sortConfig]);

    useEffect(() => {
        // Apply pagination whenever `page`, `limit`, or `intermediaryRecords` change
        applyPagination(intermediaryRecords);
    }, [page, limit, intermediaryRecords]);

    const applyPagination = (records) => {
        const start = (page - 1) * limit;
        const paginatedRecords = records.slice(start, start + limit);
        setFinalDisplayedRecords(paginatedRecords);
    };


    const handleAddRecord = () => {
        setSelectedRecord(null); 
        setDrawerMode('create');
        setShowDrawer(true); 
    };

    const handleUpdateRecord = (record) => {
        setSelectedRecord(record); 
        setDrawerMode('edit');
        setShowDrawer(true); 
    };

    const formatDateToUTC = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return format(new Date(date.getTime() + date.getTimezoneOffset() * 60000), 'yyyy-MM-dd');
    };

    const applySorting = (records) => {
        return [...records].sort((a, b) => {
            if (sortConfig.key === 'service_date') {
                const dateA = new Date(a.service_date);
                const dateB = new Date(b.service_date);
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            } else if (sortConfig.key === 'fee') {
                const feeA = parseFloat(a.fee || 0);
                const feeB = parseFloat(b.fee || 0);
                return sortConfig.direction === 'asc' ? feeA - feeB : feeB - feeA;
            } else {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            }
        });
    };

    const applyFilter = (records) => {
        // Implement filtering logic here if necessary, for now, it's a pass-through
        return records;
    };

    const handleSortRequest = (key) => {
        
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        applyPagination(intermediaryRecords);
    };

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
        setPage(1);
        applyPagination(intermediaryRecords);
    };

    const handleDeleteRecord = async (record) => {
        try {
            await axios.delete(`${backEndUrl}/medical_record/profile/${currDog.id}/records/${record.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            await fetchCurrDogRecords();
        } catch (error) {
            console.error('Error deleting record or fetching updated records:', error);
        }
    };

    useEffect(() => {
        const initialRecords = async () => {
            console.log('Initial records fetching');
            if (authed && token && currDog) {
                setLoading(true);
                await fetchCurrDogRecords(token);
                setLoading(false);
            }
        };
        initialRecords();
    }, [currDog]);

    // Fetch dog profiles after login
    useEffect(() => {
        const initialDogs = async () => {
            setLoading(true);
            if (authed && token && currUser) {
                try {
                    const hasDogs = await fetchCurrDogProfiles(token);
                    if (!hasDogs) {
                        console.log('Login useEffect: No dog profiles found redirecting to /dogs/new');
                    } else {
                        console.log('Login useEffect: Dog profiles found redirecting to /dogs/view');
                    }
                } catch (error) {
                    console.error('Error fetching profiles:', error);
                    setLoading(false);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        initialDogs();
    }, [currUser]);


    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {currDog ? currDog.name + ' Records' : 'No Dog Selected'}
            </Typography>

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
                    <Button variant="contained" onClick={handleAddRecord} sx={{ mr: 2 }}>
                        + Add
                    </Button>
                    <Button variant="outlined" onClick={() => setShowFilterModal(true)}>
                        Filter
                    </Button>
                </Grid>
            </Grid>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress />
                </Box>
            )}

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
                                    <TableCell>{formatDateToUTC(record.service_date)}</TableCell>
                                    <TableCell>{record.category_name ? record.category_name : 'N/A'}</TableCell>
                                    <TableCell>{record.service_type_name ? record.service_type_name : 'N/A'}</TableCell>
                                    <TableCell>{record.follow_up_date ? formatDateToUTC(record.follow_up_date) : 'N/A'}</TableCell>
                                    <TableCell>{parseFloat(record.fee).toFixed(2)}</TableCell>
                                    <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleUpdateRecord(record)}>
                                        Update
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleDeleteRecord(record)}>
                                        Delete
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : null}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Typography>Showing {finalDisplayedRecords.length} of {totalRecords} records</Typography>
                <Box>
                    <Button disabled={page === 1} onClick={() => handlePageChange(page - 1)} sx={{ mr: 2 }}>
                        Previous
                    </Button>
                    <Button disabled={page * limit >= totalRecords} onClick={() => handlePageChange(page + 1)}>
                        Next
                    </Button>
                </Box>
            </Box>

            <ServiceDrawer isOpen={showDrawer} mode={drawerMode} serviceData={selectedRecord} setShowDrawer={setShowDrawer} />

            {showFilterModal && (
                <FilterModal onClose={() => setShowFilterModal(false)} setFilteredRecords={applyFilter} />
            )}
        </Box>
    );
};

export default RecordsPage;