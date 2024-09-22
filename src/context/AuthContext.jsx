import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { backEndUrl } from '../utils/config';
import { ensureArray } from '../utils/helpers';

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
            const profile = await response.data
            console.log('Fetched user data:', profile);
            setLocalCurrUser(profile); // Store user
            return profile
        } catch (err) {
            console.error('Error fetching user data:', err);
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
                    const updatedProfiles = await ensureArray(response.data);
                    if (updatedProfiles === 0)
                        console.log('No dog profiles found');
                    else {
                        setLocalCurrDogProfiles(updatedProfiles);
                        setLocalCurrDog(updatedProfiles[0]);
                        return updatedProfiles;
                    }
                } else {
                    console.log('No token or authed user');
                }
            } catch (error) {
                console.error('Error fetching dog profiles:', error);
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

        // Manual refetching method after adding/deleting a dog profile
        const refetchCurrDogProfiles = async () => {
            const updatedProfiles = await fetchCurrDogProfiles();
            const ensuredProfiles = ensureArray(updatedProfiles);
            setLocalCurrDogProfiles(ensuredProfiles);
            setLocalCurrDog(ensuredProfiles[0]);
        };


        // Load user and dog profile from localStorage on component mount
        useEffect(() => {
            if (authed && token) {
                setLoading(true);
                refetchCurrDogProfiles();
                setLoading(false);
            };
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
                    deleteDogProfile,
                    refetchCurrDogProfiles,
                    logout
                }}
            >
                {children}
            </AuthContext.Provider>
        );
    };
};

export default AuthProvider;