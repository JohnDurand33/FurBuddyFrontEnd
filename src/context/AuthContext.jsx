import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backEndUrl } from '../utils/config';
import data from '@iconify/icons-mdi/chevron-down';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authed, setAuthed] = useState(false);
    const [token, setToken] = useState(null);
    const [currUser, setCurrUser] = useState(null);
    const [fireUser, setFireUser] = useState(null);
    const [currDog, setCurrDog] = useState(null);
    const [dogProfiles, setDogProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Helper functions to update state and save to localStorage
    const setLocalToken = (token) => {
        if (token)
        setToken(token);
        localStorage.setItem('token', token);
    };

    const setLocalCurrUser = (user) => {
        setCurrUser(user);
        localStorage.setItem('currUser', JSON.stringify(user));
    };

    const setLocalCurrDog = (dog) => {
        setCurrDog(dog);
        localStorage.setItem('currDog', JSON.stringify(dog));
    };

    const setLocalCurrDogProfiles = (dogProfiles) => {
        setDogProfiles(dogProfiles);
        localStorage.setItem('currDogProfiles', JSON.stringify(dogProfiles));
    };

    const clearAllStateAndLocalStorage = () => {
        setAuthed(false);
        setToken(null);
        setLocalToken(null);
        setCurrUser(null);
        setLocalCurrUser(null);
        setFireUser(null);
        setCurrDog(null);
        setLocalCurrDog(null);
        setLocalCurrDogProfiles([]);
        localStorage.clear(); // Clears all stored items
    };

    const logout = () => {
        clearAllStateAndLocalStorage();
        navigate('/login');
    };

    const loadUserandDogfromLocalOrApi = async () => {
        setLoading(true);
        if (token && authed) {
            const fetchedUser = await fetchUserDataWithToken(storedToken);
            setCurrUser(fetchedUser);
            console.log('Fetched user data:', fetchedUser);
            setToken(storedToken);
        } else {
            console.log("No user data or token found. Navigating to login page.");
            clearAllStateAndLocalStorage();
            navigate('/login');
            return;
        }
        // Optionally load the dog profile from localStorage or Api
        if (currDog) {
            setCurrDog(JSON.parse(storedDog));
        } else {
            let profiles = await fetchDogProfilesFromApi();
            console.log('Fetched dog profiles, could be null if no dogs in db', profiles);
            if (profiles && profiles.length > 0) {
                setLocalCurrDogProfiles(profiles);
                setLocalCurrDog(profiles[0]); // Set the first dog as current
            } else {
                console.log('No dog profiles found for user:', currUser);
            }
        };
        setLoading(false);
    };

    const deleteDogProfile = async () => {
        try {
            console.log('currDog:', currDog);   
            const response = await axios.delete(`${backEndUrl}/profile/profiles/${currDog.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Delete Dog Response:', response.data);
            data = response.data;
            console.log('Deleted dog data:', data);
        } catch (error) {
            console.error('Error deleting dog profile:', error);
        }
    };

    const fetchUserDataWithToken = async (token) => {
        try {
            const response = await axios.get(`${backEndUrl}/owner/owners/current`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setLocalCurrUser(response.data); // Store user
            return response.data;
        } catch (err) {
            console.error('Error fetching user data:', err);
            clearAllStateAndLocalStorage();
            navigate('/login');
        }
    };

    const fetchCurrDogProfiles = async () => {
        try {
            if (authed && token) {
                const response = await axios.get(`${backEndUrl}/profile/profiles`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.data && response.data.length > 0) {
                    console.log('Fetched dog profiles:', response.data);
                    response.data = Array.isArray(response.data) ? response.data : [response.data];
                    return response.data
                };
            };
        } catch (error) {
            console.error('Error fetching dog profiles:', error);
            return [];
        }
    };


    const fetchAndSetLocalCurrDogProfiles = async () => {
        if (authed && token && dogProfiles) {
            const newCurrDogProfiles = await fetchCurrDogProfiles();
            console.log('updatedCurrDogRecords:', newCurrDogProfiles);
            if (newCurrDogProfiles) {
                setLocalCurrDogProfiles(newCurrDogProfiles);
                setLocalCurrDog(newCurrDogProfiles[0]);
                console.log('formatted updated CurrDogProfiles:', newCurrDogProfiles);
                return true
            } else {
                console.log('no records found');
                setLocalCurrDogProfiles([]);
                setLocalCurrDog({});
                return false
            }
        };
    };

    // Load user and dog profile from localStorage on component mount
    useEffect(() => {
        setLoading(true);
        fetchAndSetLocalCurrDogProfiles();
        setLoading(false);
    }, [token, authed]);

    

    return (
        <AuthContext.Provider
            value={{
                authed,
                setAuthed,
                token,
                setLocalToken,
                currUser,
                setLocalCurrUser,
                fireUser,
                setFireUser,
                currDog,
                setLocalCurrDog,
                dogProfiles,
                setDogProfiles,
                setLocalCurrDogProfiles,
                clearAllStateAndLocalStorage,
                loadUserandDogfromLocalOrApi,
                fetchUserDataWithToken,
                fetchCurrDogProfiles,
                fetchAndSetLocalCurrDogProfiles,
                deleteDogProfile,
                logout
            }}
        >
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;