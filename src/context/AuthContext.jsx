import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // User and authentication state
    const [authed, setAuthed] = useState(false);
    const [token, setToken] = useState(null);
    const [currUser, setCurrUser] = useState({});
    const [currUserId, setCurrUserId] = useState(null);
    const [fireUser, setFireUser] = useState(null);

    // Dog profile state
    const [currDog, setCurrDog] = useState({});
    const [currDogId, setCurrDogId] = useState(null);

    const [loadingUser, setLoadingUser] = useState(true); // Loading state for user-related data
    const [loadingDog, setLoadingDog] = useState(true); // Loading state for dog-related data
    const [dogProfiles, setDogProfiles] = useState([]); // State for the dog profiles
    const navigate = useNavigate();
    const updateCurrUser = (currUser) => {
        setCurrUser(currUser);
        localStorage.setItem('currUser', JSON.stringify(currUser));
    };

    const updateCurrUserId = (currUserId) => {
        setCurrUserId(currUserId);
        localStorage.setItem('currUserId', JSON.stringify(currUserId));
    };

    const updateToken = (token) => {
        setToken(token);
        localStorage.setItem('token', JSON.stringify(token));
    };

    const updateCurrDogId = (currDogId) => {
        setToken(currDogId);
        localStorage.setItem('currDogId', JSON.stringify(token));
    };

    const updateCurrDogProfile = (currDogProfile) => {
        setCurrDog(currDogProfile);
        localStorage.setItem('currDogProfile', JSON.stringify(token));
    };

    // Helper to load user/token data from localStorage if state is empty
    const updateEmptyUserStateFromLocalStorage = () => {
            const storedUser = JSON.parse(localStorage.getItem('currUser'));
            if (storedUser) setCurrUser(storedUser);

            const storedUserId = JSON.parse(localStorage.getItem('currUserId'));
            if (storedUserId) setCurrUserId(storedUserId);

        if (!token) {
            const storedToken = JSON.parse(localStorage.getItem('token'));
            if (storedToken) setToken(storedToken);
        }
    };

    // Helper to load dog data from localStorage if state is empty
    const updateEmptyDogStateFromLocalStorage = () => {
        if (!currDog) {
            const storedDog = JSON.parse(localStorage.getItem('currDog'));
            if (storedDog) setCurrDog(storedDog);
        }
        if (!currDogId) {
            const storedDogId = JSON.parse(localStorage.getItem('currDogId'));
            if (storedDogId) setCurrDogId(storedDogId);
        }
    };

    // API call to fetch user data (e.g., token, currUser, currUserId)
    const fetchUserDataFromApi = async () => {
        try {
            setLoadingUser(true);
            const response = await fetch('/api/user-data'); // Replace with actual API URL
            const data = await response.json();
            if (data.owner) {
                setCurrUser(data.owner);
                localStorage.setItem('currUser', JSON.stringify(data.owner));
            }
            if (data.owner.id) {
                setCurrUserId(data.owner.id);
                localStorage.setItem('currUserId', JSON.stringify(data.owner.id));
            }
            if (data.auth_token) {
                setToken(data.auth_token);
                localStorage.setItem('token', JSON.stringify(data.auth_token));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoadingUser(false);
        }
    };

    // API call to fetch dog profile data (e.g., currDog, currDogId)
    const fetchDogProfileFromApi = async () => {
        try {
            setLoadingDog(true);
            const response = await fetch(`/profiles/owner/${currUserId}/profiles`); // Replace with actual API URL
            const data = await response.json();
            if (data) {
                setCurrDog(data);
                localStorage.setItem('currDog', JSON.stringify(data));
            }
            if (data.id) {
                setCurrDogId(data.id);
                localStorage.setItem('currDogId', JSON.stringify(data.dogId));
            }
        } catch (error) {
            console.error('Error fetching dog profile data:', error);
        } finally {
            setLoadingDog(false);
        }
    };

    const clearAllStateAndLocalStorage = () => {
        setAuthed(false);
        setCurrUser(null);
        setCurrUserId(null);
        setToken(null);
        setCurrDog(null);
        setCurrDogId(null);
        localStorage.clear();
    };

    const logout = () => {
        clearAllStateAndLocalStorage();
        navigate('/login');
    };


        // Load user/token data and dog profile data separately from localStorage and optionally call API
        useEffect(() => {
            updateEmptyUserStateFromLocalStorage();
            setLoadingUser(false)// Load user data from localStorage
         // Optionally refresh user data from API
        }, []);

    useEffect(() => {
        updateEmptyDogStateFromLocalStorage();
        setLoadingDog(false)// Load dog profile from localStorage
        // Optionally refresh dog profile from API
        }, []);

        return (
            <AuthContext.Provider
                value={{
                    authed,
                    setAuthed,
                    token,
                    setToken,
                    currUser,
                    setCurrUser,
                    currUserId,
                    setCurrUserId,
                    fireUser,
                    setFireUser,
                    currDog,
                    currDogId,
                    dogProfiles,
                    updateCurrUser,
                    updateCurrUserId,
                    updateToken,
                    updateCurrDogId,
                    updateCurrDogProfile,
                    setDogProfiles,
                    clearAllStateAndLocalStorage,
                    updateEmptyUserStateFromLocalStorage,
                    updateEmptyDogStateFromLocalStorage,
                    fetchUserDataFromApi, // Expose API fetch for user
                    fetchDogProfileFromApi, // Expose API fetch for dog
                    loadingUser, // Separate loading state for user data
                    loadingDog,  // Separate loading state for dog profile data
                    setLoadingUser,
                    setLoadingDog,
                    logout
                }}
            >
                {loadingUser || loadingDog ? <div>Loading...</div> : children}
            </AuthContext.Provider>
        );
    };

export default AuthProvider;