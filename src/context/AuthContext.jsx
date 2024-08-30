import axios from 'axios';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, setLocalToken, removeToken } from "../utils/token";
import { backEndUrl } from "../utils/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const backendUrl = backEndUrl;
    const [user, setUser] = useState({
        id: '',
        owner_email: '',
        password: '',
        owner_name: '',
        owner_phone: '',
    });
    const [fireUser, setFireUser ] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    //fetchUser Uses token passed in to function to setUser information
    const fetchUser = async (token) => {
        try {
            const response = await axios.get(`${backendUrl}/owners`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
    const loginUserBE = async (owner_email, password) => {
        try {
            const response = await fetch(`${backEndUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ owner_email, password }),
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
        <AuthContext.Provider value={{ backEndUrl, user, setUser, fireUser, setFireUser, loginUserBE, loading, setLoading, handleLogout, handleTokenError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

