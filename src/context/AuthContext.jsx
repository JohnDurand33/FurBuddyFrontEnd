import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { backEndUrl } from '../utils/config';
import { ensureArray } from '../utils/helpers';
import { clearAllLocalStorage } from '../utils/localStorage';


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
        clearAllLocalStorage();
        navigate('/login');
    };

    const fetchUserDataWithToken = async (token) => {
        try {
            const response = await axios.get(`${backEndUrl}/owner/owners/current`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const profile = await response.data
            if (profile === 1) {
                console.log('Fetched user data:', profile);
                setLocalCurrUser(profile);
            }
            return profile
        } catch (err) {
            console.error('Error fetching user data:', err);
            clearAllLocalStorage();
            navigate('/login');
        }
    };

    const fetchCurrDogProfiles = async (passedToken=token, retry_count = 0) => {
        try {
            setLoading(true);
            setError(null);

            // Delay before attempting the request
            await new Promise(resolve => setTimeout(resolve, 500)); // Adjust the delay as needed

            console.log('Token being used:', passedToken); // Debugging token

            const response = await axios.get(`${backEndUrl}/profile/profiles`, {
                headers: {
                    'Authorization': `Bearer ${passedToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const profiles = ensureArray(response.data);

            if (profiles.length === 0) {
                setLocalDogProfiles([]);
                setLocalCurrDog({});
                return false; // No profiles found
            } else {
                setLocalCurrDogProfiles(profiles);
                setLocalCurrDog(profiles[0]);
                return true; // Profiles found
            }
        } catch (error) {
            // Retry on 401 Unauthorized
            if (error.response?.status === 401 && retry_count < 3) {
                console.log('Error fetching dog profiles, retrying...', error);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Retry after 1 second
                return fetchCurrDogProfiles(retry_count + 1);
            } else {
                console.error('Error fetching dog profiles:', error);
                setError('Error fetching dog profiles');
                return false;
            }
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
            const { data } = response;
            console.log('Deleted dog data:', data);
        } catch (error) {
            console.error('Error deleting dog profile:', error);
        }
    };

    // Load user and dog profile from localStorage on component mount
    useEffect(() => {
        if (token) {  // Ensure the token is set before making the request
            console.log('Token is available, fetching profiles...');
            fetchCurrDogProfiles(token);
        } else {
            console.log('Token is not set, skipping profile fetch');
        }
    }, [token]);

    useEffect(() => {
        if (!authed) {
            clearAllStateAndLocalStorage();
            navigate('/login');
        }
    }, [authed, currUser]);

    

    return (
        <AuthContext.Provider
            value={{
                authed,
                setAuthed,
                token,
                setToken,
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
                fetchUserDataWithToken,
                deleteDogProfile,
                fetchCurrDogProfiles,
                logout,
                clearAllStateAndLocalStorage,
                loading,
                setLoading,
            }}
        >
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;