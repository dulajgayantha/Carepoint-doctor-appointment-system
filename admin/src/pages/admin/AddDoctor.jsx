import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import {toast} from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

    const [docImg,setDocImg] = useState(false)
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [experience,setExperience] = useState('1 Years') 
    const [fees,setFees] = useState('')
    const [about,setAbout] = useState('')
    const [speciality,setSpeciality] = useState('General physician')
    const [degree,setDegree] = useState('')
    const [address1,setAddress1] = useState('')
    const [address2,setAddress2] = useState('')
    
    
    const {backendUrl, aToken} = useContext(AdminContext)


    const onSubmitHandler = async (event)=>{
        event.preventDefault()

        try {
            if(!docImg){
                return toast.error("Image not Selected")
            }
            const formData = new FormData()

            formData.append('image',docImg)
            formData.append('name',name)
            formData.append('email',email)
            formData.append('password',password)
            formData.append('experience',experience)
            formData.append('fees',Number(fees))
            formData.append('about',about)
            formData.append('speciality',speciality)
            formData.append('degree',degree)
            formData.append('address',JSON.stringify({line1:address1,line2:address2}))

            //console log formData
            formData.forEach((value,key)=>{
                console.log(`${key}:${value}`)
            })
            const {data} = await axios.post(backendUrl +'/api/admin/add-doctor', formData,{headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }



  // Common styles 
  const inputStyle = "w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
  const labelStyle = "text-sm font-medium text-gray-600 mb-1 block";

  return (
    <form onSubmit={onSubmitHandler} className='p-6 w-full bg-gray-50/70'>
      <h2 className='mb-4 text-xl font-semibold text-gray-800'>Add Doctor</h2>
      
      {/* --- Main Form Container --- */}
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-5xl'>
        
        {/* --- Upload Section --- */}
        <div className='flex items-center gap-4 mb-8'>
          <label htmlFor='doc-img'>
            <img className='w-20 h-20 bg-gray-100 rounded-lg cursor-pointer object-cover' src={docImg? URL.createObjectURL(docImg): assets.upload_area} alt="Upload area" />
          </label>
          <input onChange={(e)=>setDocImg(e.target.files[0])} type='file' id='doc-img' hidden />
          <p className='text-gray-500 text-sm'>
            Upload doctor <br /> picture
          </p>
        </div>

        {/* --- ROW 1: Name and Fees (Swapped) --- */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 mb-6'>
          <div>
            <label htmlFor="doctorName" className={labelStyle}>Doctor name</label>
            <input onChange={(e)=>setName(e.target.value)} value={name} id="doctorName" className={inputStyle} type='text' placeholder='Name' required />
          </div>
          <div>
            <label htmlFor="fees" className={labelStyle}>Fees</label>
            <input onChange={(e)=>setFees(e.target.value)} value={fees} id="fees" className={inputStyle} type='number' placeholder='Fees' required />
          </div>
        </div>

        {/* --- ROW 2: Email and Education --- */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 mb-6'>
          <div>
            <label htmlFor="doctorEmail" className={labelStyle}>Doctor Email</label>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} id="doctorEmail" className={inputStyle} type='email' placeholder='test@carepoint.com' required />
          </div>
          <div>
            <label htmlFor="education" className={labelStyle}>Education</label>
            <input onChange={(e)=>setDegree(e.target.value)} value={degree} id="education" className={inputStyle} type='text' placeholder='Education' required />
          </div>
        </div>
        
        {/* --- ROW 3: Password and Experience --- */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 mb-6'>
          <div>
            <label htmlFor="doctorPassword" className={labelStyle}>Doctor Password</label>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} id="doctorPassword" className={inputStyle} type='password' placeholder='••••••••' required />
          </div>
          <div>
            <label htmlFor="experience" className={labelStyle}>Experience</label>
            <select onChange={(e)=>setExperience(e.target.value)} value={experience} id="experience" className={inputStyle} name='experience'>
              <option value='1 Year'>1 Year</option>
              <option value='2 Years'>2 Years</option>
              <option value='3 Years'>3 Years</option>
              <option value='4 Years'>4 Years</option>
              <option value='5+ Years'>5+ Years</option>
            </select>
          </div>
        </div>

        {/* --- Speciality (Full Width) --- MOVED HERE --- */}
        <div className='mb-6'>
            <label htmlFor="speciality" className={labelStyle}>Speciality</label>
            <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} id="speciality" className={inputStyle} name='speciality'>
              <option value='General physician'>General physician</option>
              <option value='Gynecologist'>Gynecologist</option>
              <option value='Dermatologist'>Dermatologist</option>
              <option value='Pediatricians'>Pediatricians</option>
              <option value='Neurologist'>Neurologist</option>
              <option value='Gastroenterologist'>Gastroenterologist</option>
            </select>
        </div>

        {/* --- Address (Full Width) --- */}
        <div className='mb-6'>
            <label className={labelStyle}>Address</label>
            <div className='flex flex-col gap-2'>
                <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className={inputStyle} type='text' placeholder='address 1' required />
                <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className={inputStyle} type='text' placeholder='address 2' />
            </div>
        </div>

        {/* --- About Doctor (Full Width) --- */}
        <div className='mb-6'>
          <label htmlFor="about" className={labelStyle}>About Doctor</label>
          <textarea onChange={(e)=>setAbout(e.target.value)} value={about} id="about" className={`${inputStyle} h-28`} placeholder='Write about doctor' required />
        </div>

        <button type="submit" className='bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors'>
            Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;