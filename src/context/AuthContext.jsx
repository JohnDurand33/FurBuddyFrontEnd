import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backEndUrl } from "../utils/config";
import { removeToken, setLocalToken, getToken, removeUserId, setLocalUserId, getUserId } from "../utils/localStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const backendUrl = backEndUrl;
    const [user, setUser] = useState({});
    const [userId, setUserId] = useState();
    const [fireUser, setFireUser ] = useState(null);
    const [loading, setLoading] = useState(false);
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

    const handleLogout = () => {
        removeToken();
        setFireUser(null);
        setUser(null);
        setUserId(null);
        navigate('/login');
    };

    const handleTokenError = () => {
        removeToken();
        setUser(null);
        setFireUser(null);  
        navigate('/login');
        alert('Session expired. Please login again')
    }

    return (
        <AuthContext.Provider value={{ backEndUrl, user, setUser, userId, setUserId, fireUser, setFireUser, loginUserBE, loading, setLoading, handleLogout, handleTokenError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

