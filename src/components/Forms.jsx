import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import apiClient, { apiBaseUrl } from '../lib/apiClient';
import backgroundImage from '../assets/beams-basic.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { Link } from 'react-router-dom';

function Forms(props) {
  const [showPassword, setShowPassword] = useState(false);
  const showForgotPassword = props.button === 'Sign in';
  const navigate = useNavigate(); // Initialize useNavigate
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    
    try {
      const formData = {
        email: e.target.elements.email.value,
        password: e.target.elements.password.value,
      };

      console.log('Attempting login with:', { email: formData.email }); // Log attempt

      const response = await apiClient.post('/api/login', formData);
      console.log('Login response:', response.data); // Log response

      if (response.data.success) {
        const user = response.data.user;
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }
        props.setUserDetails({
          name: user.name,
          email: user.email,
          created_at: new Date(user.createdAt).toLocaleDateString()
        });
        props.setIsLoggedIn(true);
        navigate('/authenticated-area');
      } else {
        alert(response.data.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert(error.response.data.message || 'Invalid credentials. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        alert(`Could not connect to the server at ${apiBaseUrl}. Please ensure the backend is running.`);
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('An error occurred. Please try again later.');
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.elements.name.value,
      email: e.target.elements.email.value,
      password: e.target.elements.password.value,
    };

    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.password) {
        alert('Please fill in all fields');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }

      // Password length validation
      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }

      console.log('Attempting registration:', { name: formData.name, email: formData.email });
      
      const response = await apiClient.post('/api/register', formData);
      
      if (response.data.success) {
        console.log('Registration successful');
        navigate('/registration-success');
      } else {
        alert(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        // Server responded with an error
        if (error.response.status === 400 && error.response.data.message === 'User already exists') {
          alert('An account with this email already exists. Please sign in or use a different email.');
        } else {
          alert(error.response.data.message || 'Registration failed. Please try again.');
        }
      } else if (error.request) {
        // No response received
        alert(`Could not connect to the server at ${apiBaseUrl}. Please ensure the backend is running.`);
      } else {
        // Request setup error
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">{props.formtitle}</h2>
              <form onSubmit={props.button === 'Sign up' ? handleSubmit : handleSubmitLogin}>
                {!showForgotPassword && (
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      autoComplete="name"
                      required
                      placeholder="Your name"
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">{props.Password}</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                {showForgotPassword && (
                  <div className="mb-3 text-end">
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-100 mb-3">
                  {props.button}
                </button>

                <div className="text-center">
                  <p className="mb-0">
                    {props.button === 'Sign in' ? "Don't have an account? " : "Already have an account? "}
                    <Link to={props.button === 'Sign in' ? "/sign-up" : "/sign-in"} className="text-decoration-none">
                      {props.button === 'Sign in' ? "Sign up" : "Sign in"}
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forms;
