import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify' // ✅ Add missing import

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, fetchUserData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateUserProfileData = async () => {
    if (!token) {
      toast.error('Please login first')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()

      formData.append('name', userData.name || '')
      formData.append('phone', userData.phone || '')
      formData.append('address', JSON.stringify(userData.address || {}))
      formData.append('gender', userData.gender || '')
      formData.append('dob', userData.dob || '')

      image && formData.append('image', image)

      // ✅ FIX: Use correct header format
      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile', 
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`, // ✅ CORRECT FORMAT
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (data.success) {
        toast.success(data.message)
        await fetchUserData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  // ✅ FIX: Handle button click properly
  const handleSave = () => {
    updateUserProfileData()
  }

  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>

      {
        isEdit
          ? <label htmlFor="image">
            <div className='inline-block relative cursor-pointer'>
              <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
              <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
          </label>
          : <img className='w-36 rounded' src={userData.image} alt="" />
      }

      {
        isEdit
          ? <input className='bg-gray-100 text-3xl font-medium max-w-60 mt-4 p-2 rounded' type="text" value={userData.name || ''} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
          : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      }

      <hr className='bg-zinc-400 h-[1px] border-none' />
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {
            isEdit
              ? <input className='bg-gray-100 max-w-52 p-2 rounded' type="text" value={userData.phone || ''} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
              : <p className='text-blue-400'>{userData.phone || 'Not set'}</p>
          }
          <p className='font-medium'>Address:</p>
          {
            isEdit
              ? <div>
                <input className='bg-gray-50 p-2 rounded w-full mb-2' onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address?.line1 || ''} type="text" />
                <br />
                <input className='bg-gray-50 p-2 rounded w-full' onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address?.line2 || ''} type="text" />
              </div>
              : <p className='text-gray-500'>
                {userData.address?.line1 || 'No address'}
                <br />
                {userData.address?.line2}
              </p>
          }
        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>
          BASIC INFORMATION
        </p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {
            isEdit
              ? <select className='max-w-20 bg-gray-100 p-2 rounded' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender || ''}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              : <p className='text-gray-400'>{userData.gender || 'Not set'}</p>
          }
          <p className='font-medium'>Date of Birth:</p>
          {
            isEdit
              ? <input className='max-w-28 bg-gray-100 p-2 rounded' type="date" value={userData.dob || ''} onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} />
              : <p className='text-gray-400'>{userData.dob || 'Not set'}</p>
          }
        </div>
      </div>
      <div className='mt-10'>
        {
          isEdit
            ? <button 
                className={`border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleSave} // ✅ FIXED: Call the function properly
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Information'}
              </button>
            : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setIsEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}

export default MyProfile