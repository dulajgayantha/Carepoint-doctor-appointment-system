import React from 'react'
import Header from '../components/Header'
import SpecialityMenue from '../components/SpecialityMenue'
import TopDoctors from '../components/TopDoctors'
const Home = () => {
  return (
    <div>
      <Header/>
      <SpecialityMenue />
      <TopDoctors />
    </div>
  )
}

export default Home