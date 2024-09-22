import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { backEndUrl } from '../utils/config';
import { ensureArray } from '../utils/helpers';
import { useAuth } from './AuthContext';


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
            if (authed && token) {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${backEndUrl}/medical_record/profile/${currDog.id}/records`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                console.log('updated currDogProfiles fetched', response.data);
                ensureArray(response.data);
            }
        } catch (error) {
                console.error('Error fetching records:', error);
                setError('Error fetching records');
        } finally {
            setLoading(false);
        };
    };

    // Manual refetching method 
    const refetchCurrDogRecords = async () => {
        const updatedRecords = await fetchCurrDogRecords();
        ensureArray(updatedRecords);    
    };
        
    useEffect(() => {
        if (authed && token) {
            fetchCategories();
            fetchServiceTypes();
        }
    }, [authed, token]);

    useEffect(() => {
        const initialRecords = async () => {
            if (authed && token && currDog) {
                setLoading(true);
                await refetchCurrDogRecords();
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
            refetchCurrDogRecords, 
            ensureArray,
            loading,
            error
        }}>
            {children}
        </RecordsContext.Provider>
    );
};