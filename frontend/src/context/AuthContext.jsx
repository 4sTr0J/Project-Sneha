import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token) {
            if (token === 'demo-token' && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                    setLoading(false);
                    return;
                } catch (e) {}
            }
            try {
                const userData = await authService.verifyToken();
                setUser(userData);
            } catch (error) {
                if (token !== 'demo-token') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser(data);
        return data;
    };

    const guestLogin = () => {
        const mockUser = {
            id: 'demo-user',
            _id: 'demo-user',
            name: 'Guest User',
            email: 'guest@example.com',
            token: 'demo-token'
        };
        localStorage.setItem('token', mockUser.token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
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
        <AuthContext.Provider value={{ user, loading, login, guestLogin, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
