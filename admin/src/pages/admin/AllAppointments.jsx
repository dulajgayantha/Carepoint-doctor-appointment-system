import React from 'react';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useEffect } from 'react';

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await cancelAppointment(appointmentId);
      // The context will automatically refresh the list
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  return (
    <div className='w-full max-w-6xl mx-auto my-5'>
      <p className='mb-3 text-lg font-semibold'>All Appointments</p>

      {/* Debug info */}
      <div className="mb-4 p-2 bg-gray-100 text-xs rounded">
        <div>Active Appointments: {appointments?.length || 0}</div>
        <div>Last Updated: {new Date().toLocaleTimeString()}</div>
      </div>

      <div className='bg-white border rounded-lg text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto'>
        
        {/* Grid Header */}
        <div className='hidden sm:grid sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] gap-4 py-3 px-6 border-b font-medium bg-gray-50 text-gray-700'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {/* Loading State */}
        {!appointments ? (
          <div className='flex justify-center items-center h-60 text-gray-500'>
            Loading appointments...
          </div>
        ) : appointments.length > 0 ? (
          appointments.map((item, index) => {
            const formatDate = (dateStr) => {
              if (!dateStr) return '—';
              const [day, month, year] = dateStr.split('_');
              const monthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
              ];
              const monthName = monthNames[parseInt(month) - 1] || '—';
              return `${day} ${monthName} ${year}`;
            };

            const formattedDate = formatDate(item.slotDate);
            const formattedTime = item.slotTime || '—';

            return (
              <div 
                className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] gap-2 sm:gap-4 py-3 px-6 border-b items-center hover:bg-gray-50 transition' 
                key={item._id || index}
              >   
                <div className='max-sm:hidden text-center'>{index + 1}</div>
                
                {/* Patient Info */}
                <div className='flex items-center gap-2'>
                  {item.userData?.image ? (
                    <img 
                      className='w-8 h-8 rounded-full object-cover' 
                      src={item.userData.image} 
                      alt={item.userData?.name || 'Patient'}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium ${item.userData?.image ? 'hidden' : 'block'}`}
                  >
                    {item.userData?.name ? item.userData.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>{item.userData?.name || "Unknown"}</p>
                    <p className='text-xs text-gray-500'>{item.userData?.email || ""}</p>
                  </div>
                </div>

                {/* Age */}
                <div className='text-center'>{item.userData?.age || item.patientAge || "—"}</div>

                {/* Date & Time */}
                <div>
                  <p className='font-medium'>{formattedDate}</p>
                  <p className='text-xs text-gray-500'>{formattedTime}</p>
                </div>

                {/* Doctor Info */}
                <div className='flex items-center gap-2'>
                  {item.docData?.image ? (
                    <img 
                      className='w-8 h-8 rounded-full object-cover' 
                      src={item.docData.image} 
                      alt={item.docData?.name || 'Doctor'}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium ${item.docData?.image ? 'hidden' : 'block'}`}
                  >
                    {item.docData?.name ? item.docData.name.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>{item.docData?.name || "—"}</p>
                    <p className='text-xs text-gray-500'>{item.docData?.speciality || ""}</p>
                  </div>
                </div>

                {/* Fees */}
                <div className='font-medium text-green-600 text-center'>Rs. {item.amount || item.fees || "—"}</div>

                {/* Actions */}
                <div className='text-center'>
                  <button
                    onClick={() => handleCancel(item._id)}
                    className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className='flex justify-center items-center h-60 text-gray-500'>
            No appointments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;