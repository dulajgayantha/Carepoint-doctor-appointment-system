import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const backendUrl = import.meta.env.VITE_BACKENDURL
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(null)

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
            toast.error(error.response?.data?.message || error.message)
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
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/appointments', {}, { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments)
                console.log('📋 Appointments loaded:', data.appointments.length)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
            if (data.success) {
                setDashData(data.dashData)
                console.log('📊 Dashboard data:', data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // ✅ FIXED: Simplified cancelAppointment function
    const cancelAppointment = async (appointmentId) => {
        try {
            console.log('🔄 Cancelling appointment:', appointmentId);
            
            const { data } = await axios.post(
                backendUrl + '/api/admin/cancel-appointment',
                { appointmentId },
                { headers: { aToken } }
            );

            console.log('✅ Cancel response:', data);

            if (data.success) {
                toast.success(data.message || 'Appointment cancelled successfully');
                
                // ✅ Simply refresh the appointments list - backend will filter cancelled ones
                getAllAppointments();
                getDashData(); // Refresh dashboard counts
                
                return { success: true };
            } else {
                toast.error(data.message);
                return { success: false, error: data.message };
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to cancel appointment";
            console.error('❌ Cancel error:', errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const value = {
        aToken, setAToken,
        backendUrl, doctors,
        getAllDoctors, changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData, 
        getDashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;