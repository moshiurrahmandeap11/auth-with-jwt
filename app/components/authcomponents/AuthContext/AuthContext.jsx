// context/AuthContext.jsx
"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../../shared_components/AxiosInstance/AxiosInstance';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on initial load
    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');
                
                if (token && storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    
                    // Fetch latest user data from API
                    const res = await axiosInstance.get(`/users/${parsedUser.id}`);
                    if (res.data.success) {
                        setUser(res.data.data);
                    } else {
                        // If API fails, use stored user data
                        setUser(parsedUser);
                    }
                }
            } catch (error) {
                console.error("Error loading user:", error);
                // Clear invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = (userData, token) => {
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state immediately
        setUser(userData);
    };

    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Update state immediately
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};