import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const Dashboard = () => {
  const { aToken, getDashData, dashData } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken, getDashData])

  // Improved date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    
    try {
      // Handle different date formats
      let date;
      
      // If it's already a Date object
      if (dateString instanceof Date) {
        date = dateString;
      } 
      // If it's a string, try to parse it
      else if (typeof dateString === 'string') {
        // Try different date formats
        date = new Date(dateString);
        
        // If still invalid, try parsing as ISO string without timezone issues
        if (isNaN(date.getTime())) {
          // Handle common date formats
          const parts = dateString.split('-');
          if (parts.length === 3) {
            // Assume YYYY-MM-DD format
            date = new Date(parts[0], parts[1] - 1, parts[2]);
          }
        }
      }
      
      // Check if date is valid
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } else {
        return dateString; // Return original if can't parse
      }
    } catch (error) {
      console.log('Date formatting error:', error);
      return dateString; // Return original string if error
    }
  }

  // Simple date display as fallback
  const displayDate = (dateString) => {
    if (!dateString) return "—";
    return dateString; // Just return the raw string
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Debug info */}
      <div className="mb-4 p-2 bg-yellow-100 text-xs rounded">
        Dashboard Data: {dashData ? 'Loaded' : 'Loading...'} | 
        Latest Appointments: {dashData?.latestAppointments?.length || 0}
      </div>
      
      {dashData ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-700">Total Doctors</h3>
              <p className="text-3xl font-bold text-blue-600">{dashData.doctors}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-700">Total Appointments</h3>
              <p className="text-3xl font-bold text-green-600">{dashData.appointments}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-700">Total Patients</h3>
              <p className="text-3xl font-bold text-purple-600">{dashData.patients}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-700">Latest Appointments</h3>
              <p className="text-3xl font-bold text-orange-600">{dashData.latestAppointments?.length || 0}</p>
            </div>
          </div>

          {/* Latest Appointments Table */}
          <div className="bg-white rounded-lg shadow-md border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Latest Appointments</h2>
              <p className="text-gray-600 text-sm">Most recent 5 appointments</p>
            </div>
            
            {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fees
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashData.latestAppointments.map((appointment, index) => (
                      <tr key={appointment._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.userData?.name || "Unknown"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.userData?.email || ""}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.docData?.name || "—"}</div>
                          <div className="text-sm text-gray-500">{appointment.docData?.speciality || ""}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {displayDate(appointment.slotDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appointment.slotTime || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Rs. {appointment.amount || appointment.fees || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No recent appointments found.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard