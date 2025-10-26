import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const backendUrl = import.meta.env.VITE_BACKENDURL
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(null) // Changed from false to null

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message) // Fixed error handling
        }
    }

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message) // Fixed error handling
        }
    }

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/appointments', {}, { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message) // Fixed error handling
        }
    }

    const getDashData = async () => { // Fixed function name (capital D)
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
            if (data.success) {
                setDashData(data.dashData)
                console.log('Dashboard data:', data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message) // FIXED: Changed from data.message to error.message
        }
    }

    const value = {
        aToken, setAToken,
        backendUrl, doctors,
        getAllDoctors, changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        dashData,
        getDashData // Fixed: Changed from getdashData to getDashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;