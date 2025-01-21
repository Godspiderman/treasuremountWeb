"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { API_URL } from "@/app/services/useAxiosInstance";

function VendorPage() {
    const router = useRouter();
    const userId = useSelector((state) => state.auth.user?.userId || null);

    const [errors, setErrors] = useState({});
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [formData, setFormData] = useState({
        shopName: '',
        contactDetails: '',
        taxId: '',
        registrationNumber: '',
        city: '',
        address: '',
        gstNumber: '',
        countryId: '',
        stateId: ''
    });

    useEffect(() => {
        fetchCountryData();
        fetchStateData();
    }, []);

    const fetchCountryData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/public/country/getAll`);
            const data = await response.json();
            setCountryData(data);
            console.log('Country Data:', data);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchStateData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/public/state/getAll`);
            const data = await response.json();
            setStateData(data);
            console.log('State Data:', data);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Clear the error for the specific field if the user types in it
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            if (newErrors[name]) {
                delete newErrors[name]; // Remove error for the specific field
            }
            return newErrors;
        });
    
        // Update the form data
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    

    const handleCancel = () => {
        router.push("/pages/Profile");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation (if needed, add more complex validation)
        const newErrors = {};
        if (!formData.shopName) newErrors.shopName = 'Shop Name is required.';
        if (!formData.contactDetails) {
            newErrors.contactDetails = 'Contact Number is required.';
        } else if (formData.contactDetails && !/^\d{10}$/.test(formData.contactDetails)) {
            newErrors.contactDetails = 'Contact number must be exactly 10 digits.';
        }
        if (!formData.city) newErrors.city = 'City is required.';
        if (!formData.taxId) newErrors.taxId = 'Tax Id is required.';
        if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration Number is required.';
        if (!formData.address) newErrors.address = 'Address is required.';
        if (!formData.gstNumber) newErrors.gstNumber = 'GST Number is required.';
        if (!formData.countryId) newErrors.countryId = 'Country is required.';
        if (!formData.stateId) newErrors.stateId = 'State is required.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Return early if there are validation errors
        }

        // Prepare the data to be sent in the request body
        const payload = {
            ...formData,
            userId,
            activeStatus: true,
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString()
        };

        try {
            const response = await fetch(`${API_URL}/api/public/vendor/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to create vendor');
            }

            // Clear form data after successful submission
            setFormData({
                shopName: '',
                contactDetails: '',
                taxId: '',
                registrationNumber: '',
                city: '',
                address: '',
                gstNumber: '',
                countryId: '',
                stateId: ''
            });

            // Redirect to profile page on successful submission
            router.push("/pages/Profile");

        } catch (error) {
            console.error('Error creating vendor:', error);
            setErrors({ form: 'Error submitting the form. Please try again later.' });
        }
    };

    return (
        <div className='vendorpage'>
            <div className='vendorpage-container'>
                <div className='vendorpage-contents'>
                    <div className='vendorpage-head'>
                        <h2>Become a Vendor</h2>
                    </div>
                    <div className='pet-page-contents'>
                        <div className='pet-page-content'>
                            <form onSubmit={handleSubmit}>
                                <div className='content1-form'>
                                    {errors.form && <span className="error-text">{errors.form}</span>}
                                    <div className='content1-form-inputs'>
                                        <div className="form2">
                                            <label>Shop Name</label>
                                            <input
                                                className="content-input"
                                                name="shopName"
                                                type="text"
                                                placeholder="Enter shop name"
                                                value={formData.shopName}
                                                onChange={handleInputChange}
                                            />
                                            {errors.shopName && <span className="error-text">{errors.shopName}</span>}
                                        </div>
                                        <div className="form2">
                                            <label>Contact Number</label>
                                            <input
                                                className="content-input"
                                                name="contactDetails"
                                                placeholder="Enter contact number"
                                                value={formData.contactDetails}
                                                onChange={handleInputChange}
                                            />
                                            {errors.contactDetails && <span className="error-text">{errors.contactDetails}</span>}
                                        </div>
                                    </div>
                                    <div className='content1-form-inputs'>
                                        <div className="form2">
                                            <label>Tax Id</label>
                                            <input
                                                className="content-input"
                                                name="taxId"
                                                placeholder="Enter tax id"
                                                value={formData.taxId}
                                                onChange={handleInputChange}
                                            />
                                            {errors.taxId && <span className="error-text">{errors.taxId}</span>}
                                        </div>
                                        <div className="form2">
                                            <label>Registration Number</label>
                                            <input
                                                className="content-input"
                                                name="registrationNumber"
                                                placeholder="Enter reg number"
                                                value={formData.registrationNumber}
                                                onChange={handleInputChange}
                                            />
                                            {errors.registrationNumber && <span className="error-text">{errors.registrationNumber}</span>}
                                        </div>
                                    </div>
                                    <div className='content1-form-inputs'>
                                        <div className="form2">
                                            <label>City</label>
                                            <input
                                                className="content-input"
                                                name="city"
                                                placeholder="Enter city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                            />
                                            {errors.city && <span className="error-text">{errors.city}</span>}
                                        </div>
                                        <div className="form2">
                                            <label>Address</label>
                                            <input
                                                className="content-input"
                                                name="address"
                                                placeholder="Enter Address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                            {errors.address && <span className="error-text">{errors.address}</span>}
                                        </div>
                                    </div>
                                    <div className='content1-form-inputs'>
                                        <div className="form2">
                                            <label>GST Number</label>
                                            <input
                                                className="content-input"
                                                name="gstNumber"
                                                placeholder="Enter GST Number"
                                                value={formData.gstNumber}
                                                onChange={handleInputChange}
                                            />
                                            {errors.gstNumber && <span className="error-text">{errors.gstNumber}</span>}
                                        </div>
                                        <div className="form2">
                                            <label>Country</label>
                                            <select
                                                name="countryId"
                                                value={formData.countryId}
                                                onChange={handleInputChange}
                                                className={`content-input ${errors.countryId ? 'error' : ''}`}
                                            >
                                                <option value="">Select Country</option>
                                                {countryData.map((country) => (
                                                    <option key={country.id} value={country.id}>
                                                        {country.countryName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.countryId && <span className="error-text">{errors.countryId}</span>}
                                        </div>
                                    </div>
                                    <div className='content1-form-inputs'>
                                        <div className="form2">
                                            <label>State</label>
                                            <select
                                                name="stateId"
                                                value={formData.stateId}
                                                onChange={handleInputChange}
                                                className={`content-input ${errors.stateId ? 'error' : ''}`}
                                            >
                                                <option value="">Select State</option>
                                                {stateData
                                                    .filter((state) => state.countryId === parseInt(formData.countryId))
                                                    .map((state) => (
                                                        <option key={state.id} value={state.id}>
                                                            {state.stateName}
                                                        </option>
                                                    ))}
                                            </select>
                                            {errors.stateId && <span className="error-text">{errors.stateId}</span>}
                                        </div>
                                    </div>
                                    <div className="btn-container">
                                        <div className='content-btn'>
                                            <button type="button" className="cancel-btn" onClick={handleCancel}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="update-btn">
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VendorPage;
