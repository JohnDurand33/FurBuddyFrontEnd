import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    const location = useLocation();
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
        localStorage.clear();
        setToken(null);
        setCurrUser(null);
        setFireUser(null);
        setCurrDog(null);
        setDogProfiles([]);
         // Clears all stored items
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
            const profile = response.data
            console.log('Fetched user data:', profile);
            setLocalCurrUser(profile); // Store user
            return profile
        } catch (err) {
            console.error('Error fetching user data:', err);
            clearAllStateAndLocalStorage();
            navigate('/login');
        }
    };

    const fetchCurrDogProfiles = async () => {
        try {
            if (authed && token) {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${backEndUrl}/profile/profiles`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Fetched dog profiles:', response.data);
                if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
                    return [];
                } else {
                    const updatedDogProifles = Array.isArray(response.data) ? response.data : [response.data];
                    setLocalCurrDogProfiles(updatedDogProifles);
                    setLocalCurrDog(updatedDogProifles[0]);
                    return updatedDogProifles;
                }
            }
        } catch (error) {
            console.error('Error fetching dog profiles:', error);
            return [];
        } finally {
            setLoading(false);
        }
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
            const {data} = response;
            console.log('Deleted dog data:', data);
        } catch (error) {
            console.error('Error deleting dog profile:', error);
        }
    };

    // Manual refetching method after adding/deleting a dog profile
    const refetchCurrDogProfiles = async () => {
        const updatedProfiles = await fetchCurrDogProfiles();
        if (updatedProfiles.length > 0) {
            const formattedNewProfiles = Array.isArray(updatedProfiles) ? updatedProfiles : [updatedProfiles];
            if (formattedNewProfiles.length === 0) {
                console.log('No dog profiles found');
                setLocalCurrDogProfiles([]);
                setLocalCurrDog({});
                return []
            } else {
                setLocalCurrDogProfiles(formattedNewProfiles);
                setLocalCurrDog(formattedNewProfiles[0]);
                return formattedNewProfiles
            }
        };
    };

    // protection against unauthenticated users
    useEffect(() => {
        if (!authed && !['/login', '/signup'].includes(location.pathname)) {
            logout();
        }
    })

    // Load user and dog profile from localStorage on component mount
    useEffect(() => {
        if (authed && token) {
            setLoading(true);
            fetchCurrDogProfiles();
            setLoading(false);
        };
    }, [token, authed]);

    useEffect(() => {
        console.log('Authed:', authed, 'Current User:', currUser);
    }, [authed, currUser]);

    

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
                setCurrDog,
                setLocalCurrDog,
                dogProfiles,
                setLocalCurrDogProfiles,
                clearAllStateAndLocalStorage,
                fetchUserDataWithToken,
                fetchCurrDogProfiles,
                deleteDogProfile,
                refetchCurrDogProfiles, 
                logout
            }}
        >
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;