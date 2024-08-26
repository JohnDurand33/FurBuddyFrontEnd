import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, setLocalToken, removeToken } from "../utils/token";
import { backEndUrl } from "../utils/config";
import TokenRequiredApiCall from "../utils/TokenRequiredApiCall";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (token) {
            fetchUser(token);
        }
    }, []);

    //fetchUser Uses token passed in to function to setUser information
    const fetchUser = async (token) => {
        try {
            setLoading(true)
            const response = await TokenRequiredApiCall.get(`/owner/`);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            handleTokenError();
        } finally {
            setLoading(false)
        }
    };

    // authenicateUser handles 
    const authenticateUser = async (endpoint, userData) => {
        setLoading(true)
        removeToken();
        setUser(null)

        try {
            const response = await axios.post(endpoint, userData);

            const token = response.data.token;

            setLocalToken(token);
            await fetchUser(token);
            navigate('/dashboard');
        } catch (error) {
            console.error(`An error occurred during ${endpoint.split('/').pop()}`)
        }
    };

    const handleLogout = () => {
        removeToken();
        setUser(null);
        navigate('/login');
    };

    const handleTokenError = () => {
        removeToken();
        setUser(null);
        navigate('login');
        alert('Session expired. Please login again')
    }

    return (
        <AuthContext.Provider value={{ backEndUrl, user, setUser, fetchUser, loading, setLoading, authenticateUser, handleLogout, handleTokenError }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

