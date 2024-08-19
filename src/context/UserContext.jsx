import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const signUp = (userData) => {
        setUser(userData);
        console.log('User signed up:', userData);
    };

    const logIn = (userData) => {
        setUser(userData);
        console.log('User logged in:', userData);
    };

    return (
        <UserContext.Provider value={{ user, signUp, logIn }}>
            {children}
        </UserContext.Provider>
    );
};