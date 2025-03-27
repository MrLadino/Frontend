import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers['Authorization'] = `Bearer ${token}`;
            axios.get('/api/users/me')
                .then(response => {
                    setUser(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    setUser(null);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password, rememberMe, adminCode) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password, rememberMe, adminCode });
            const { token } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers['Authorization'] = `Bearer ${token}`;
            setUser(response.data.user);
            return true;
        } catch (error) {
            console.error('Error en el login:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return {
        user,
        loading,
        login,
        logout
    };
};

export default useAuth;
