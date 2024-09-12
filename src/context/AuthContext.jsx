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
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingDog, setLoadingDog] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authed) {
            navigate('/login');
            if (token) {
                fetchUserDataWithToken(token);
            }
        };
    }, [authed]);

    // Helper functions to update state and save to localStorage
    const setLocalToken = (token) => {
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


    const fetchDogProfilesFromApi = async (token) => {
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

    const loadUserandDogfromLocalOrApi = async () => {
        setLoadingUser(true);
        setLoadingDog(true);
        const storedUser = localStorage.getItem('currUser');
        const storedToken = localStorage.getItem('token');
        const storedDog = localStorage.getItem('currDog');

        if (storedUser && storedToken) {
            // Use localStorage if user data is already stored
            setCurrUser(storedUser);
            setToken(storedToken);
        } else if (storedToken) {
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
        if (storedDog) {
            setCurrDog(JSON.parse(storedDog));
        } else {
            const profiles = await fetchDogProfilesFromApi();
            console.log('Fetched dog profiles, could be null if no dogs in db', profiles);
            if (profiles && profiles.length > 0) {
                setLocalDogProfiles(profiles);
                setLocalCurrDog(profiles[0]); // Set the first dog as current
            } else {
                console.log('No dog profiles found for user:', currUser);
            }
        };
        setLoadingUser(false);
        setLoadingDog(false);
    };

    // Load user and dog profile from localStorage on component mount
    useEffect(() => {
        setLoadingUser(true);
        setLoadingDog(true);
        loadUserandDogfromLocalOrApi();
        setLoadingUser(false);
        setLoadingDog(false);
    }, []);

    

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
                loadingUser,
                loadingDog,
                clearAllStateAndLocalStorage,
                loadUserandDogfromLocalOrApi,
                fetchUserDataWithToken,
                fetchDogProfilesFromApi,
                logout
            }}
        >
            {loadingUser || loadingDog ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;