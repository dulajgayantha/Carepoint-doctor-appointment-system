import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointment] = useState([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Generate random time between 9:00 AM and 5:00 PM in 30-minute intervals
  const generateRandomTime = () => {
    const hours = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
    const minutes = Math.random() > 0.5 ? '30' : '00';
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours > 12 ? hours - 12 : hours;
    
    return `${displayHour}:${minutes} ${period}`;
  }

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        // Add random times to appointments that don't have slotTime
        const appointmentsWithTimes = data.appointments.map(appointment => ({
          ...appointment,
          // Use existing slotTime if available, otherwise generate random time
          slotTime: appointment.slotTime || generateRandomTime()
        })).reverse();
        
        setAppointment(appointmentsWithTimes)
        console.log('User appointments with times:', appointmentsWithTimes);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointment();
        getDoctorsData();
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  // Open upload modal
  const handlePayOnline = (appointment) => {
    setSelectedAppointment(appointment)
    setShowUploadModal(true)
    setSelectedFile(null)
  }

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }
      setSelectedFile(file)
    }
  }

  // Submit bank slip
  const handleSubmitSlip = async () => {
    if (!selectedFile) {
      toast.error('Please select a bank slip image')
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you would upload to your backend here
      // For now, we'll just simulate the API call and update locally

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update local state to mark payment as submitted
      setAppointment(prev => prev.map(apt =>
        apt._id === selectedAppointment._id
          ? { ...apt, payment: true } // Using your existing 'payment' field
          : apt
      ))

      toast.success('Bank slip submitted successfully! Payment under verification.')
      setShowUploadModal(false)
      setSelectedFile(null)
      setSelectedAppointment(null)

    } catch (error) {
      toast.error('Failed to submit bank slip. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Close modal
  const handleCloseModal = () => {
    setShowUploadModal(false)
    setSelectedFile(null)
    setSelectedAppointment(null)
  }

  useEffect(() => {
    if (token) {
      getUserAppointment()
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>

      {/* Bank Slip Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Bank Slip</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Please upload a clear image of your bank transfer slip for appointment with:
              </p>
              <p className="font-semibold mb-4">Dr. {selectedAppointment?.docData?.name}</p>
              
              {/* Payment Details */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-medium mb-2">Payment Details:</p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Amount:</span> Rs. {selectedAppointment?.amount || selectedAppointment?.fees || "—"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Date:</span> {selectedAppointment && slotDateFormat(selectedAppointment.slotDate)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Time:</span> {selectedAppointment?.slotTime || generateRandomTime()}
                  </p>
                </div>
              </div>

              {/* Bank Account Details */}
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-medium mb-2">Bank Transfer Details:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Bank:</span> Bank of Ceylon</p>
                  <p><span className="font-medium">Account Number:</span> 5456789</p>
                  <p><span className="font-medium">Branch:</span> Colombo 7</p>
                  <p><span className="font-medium">Account Name:</span> MediCare Hospital</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Supported formats: JPG, PNG (Max: 5MB)
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="bankSlip"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="bankSlip"
                  className="cursor-pointer block"
                >
                  {selectedFile ? (
                    <div className="text-green-600">
                      <div className="text-2xl mb-2">✓</div>
                      <p className="font-medium">File Selected</p>
                      <p className="text-sm mt-1">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-2">Click to change file</p>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <div className="text-2xl mb-2">📁</div>
                      <p className="font-medium">Select Bank Slip</p>
                      <p className="text-sm mt-1">Click to choose file</p>
                      <p className="text-xs text-gray-500 mt-2">or drag and drop</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSlip}
                disabled={!selectedFile || isSubmitting}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Slip'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        {appointments.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            No appointments found.
          </div>
        ) : (
          appointments.map((item, index) => (
            <div className={`grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b ${item.cancelled ? 'opacity-60 bg-gray-50' : ''} ${item.payment ? 'border-l-4 border-l-green-500' : ''}`} key={index}>
              <div>
                <img className='w-32 h-32 object-cover rounded-lg bg-indigo-50' src={item.docData.image} alt={`Dr. ${item.docData.name}`} />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold text-lg'>{item.docData.name}</p>
                <p className='text-blue-600'>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-2'>Address:</p>
                <p className='text-xs'>{item.docData?.address?.line1}</p>
                <p className='text-xs'>{item.docData?.address?.line2}</p>
                <p className='text-sm mt-2'>
                  <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>
                  {slotDateFormat(item.slotDate)} | {item.slotTime || generateRandomTime()}
                </p>
                <p className='text-sm mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>Fees:</span> Rs. {item.amount || item.fees || "—"}
                </p>

                {/* Show status */}
                {item.cancelled && (
                  <p className='text-red-600 font-medium mt-2'>Status: Cancelled</p>
                )}
                {item.payment && !item.cancelled && (
                  <p className='text-green-600 font-medium mt-2'>Payment Submitted ✓</p>
                )}
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {/* Pay Online / Submitted Button */}
                {!item.cancelled && !item.payment && (
                  <button
                    onClick={() => handlePayOnline(item)}
                    className='text-sm bg-green-600 text-white text-center sm:min-w-48 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 font-medium'
                  >
                    Pay Now
                  </button>
                )}

                {!item.cancelled && item.payment && (
                  <button
                    className='text-sm bg-gray-500 text-white text-center sm:min-w-48 py-3 rounded-lg cursor-default font-medium'
                    disabled
                  >
                    Payment Submitted
                  </button>
                )}

                {/* Cancel Appointment Button */}
                {!item.cancelled && !item.payment && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='text-sm border border-red-500 text-red-500 text-center sm:min-w-48 py-3 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300'
                  >
                    Cancel Appointment
                  </button>
                )}

                {/* Show cancelled status only for CANCELLED appointments */}
                {item.cancelled && (
                  <button className='sm:min-w-48 py-3 border border-red-500 text-red-600 bg-red-50 rounded-lg cursor-default'>
                    Appointment Cancelled
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyAppointment