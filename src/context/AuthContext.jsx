import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backEndUrl } from '../utils/config';

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

    const setLocalDogProfiles = (dogProfiles) => {
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
        setDogProfiles([]);
        localStorage.clear(); // Clears all stored items
    };

    const logout = () => {
        clearAllStateAndLocalStorage();
        navigate('/login');
    };

    const fetchUserDataWithToken = async (token) => {
        try {
            const response = await axios.get(`${backEndUrl}/owner/owners/current`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('Fetched user data:', response.data);
            setLocalCurrUser(response.data); // Store user
            return response.data;
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to fetch user data', err);
            clearAllStateAndLocalStorage();
            navigate('/login');
        }
    };


    const fetchCurrDogProfiles = async (token) => {
            try {
                const response = await axios.get(`${backEndUrl}/profile/profiles`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.data && response.data.length > 0) {
                    console.log('Fetched dog profiles:', response.data);
                    const oneDogList = Array.isArray(response.data) ? response.data : [response.data];
                    return oneDogList
                    };
                } catch (error) {
                    console.error('Error fetching dog profiles:', error);
                    return [];
                }
    };

    const fetchCurrDogRecords = async (currDog) => {
        try {
            const response = await axios.get(`${backEndUrl}/profile/${currDog.id}/records`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.data && response.data.length > 0) {
                console.log('Fetched dog profiles:', response.data);
                const oneDogList = Array.isArray(response.data) ? response.data : [response.data];
                return oneDogList
            };
        } catch (error) {
            console.error('Error fetching dog profiles:', error);
            return [];
        }
    };
    
    const fetchAndSetLocalCurrDogs = async () => {
        if (authed && token && currDog) {
            const newCurrDogProfiles = await fetchCurrDogRecords(currDog);
            console.log('updatedCurrDogRecords:', newCurrDogProfiles);
            if (newCurrDogProfiles) {
                const formattedRecords = Array.isArray(newCurrDogProfiles) ? newCurrDogProfiles : [newCurrDogProfiles];
                setLocalDogProfiles(formattedRecords);
                setLocalCurrDog(formattedRecords[0]);
                console.log('burrDogProfiles:', formattedRecords);
            } else {
                console.log('no records found');
                setLocalDogProfiles([]);
                setLocalCurrDog({});
            }
        };
    };

    const fetchAndSetLocalCurrDogRecords = async () => {
        if (authed && token && currDog) {
            const newCurrDogRecords = await fetchCurrDogRecords(currDog);
            console.log('updatedCurrDogRecords:', newCurrDogRecords);
            if (newCurrDogRecords) {
                const formattedRecords = Array.isArray(newCurrDogRecords) ? newCurrDogRecords : [newCurrDogRecords];
                setLocalDogProfiles(formattedRecords);
                setLocalCurrDog(formattedRecords[0]);
                console.log('currDogRecords:', formattedRecords);
            } else {
                console.log('no records found');
                setLocalDogProfiles([]);
                setLocalCurrDog({});
            }
        };
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
                setLocalDogProfiles(profiles);
                setLocalCurrDog(profiles[0]); // Set the first dog as current
            } else {
                console.log('No dog profiles found for user:', currUser);
            }
        };
        setLoading(false);
    };

    const deleteDogProfile = async (dog) => {
        try {
            const response = await axios.delete(`${backEndUrl}/profile/profiles/${dog.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Deleted dog profile:', response.data);
        } catch (error) {
            console.error('Error deleting dog profile:', error);
        }
    };

    

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
                setLocalDogProfiles,
                clearAllStateAndLocalStorage,
                loadUserandDogfromLocalOrApi,
                fetchUserDataWithToken,
                fetchCurrDogProfiles,
                fetchAndSetLocalCurrDogs,
                fetchAndSetLocalCurrDogRecords,
                deleteDogProfile,
                logout
            }}
        >
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;