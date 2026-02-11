import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
            api.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const refreshUser = async () => {
        try {
            const { data } = await api.get('/auth/profile');
            // Keep the token from the old userInfo if the profile endpoint doesn't return one, 
            // but here our endpoint returns a fresh token or we can reuse the old one.
            // For safety, let's merge with existing token if needed, but our endpoint returns token.
            const updatedUser = { ...data, token: user?.token || data.token };

            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            console.error("Failed to refresh user:", error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
