import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/beams-basic.png'
import navProfileIcon from '../assets/navProfileIcon.png'
import {toast} from "react-toastify"
function Navbar(props) {
  const [defaultCountry, selectedCountry] = useState('India');
  const toggleCountry = (countryCode, countryName) => {
    props.setCountry(countryCode);
    selectedCountry(countryName);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    props.setIsLoggedIn(false);
    if (props.setUserDetails) {
      props.setUserDetails(null);
    }
    toast.success("Logged Out Successfully !!");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border sticky-top "
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'center',
       paddingRight:'1rem',
       paddingLeft:'1rem'
      }}>
      <div className="container-fluid">
        <Link className="navbar-brand mx-4" href="#"><h5>InsightNow – Truth in Every Scroll</h5></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <ul className="navbar-nav  ">
            <li className="nav-item mt-1">
              <h5>
                <Link className="nav-link active mx-2 " aria-current="page" to='/'>Home</Link>
              </h5>
            </li>
            <li className="nav-item mt-1">
              <h5>
                <Link className="nav-link active mx-2" aria-current="page" to="/about">About</Link>
              </h5>
            </li>
            <li className="nav-item mt-1">
              <h5>
                <Link className="nav-link mx-2 " to="/subscribe">Subscribe</Link>
              </h5>
            </li>
            <li>
              <div className="btn-group p-1">
                {!props.isLoggedIn ? (
                  <button type="button" className="btn btn-outline-dark dropdown-toggle disabled mx-2" data-bs-toggle="dropdown" aria-expanded="false">
                    {defaultCountry}
                  </button>
                ) : (
                  <button type="button" className="btn btn-outline-dark dropdown-toggle " data-bs-toggle="dropdown" aria-expanded="false">
                    {defaultCountry}
                  </button>
                )}
                <ul className="dropdown-menu ">
                  <li><button type="button" className="dropdown-item" onClick={() => toggleCountry('in', 'India')}>India</button></li>
                  <li><button type="button" className="dropdown-item" onClick={() => toggleCountry('us', 'USA')}>USA</button></li>
                  <li><button type="button" className="dropdown-item" onClick={() => toggleCountry('cn', 'China')}>China</button></li>
                  <li><button type="button" className="dropdown-item" onClick={() => toggleCountry('ru', 'Russia')}>Russia</button></li>
                  <li><button type="button" className="dropdown-item" onClick={() => toggleCountry('jp', 'Japan')}>Japan</button></li>
                  <li><button type="button" className="dropdown-item" onClick={() => toggleCountry('fr', 'France')}>France</button></li>
                  <li><button type="button" className="dropdown-item" onClick={() => toggleCountry('ca', 'Canada')}>Canada</button></li>
                  <li><button type="button" className="dropdown-item" onClick={() => toggleCountry('br', 'Brazil')}>Brazil</button></li>
                  <li><button type="button" className="dropdown-item" onClick={() => toggleCountry('hk', 'Hong Kong')}>Hong Kong</button></li>
                  <li><button type="button" className="dropdown-item" onClick={() => toggleCountry('ae', 'UAE')}>UAE</button></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="form d-flex" role="search">
          {!props.isLoggedIn ? (
            <div>
              <Link to="/sign-in">
                <button className="btn btn-outline-dark m-2" type="submit">Sign In</button>
              </Link>
              <Link to="/sign-up">
                <button className="btn btn-outline-dark m-2" type="submit">Sign Up</button>
              </Link>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={handleLogout}
              >
                Logout
              </button>
              <div className="btn-group dropstart">
              <button type="button" className="btn p-0   dropdown-toggle-split d-flex" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={navProfileIcon} alt="Accept" className="img-fluid mx-auto d-block" style={{ maxWidth: '2.5rem', maxHeight: '2.5rem' }} />
                <span className='p-2'>{props.userDetails.name}</span>
                <span className="visually-hidden">Toggle Dropdown</span>
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/profileDetail">Profile Details</Link></li>
                <li><Link className="dropdown-item" aria-disabled to="#">Change Password</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/" onClick={() => {
                    handleLogout();
                  }}>Log Out</Link>
                </li>
              </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
