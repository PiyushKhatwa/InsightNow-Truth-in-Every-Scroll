import React, { useState } from 'react'
import Navbar from './components/Navbar'
import NewsItems from './components/NewsItems'
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import Forms from './components/Forms'
import google from '../src/assets/google.png'
import facebook from '../src/assets/facebook.png'
import backgroundImage from '../src/assets/beams-basic.png'
import Subscribe from './components/Subscribe'
import RegistrationSuccess from './components/RegistrationSucces'
import ProfileDetail from './components/ProfileDetail'
import About from './components/About'


function App() {
  const[category,setCategory]=useState("general")
  const[country,setCountry]=useState('in');
  const[isLoggedIn,setIsLoggedIn]=useState(false);
  const[userDetails,setUserDetails]=useState(null)
  return (
    <>
    <BrowserRouter>
    <div 
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
    
     >


    <Navbar setCountry={setCountry} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userDetails={userDetails}/>
    
   
    
    <Routes>
    <Route path="/sign-in" element={<Forms formtitle='Sign-In Using Your Account' button='Sign in' Password='Password' google={google}  facebook={facebook} setIsLoggedIn={setIsLoggedIn} setUserDetails={setUserDetails}/>}/>
    <Route path="/sign-up" element={<Forms formtitle='Create A New Account' button='Sign up' Password='Create Password' google={google}  facebook={facebook}/>} />
    <Route path="/" element={<NewsItems category={category} setCategory={setCategory} country={country} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
    <Route path='/subscribe' element={<Subscribe/>}></Route>
    <Route path='/registration-success' element={<RegistrationSuccess title={'Registration Succesfull !!'} msg={'Thank You For Registering To NewziFy'}/>}/>
    <Route path='/authenticated-area' element={<RegistrationSuccess title={'Logged In Succesfully !!'} msg={'Welcome To NewziFy'} setIsLoggedIn={setIsLoggedIn}/>}/>
    <Route path='/profileDetail' element={<ProfileDetail userDetails={userDetails}/>}/>
    <Route path='/about' element={<About/>}/>
    </Routes>
    </div>

    
     </BrowserRouter> 
    
    </>
  )
}

export default App
