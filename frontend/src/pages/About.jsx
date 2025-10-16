import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>
          ABOUT <span className='text=gray-700 font-medium'>US</span>
        </p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="About Us" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>At CarePoint, we believe medical access should be simple and seamless. Our doctor channeling system lets you browse and book appointments online in a few clicks. Choose by specialty, location, or availability — connect directly with trusted physicians who meet your needs and schedule.</p>
          <p>We streamline the process so you don’t have to wait. No more long phone calls, no confusion over time slots. With an intuitive user interface, real-time availability, and instant confirmation, you gain clarity and control over your healthcare journey. Plus, all listed doctors are certified, vetted, and committed to patient-centered care.</p>
          <b className='text-gray-600'>Your Health, Your Way</b>
          <p>Once you’ve booked, you’ll receive reminders, clinic details, and consultation instructions digitally. You can manage or cancel appointments easily if needed. At CarePoint, our mission is to make your health decisions easy, transparent, and respectful of your time.</p>
        </div>
      </div>
      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span> </p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Convenience</b>
          <p>Book appointments anytime, anywhere — no more waiting on hold.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Personalization</b>
          <p>Receive tailored recommendations based on your health needs and preferences.</p>
        </div>
      </div>
    </div>
  )
}

export default About