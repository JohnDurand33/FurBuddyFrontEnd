import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { backEndUrl } from '../utils/config';

// Create the RecordsContext
const RecordsContext = createContext();

export const useRecords = () => useContext(RecordsContext);

export const RecordsProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [currDogRec, setCurrDogRec] = useState({});
    const [currDogRecords, setCurrDogRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { authed, token, currDog } = useAuth();

    const setLocalCurrDogRecords = (records) => {
        localStorage.setItem('currDogRecords', JSON.stringify(records));
        setCurrDogRecords(records);
    };

    const setLocalCurrDogRec = (record) => {
        localStorage.setItem('currDogRec', JSON.stringify(record));
        setCurrDogRec(record);
    };

    const setLocalCategories = (categories) => {
        localStorage.setItem('categories', JSON.stringify(categories));
        setCategories(categories);
    };

    const setLocalServiceTypes = (serviceTypes) => {
        localStorage.setItem('serviceTypes', JSON.stringify(serviceTypes));
        setServiceTypes(serviceTypes);
    };

    const setLocalSelectedRecord = (record) => {
        localStorage.setItem('selectedRecord', JSON.stringify(record));
        setSelectedRecord(record);
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${backEndUrl}/medical_record/categories`);
            console.log('Categories response:', response);
            const { data } = response;
            setLocalCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Error fetching categories');
        }
    };

    const fetchServiceTypes = async () => {
        try {
            const response = await axios.get(`${backEndUrl}/medical_record/service_types`);
            console.log('Service types response:', response);
            const { data } = response;
            setLocalServiceTypes(data);
        } catch (error) {
            console.error('Error fetching service types:', error);
            setError('Error fetching service types');
        }
    };

    const fetchCurrDogRecords = async (currDog) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${backEndUrl}/medical_record/profile/${currDog.id}/records`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            console.log('updated currDogProfiles fetched', response.data);
            const updatedRecords = !Array.isArray(response.data) ? [response.data] : response.data;
            return updatedRecords;
        } catch (error) {
            console.error('Error fetching records:', error);
            setError('Error fetching records');
        } finally {
            setLoading(false);
        }
    };

    const fetchAndSetLocalCurrDogRecords = async () => {
        if (authed && token && currDog) {
            const response = await fetchCurrDogRecords(currDog);
            console.log('updatedCurrDogRecords:', response);
            if (response && response.length > 0) {
                const formattedRecords = Array.isArray(response) ? response : [response];
                setLocalCurrDogRecords(formattedRecords);
                setLocalCurrDogRec(formattedRecords[0]);
                console.log('currDogRecords:', formattedRecords);
                return true;
            } else {
                console.log('no records found');
                setLocalCurrDogRecords([]);
                setLocalCurrDogRec({});
                return false;
            }
        }
    };

    // Manual refetching method after adding/deleting a record
    const refetchCurrDogRecords = async () => {
        const updatedRecords = await fetchCurrDogRecords(currDog);
        setLocalCurrDogRecords(updatedRecords);
        if (updatedRecords.length > 0) {
            setLocalCurrDogRec(updatedRecords[0]);
        }
        return updatedRecords;
    };

    useEffect(() => {
        const initialRecords = async () => {
            if (authed && token && currDog && currDogRecords.length === 0) {
                setLoading(true);
                await fetchCategories();
                await fetchServiceTypes();
                await fetchAndSetLocalCurrDogRecords();
                setLoading(false);
            }
        };
        initialRecords();
    }, [currDog]);

    return (
        <RecordsContext.Provider value={{
            categories,
            setLocalCategories,
            serviceTypes,
            setLocalServiceTypes,
            currDogRecords,
            setLocalCurrDogRecords,
            currDogRec,
            setLocalCurrDogRec,
            selectedRecord,
            setLocalSelectedRecord,
            fetchCategories,
            fetchServiceTypes,
            fetchCurrDogRecords,
            fetchAndSetLocalCurrDogRecords,
            refetchCurrDogRecords,  // Added refetch function
            loading,
            error
        }}>
            {children}
        </RecordsContext.Provider>
    );
};