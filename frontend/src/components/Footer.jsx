import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            
        {/* --------Left Section--------- */}
        <div>
            <img className='mb-5 w-40' src={assets.logonew} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>"At CarePoint, we believe that quality healthcare should be accessible to everyone. We connect you with certified specialists for the expert care you deserve."</p>
        </div>

        {/* --------Center Section--------- */}
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Contact us</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        {/* --------Right Section--------- */}
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+415789665</li>
                <li>carepointdev@gmail.com</li>
            </ul>
        </div>
        </div>
        {/** Footer Copyright Section **/}
        <div>
            <p className='py-5 text-sm text-center'>© 2025 CarePoint. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer