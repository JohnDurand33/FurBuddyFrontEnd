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
    const fetchUserDataWithToken = async (token) => {
        try {
            const response = await axios.get(`${backEndUrl}/owner/owners/current`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const profiles = Array.isArray(response.data) ? response.data : [response.data];
            setLocalCurrUser(profiles); // Store user
            return profiles
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
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Fetched dog profiles:', response.data);
                response.data = Array.isArray(response.data) ? response.data : [response.data];
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching dog profiles:', error);
            return [];
        }
    };

    const fetchAndSetLocalCurrDogProfiles = async () => {
        if (authed && token && dogProfiles.length === 0) {
            const newCurrDogProfiles = await fetchCurrDogProfiles();
            console.log('updatedCurrDogRecords:', newCurrDogProfiles);
            if (newCurrDogProfiles && newCurrDogProfiles.length > 0) {
                setLocalCurrDogProfiles(newCurrDogProfiles);
                setLocalCurrDog(newCurrDogProfiles[0]);
                console.log('formatted updated CurrDogProfiles:', newCurrDogProfiles);
                console.log('currDog:', newCurrDogProfiles[0]);
            } else {
                console.log('No dog profiles found');
                setLocalCurrDogProfiles([]);
                setLocalCurrDog({});
            }
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
            data = response.data;
            console.log('Deleted dog data:', data);
        } catch (error) {
            console.error('Error deleting dog profile:', error);
        }
    };

    // Manual refetching method after adding/deleting a dog profile
    const refetchCurrDogProfiles = async () => {
        const updatedProfiles = await fetchCurrDogProfiles();
        if (updatedProfiles.length === 0) {
            setLocalCurrDog({});
            setLocalCurrDogProfiles([]);
            console.log('No dog profiles found');   
        } else {
            const formattedNewProfiles = Array.isArray(updatedProfiles) ? updatedProfiles : [updatedProfiles];
            setLocalCurrDogProfiles(formattedNewProfiles);
            setLocalCurrDog(formattedNewProfiles[0]);
            console.log('successfully updated dog profiles:', formattedNewProfiles);
        }
        return updatedProfiles;
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
                setCurrDog,
                setLocalCurrDog,
                dogProfiles,
                setLocalCurrDogProfiles,
                clearAllStateAndLocalStorage,
                fetchUserDataWithToken,
                fetchCurrDogProfiles,
                fetchAndSetLocalCurrDogProfiles,
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