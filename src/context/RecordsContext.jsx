import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

// Create the RecordsContext
const RecordsContext = createContext();

export const useRecords = () => useContext(RecordsContext);

export const RecordsProvider = ({ children }) => {
    const [records, setRecords] = useState([]); 
    const { authed, token, currDog, currUser } = useAuth();

    // useEffect(() => {
    //     if (authed && token && currDog) {
    //         const fetchCurrDogRecords = async () => {
    //             try {
    //                 const response = await axios.get(`${backEndUrl}/medical_record/${currUser.id}`, {
    //                 const data = await response.json();
    //                 setRecords(data); // Assuming the API returns the records array
    //             } catch (error) {
    //                 console.error('Error fetching records:', error);
    //             }
    //         };

    //         fetchCurrDogRecords();
    //     };
    // }, [authed, token, currDog]); 

    return (
        <RecordsContext.Provider value={{ records, setRecords }}>
            {children}
        </RecordsContext.Provider>
    );
};