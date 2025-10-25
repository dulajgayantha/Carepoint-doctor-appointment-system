// At the top of AppContext.jsx
import { createContext, useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ ADD THIS: Proper login function
    const handleLogin = (newToken, userData = null) => {
        console.log('Logging in with token:', newToken); // Debug log
        setToken(newToken);
        localStorage.setItem('token', newToken); // ✅ Save to localStorage immediately
        
        if (userData) {
            setUserData(userData);
        }
        
        toast.success('Login successful!');
    };

    // Function to fetch user data
    const fetchUserData = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (data.success) {
                setUserData(data.user);
            } else {
                console.log('Failed to fetch user data:', data.message);
                handleLogout();
            }
        } catch (error) {
            console.log('Failed to fetch user data:', error);
            
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                handleLogout();
            } else if (error.response?.status === 404) {
                console.log('Profile endpoint not found');
                setUserData({ name: 'User', email: '' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setToken(null);
        setUserData(null);
        localStorage.removeItem('token');
        toast.info('Logged out successfully');
    };

    const getDoctorsData = useCallback(async () => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
        if (data.success) {
            console.log("✅ CONTEXT: Fetched new doctors data.", data.doctors); // <-- ADD THIS
            setDoctors(data.doctors);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.log(error);
            toast.error(error.response?.data?.message || error.message);
    }
}, [backendUrl]);

    

    useEffect(() => {
        getDoctorsData();
    }, []);

    // Fetch user data when token changes
    useEffect(() => {
        console.log('Token changed:', token); // Debug log
        if (token) {
            fetchUserData();
            // ✅ Remove localStorage.setItem from here to avoid conflicts
        } else {
            setUserData(null);
            setLoading(false);
        }
    }, [token]);

    const value = {
        doctors,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        getDoctorsData,
        userData,
        setUserData,
        fetchUserData,
        loading,
        logout: handleLogout,
        login: handleLogin, // ✅ ADD THIS
        isAuthenticated: !!token // ✅ ADD THIS
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;