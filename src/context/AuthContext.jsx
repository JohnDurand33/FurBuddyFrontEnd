import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    
    setLocalToken,
    setLocalUserId,
    setLocalCurrDogId,
    setLocalUser,
    setLocalDogProfile,
    getToken,
    getUserId,
    getCurrDogId,
    getUser,
    getDogProfile,
    clearAllLocalStorage,
} from "../utils/localStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [currDogId, setCurrDogId] = useState(null);
    const [dogProfile, setDogProfile] = useState({});
    const [fireUser, setFireUser] = useState(null); 
    const [authed, setAuthed] = useState(false);


    // Individual setter for user state
    const updateUser = (newUser) => {
        setUser(newUser);
        setLocalUser(newUser);
    }


    const updateUserId = (newUserId) => {
        setUserId(newUserId);
        setLocalUserId(newUserId);
    }


    const updateToken = (newToken) => {
        setToken(newToken);
        setLocalToken(newToken);
    };


    const updateCurrDogId = (newCurrDogId) => {
        setCurrDogId(newCurrDogId);
        setLocalCurrDogId(newCurrDogId);
    };


    const updateDogProfile = (newDogProfile) => {
        setDogProfile(newDogProfile);
        setLocalDogProfile(newDogProfile); 
    };

    // Function to clear all state and localStorage
    const clearAllStateAndLocalStorage = () => {
        setToken(null);
        setUserId(null);
        setUser(null);
        setCurrDogId(null);
        setDogProfile(null);
        clearAllLocalStorage();
    };

    // Function to initialize state from localStorage if empty
    const updateEmptyStateFromLocalStorage = () => {
        if (!token) {
            const storedToken = getToken();
            if (storedToken) {
                console.log("Token loaded from localStorage");
                setToken(storedToken);
            }
        }
        if (!userId) {
            const storedUserId = getUserId();
            if (storedUserId) {
                console.log("UserId loaded from localStorage");
                setUserId(storedUserId);
            }
        }
        if (!currDogId) {
            const storedCurrDogId = getCurrDogId();
            if (storedCurrDogId) {
                console.log("Current Dog ID loaded from localStorage");
                setCurrDogId(storedCurrDogId);
            }
        }
        if (!user) {
            const storedUser = getUser();
            if (storedUser) {
                console.log("User loaded from localStorage");
                setUser(storedUser);
            }
        }
        if (!dogProfile) {
            const storedDogProfile = getDogProfile();
            if (storedDogProfile) {
                console.log("Dog Profile loaded from localStorage");
                setDogProfile(storedDogProfile);
            }
        }
    };

    // Function to update all states and localStorage entries
    const updateAll = ({ newUser, newUserId, newToken, newCurrDogId, newDogProfile }) => {
        if (newUser !== undefined) updateUser(newUser);
        if (newUserId !== undefined) updateUserId(newUserId);
        if (newToken !== undefined) updateToken(newToken);
        if (newCurrDogId !== undefined) updateCurrDogId(newCurrDogId);
        if (newDogProfile !== undefined) updateDogProfile(newDogProfile);
    };

    return (
        <AuthContext.Provider
            value={{
                authed,
                setAuthed,
                user,
                setUser,
                setLocalUser,
                userId,
                setUserId,
                setLocalUserId,
                token,
                setToken,
                setLocalToken,
                currDogId,
                setCurrDogId,
                setLocalCurrDogId,
                dogProfile,
                setDogProfile,
                setLocalDogProfile,
                fireUser,
                setFireUser,
                updateUser,         
                updateUserId,      
                updateToken,        
                updateCurrDogId,   
                updateDogProfile,   
                updateAll,          
                clearAllStateAndLocalStorage,  
                updateEmptyStateFromLocalStorage,  
                getToken,           
                getUserId,          
                getCurrDogId,      
                getUser,            
                getDogProfile,     

            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);