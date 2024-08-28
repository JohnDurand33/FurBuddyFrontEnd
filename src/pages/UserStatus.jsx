import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserStatus = () => {
    const { user } = useAuth();  // Pull the user state from AuthContext

    return (
        <div>
            {user ? (
                <div>
                    <h2>User</h2>
                    <p>{user}</p>
                </div>
            ) : (
                <h2>No User Logged In</h2>
            )}
        </div>
    );
};

export default UserStatus;