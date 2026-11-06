import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const userData = await authService.verifyToken();
                setUser(userData);
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser(data);
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data);
        return data;
    };

    const updateProfile = async (userData) => {
        const data = await authService.updateProfile(userData);
        setUser(data);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
