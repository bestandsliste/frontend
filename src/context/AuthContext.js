import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    };
                    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, config);
                    setUser(data);
                } catch (error) {
                    console.error('Fehler beim Laden des Benutzers:', error);
                    setUser(null);
                }
            }
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
