import React, { useState } from 'react';
import { toast } from 'react-toastify';
import backgroundImage from '../assets/beams-basic.png';

function Subscribe() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        plan: 'basic'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Here you would typically send the subscription data to your backend
            console.log('Subscription data:', formData);
            toast.success('Subscription successful! We will contact you shortly.');
            setFormData({
                name: '',
                email: '',
                plan: 'basic'
            });
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error('Failed to subscribe. Please try again.');
        }
    };

    return (
        <div className="container mt-5" style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '100vh',
            padding: '2rem'
        }}>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4">Subscribe to InsightNow</h2>
                            <p className="text-center mb-4">Choose a plan that suits your needs</p>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="plan" className="form-label">Select Plan</label>
                                    <select
                                        className="form-select"
                                        id="plan"
                                        name="plan"
                                        value={formData.plan}
                                        onChange={handleChange}
                                    >
                                        <option value="basic">Basic Plan - Free</option>
                                        <option value="premium">Premium Plan - $9.99/month</option>
                                        <option value="enterprise">Enterprise Plan - Contact for pricing</option>
                                    </select>
                                </div>
                                
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary btn-lg">
                                        Subscribe Now
                                    </button>
                                </div>
                            </form>
                            
                            <div className="mt-4">
                                <h4>Plan Features:</h4>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Basic Plan: Access to general news</li>
                                    <li className="list-group-item">Premium Plan: All features + ad-free experience</li>
                                    <li className="list-group-item">Enterprise Plan: Custom solutions for businesses</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Subscribe; 