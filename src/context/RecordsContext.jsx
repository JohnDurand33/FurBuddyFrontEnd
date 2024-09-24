import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { backEndUrl } from '../utils/config';
import { se } from 'date-fns/locale';
import { ensureArray } from '../utils/helpers';
import { Icon } from '@iconify/react';
import mdiDeleteOutline from '@iconify/icons-mdi/delete-outline';

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

    const fetchCurrDogRecords = async () => {
        try {
            if (authed && token && currDog) {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${backEndUrl}/medical_record/profile/${currDog.id}/records`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                
                const updatedRecords = await ensureArray(response.data);
                if (updatedRecords.length == []) {
                    setLocalCurrDogRecords([]);
                    setLocalCurrDogRec({});
                    console.log('No records found');
                } else {
                    setLocalCurrDogRecords(updatedRecords);
                    setLocalCurrDogRec(updatedRecords[0]);
                    console.log('updated currDogRecords fetched:', updatedRecords);
                    return updatedRecords;
                }
            }
        } catch (error) {
                console.error('Error fetching records:', error);
                setError('Error fetching records');
                return [];
        } finally {
            setLoading(false);
        };
    };

    // Manual refetching method 
    const refetchCurrDogRecords = async () => {
        const updatedRecords = await fetchCurrDogRecords();
        if (updatedRecords && updatedRecords.length > 0) {
            const formattedNewRecords = ensureArray(updatedRecords);
            console.log('refetch currDogRecords:', formattedNewRecords);
            setLocalCurrDogRecords(formattedNewRecords);
            setLocalCurrDogRec(formattedNewRecords[0]);
            return formattedNewRecords;
        } else {
            setLocalCurrDogRecords([]);
            setLocalCurrDogRec({});
            return [];
        }
    };
        
    useEffect(() => {
        setLoading(true);
        if (authed && token && currDog) {
            console.log('Fetching categories');
            fetchCategories();
            console.log('Fetching service types');
            fetchServiceTypes();
        }
        setLoading(false);
    }, [authed, currDog]);

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
            fetchCurrDogRecords, //fetches and returns records whether or not they are empty
            refetchCurrDogRecords, //sets and returns records
            loading,
            error
        }}>
            {children}
        </RecordsContext.Provider>
    );
};