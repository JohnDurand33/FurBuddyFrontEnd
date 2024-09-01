import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backEndUrl } from "../utils/config";
import { removeToken, setLocalToken, getToken, removeUserId, setLocalUserId, getUserId, removeCurrDogId, setLocalCurrDogId, getCurrDogId, removeUser, setLocalUser, getUser } from "../utils/localStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const backendUrl = backEndUrl;
    const [token, setToken ] = useState();
    const [user, setUser] = useState({});
    const [currDogId, setCurrDogId] = useState();
    const [fireUser, setFireUser] = useState(null);
    const [dogProfile, setDogProfile] = useState({});
    const [dogProfiles, setDogProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState();
    const navigate = useNavigate();

    const loginUserBE = async () => {
        try {
            const response = await fetch(`${backEndUrl}/owners/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (response.ok) {
                const data = await response.json();
                setLocalToken('authToken', data.token);
                console.log('ok', data);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const localCurrDogIdStateSetter = () => {
            const dogId = getCurrDogId();
            setCurrDogId(dogId);
        };
    };

    const localTokenStateSetter = () => {
        const currToken = getToken();
        setToken(currToken);
        };

    const localUserIdStateSetter = () => {
        const uId = getUserId();
        setUserId(uId);
        };

    const localStateSetter = () => {
        if (!token) {
            localTokenStateSetter();
        } else if (!userId) {
            localUserIdStateSetter();
        } else if (!currDogId) {
            localCurrDogIdStateSetter();
        }
    };

    const currUserStateSetter = () => {
        if (!user) {
            const user = getUser();
            setUser(user);
        };
    };


    const handleLogout = () => {
        removeToken();
        setFireUser(null);
        setUser(null);
        setUserId(null);
        navigate('/login');
    };

    const handleTokenError = () => {
        removeToken();
        removeUserId();
        removeCurrDogId();
        removeUserId();
        setUser(null);
        setFireUser(null);  
        setUserId(null);
        setUser(null)
        setCurrDogId(null);
        navigate('/login');
        alert('Session expired. Please login again')
    }

    return (
        <AuthContext.Provider value={{ token, setToken, backEndUrl, user, setUser, userId, setUserId, fireUser, setFireUser, currDogId, setCurrDogId, dogProfile, setDogProfile, dogProfiles, setDogProfiles, loginUserBE, loading, setLoading, handleLogout, handleTokenError, currUserStateSetter, localStateSetter  }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

