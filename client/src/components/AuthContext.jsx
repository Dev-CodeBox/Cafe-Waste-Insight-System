import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const publicRoutes = ['/', '/login'];
        if (publicRoutes.includes(location.pathname)) {
            setLoading(false);
            return;
        }
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/authenticate`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    setUser(res.data.user);
                    navigate('/login/insight-board');
                } else {
                    setUser(null);
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Session expired. Please log in again.");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [location.pathname]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#009689]"></div>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
