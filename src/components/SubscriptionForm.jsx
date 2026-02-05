import React, { useState } from 'react';
import backgroundImage from '../assets/beams-basic.png';
import { toast } from "react-toastify";
import apiClient from '../lib/apiClient';

const SubscriptionForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/subscribe', { name, email });
      if (response.status >= 200 && response.status < 300) {
        toast.success("Subscribed To InsightNow!!")
        // Subscription success
        console.log('Subscription success!');
        // Reset form after successful submission
        setName('');
        setEmail('');
      } else {
        toast.error("Failed To Subscribe!")

        // Subscription failed
        console.error('Subscription failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className="border"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="container border mt-5 p-5 rounded" style={{ maxWidth: '50%', margin: 'auto' }}>
        <div>
          <h1 className="text-center mb-4">Subscribe to InsightNow</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control" // Removed margin-bottom to avoid extra space
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-mail address
              </label>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control" // Removed margin-bottom to avoid extra space
              />
            </div>
            <div className="text-center"> {/* Center the button */}
  <div className="col-md-11"> {/* Initial width of 50% on medium screens */}
    <button className="btn btn-outline-danger btn-block" type="submit">
      Subscribe
    </button>
  </div>
</div>


          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;
