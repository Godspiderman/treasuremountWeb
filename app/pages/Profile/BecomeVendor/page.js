"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { API_URL } from "@/app/services/useAxiosInstance";
import { MdDeleteForever } from 'react-icons/md';

function VendorPage() {
    const router = useRouter();
    const userId = useSelector((state) => state.auth.user?.userId || null);

    const [errors, setErrors] = useState({});
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [formData, setFormData] = useState({
        id: 0,
        imageUrl: null,
        shopName: "",
        contactDetails: "",
        taxId: "",
        registrationNumber: "",
        activeStatus: true,
        address: "",
        city: "",
        gstNumber: "",
        userId: userId,
        postalCode: "",
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        countryId: 0,
        stateId: 0,
    });
    
    

    useEffect(() => {
        fetchCountryData();
        fetchStateData();
    }, []);

    const fetchCountryData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/public/country/getAll`);
            if (!response.ok) {
                throw new Error('Failed to fetch countries');
            }
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
            if (!response.ok) {
                throw new Error('Failed to fetch states');
            }
            const data = await response.json();
            setStateData(data);
            console.log('State Data:', data);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        // Split the name into parts (e.g., "userDTO.firstName" => ["userDTO", "firstName"])
        const nameParts = name.split(".");
    
        // Update the form data
        setFormData((prevData) => {
            const newData = { ...prevData };
    
            // Traverse the nested structure
            let current = newData;
            for (let i = 0; i < nameParts.length - 1; i++) {
                current = current[nameParts[i]];
            }
    
            // Update the final property
            current[nameParts[nameParts.length - 1]] = value;
    
            return newData;
        });
    
        // Clear errors for the field
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            if (newErrors[name]) {
                delete newErrors[name];
            }
            return newErrors;
        });
    };

    const handleCancel = () => {

        setFormData({
            id: 0,
            imageUrl: null,
            shopName: "",
            contactDetails: "",
            taxId: "",
            registrationNumber: "",
            activeStatus: true,
            address: "",
            city: "",
            gstNumber: "",
            userId: 0,
            postalCode: "",
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString(),
            countryId: 0,
            stateId: 0,
        });    

        setErrors({});
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newErrors = {};
    
        if (!formData.shopName.trim()) newErrors.shopName = "Shop Name is required";
    
        if (!formData.contactDetails.trim()) {
            newErrors.contactDetails = "Phone Number are required";
        } else if (!/^\d{10}$/.test(formData.contactDetails)) {
            newErrors.contactDetails = "Phone Number must be exactly 10 digits";
        }
    
        if (!formData.taxId.trim()) newErrors.taxId = "Tax Id is required";
        if (!formData.registrationNumber.trim()) newErrors.registrationNumber = "Registration Number is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
    
        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        } else if (!/^[A-Za-z\s]+$/.test(formData.city)) {
            newErrors.city = "City must contain only alphabetic characters";
        }
    
        if (!formData.countryId) newErrors.countryId = "Country is required";
        if (!formData.stateId) newErrors.stateId = "State is required";
        if (!formData.gstNumber) newErrors.gstNumber = "GST Number is required";
    
        if (!formData.postalCode) {
            newErrors.postalCode = "Postal Code is required";
        } else if (!/^\d{6}$/.test(formData.postalCode)) {
            newErrors.postalCode = "Postal Code must be exactly 6 digits";
        }
        if (!formData.imageUrl) {
            newErrors.imageUrl = "Image is required";
        }
        
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}/api/public/vendor/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create vendor");
            }
    
            setFormData({
                id: 0,
                imageUrl: null,
                shopName: "",
                contactDetails: "",
                taxId: "",
                registrationNumber: "",
                activeStatus: true,
                address: "",
                city: "",
                gstNumber: "",
                userId: 0,
                postalCode: "",
                createdDate: new Date().toISOString(),
                modifiedDate: new Date().toISOString(),
                countryId: 0,
                stateId: 0,
            });
    
            alert("Vendor registered successfully!");
            router.push("/pages/Profile");
        } catch (error) {
            console.error("Error creating vendor:", error);
            if (error.response && error.response.status === 409) {
                alert("The email or phone number already exists. Please use a different one.");
            } else {
                alert("An error occurred while saving the vendor.");
            }
        }
    };
    

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormData((prevState) => ({
          ...prevState,
          image: file,
          imageUrl: URL.createObjectURL(file),
        }));
      };
    
      const handleRemoveImage = () => {
        if (formData.imageUrl) {
            URL.revokeObjectURL(formData.imageUrl);
        }
    
        setFormData((prevData) => ({ ...prevData, imageUrl: "", image: null }));
    
        document.getElementById('imageInput').value = '';
    };
    
    return (
        <div className='vendorpage'>
            <div className='vendorpage-container'>
                <div className='vendorpage-contents'>
                    <div className='vendorpage-head'>
                        <h2>Register a Vendor</h2>
                    </div>
                    <div className='pet-page-contents'>
                        <div className='pet-page-content'>
                        <form onSubmit={handleSubmit}>
                            <div className='content1-form'>
                                {errors.form && <span className="error-text">{errors.form}</span>}
                                
                                <div className='content1-form-inputs'>
                                    <div className="form2">
                                        <label>Shop Name:</label>
                                        <input
                                            name="shopName"
                                            value={formData.shopName}
                                            onChange={handleInputChange}
                                            maxLength={100}
                                            className={`content-input ${errors.shopName ? "error" : ""}`}
                                        />
                                        {errors.shopName && <p className="error">{errors.shopName}</p>}
                                    </div>
                                    <div className="form2">
                                        <label>Phone Number:</label>
                                        <input
                                            name="contactDetails"
                                            value={formData.contactDetails}
                                            onChange={handleInputChange}
                                            maxLength={10}
                                            className={`content-input ${errors.contactDetails ? "error" : ""}`}
                                        />
                                        {errors.contactDetails && <p className="error">{errors.contactDetails}</p>}
                                    </div>
                                </div>
                                
                                <div className='content1-form-inputs'>
                                    <div className="form2">
                                        <label>Tax ID:</label>
                                        <input
                                            name="taxId"
                                            value={formData.taxId}
                                            onChange={handleInputChange}
                                            maxLength={50}
                                            className={`content-input ${errors.taxId ? "error" : ""}`}
                                        />
                                        {errors.taxId && <p className="error">{errors.taxId}</p>}
                                    </div>
                                    <div className="form2">
                                        <label>Registration Number:</label>
                                        <input
                                            name="registrationNumber"
                                            value={formData.registrationNumber}
                                            onChange={handleInputChange}
                                            maxLength={50}
                                            className={`content-input ${errors.registrationNumber ? "error" : ""}`}
                                        />
                                        {errors.registrationNumber && <p className="error">{errors.registrationNumber}</p>}
                                    </div>
                                </div>
                                
                                <div className='content1-form-inputs'>
                                    <div className="form2">
                                        <label>City:</label>
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            maxLength={50}
                                            className={`content-input ${errors.city ? "error" : ""}`}
                                        />
                                        {errors.city && <p className="error">{errors.city}</p>}
                                    </div>
                                    <div className="form2">
                                        <label>Address:</label>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            maxLength={200}
                                            className={`content-input ${errors.address ? "error" : ""}`}
                                        />
                                        {errors.address && <p className="error">{errors.address}</p>}
                                    </div>
                                </div>
                                
                                <div className='content1-form-inputs'>
                                    <div className="form2">
                                        <label>GST Number:</label>
                                        <input
                                            name="gstNumber"
                                            value={formData.gstNumber}
                                            onChange={handleInputChange}
                                            maxLength={50}
                                            className={`content-input ${errors.gstNumber ? "error" : ""}`}
                                        />
                                        {errors.gstNumber && <p className="error">{errors.gstNumber}</p>}
                                    </div>
                                    <div className="form2">
                                        <label>Postal Code:</label>
                                        <input
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            maxLength={10}
                                            className={`content-input ${errors.postalCode ? "error" : ""}`}
                                        />
                                        {errors.postalCode && <p className="error">{errors.postalCode}</p>}
                                    </div>
                                </div>
                                
                                <div className='content1-form-inputs'>
                                    <div className="form2">
                                        <label>Country:</label>
                                        <select
                                            name="countryId"
                                            value={formData.countryId}
                                            onChange={handleInputChange}
                                            className={`content-input ${errors.countryId ? 'error' : ''}`}
                                        >
                                            <option value="">Select Country</option>
                                            {countryData.map((country) => (
                                                <option key={country.id} value={country.id}>{country.countryName}</option>
                                            ))}
                                        </select>
                                        {errors.countryId && <p className="error">{errors.countryId}</p>}
                                    </div>
                                    <div className="form2">
                                        <label>State:</label>
                                        <select
                                            name="stateId"
                                            value={formData.stateId}
                                            onChange={handleInputChange}
                                            className={`content-input ${errors.stateId ? 'error' : ''}`}
                                        >
                                            <option value="">Select State</option>
                                            {stateData
                                                .filter(state => state.countryId === parseInt(formData.countryId))
                                                .map(state => (
                                                    <option key={state.id} value={state.id}>{state.stateName}</option>
                                                ))}
                                        </select>
                                        {errors.stateId && <p className="error">{errors.stateId}</p>}
                                    </div>
                                </div>

                                <div className="content1-form-inputs">
                                    <div className="form4">
                                    <label>
                                        Add Image<span className="error">*</span>
                                    </label>
                                    <div className="image-upload">
                                        <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        className="content-input-img"
                                        onChange={handleFileChange}
                                        id="imageInput"
                                        />
                                    </div>

                                    {errors.imageUrl && <span className="error-text">{errors.imageUrl}</span>}

                                    {formData.imageUrl && (
                                        <div className="image-preview">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            style={{ width: "150px", height: "100px", marginTop: "10px" }}
                                        />
                                        <MdDeleteForever
                                            className="delete-icon"
                                            style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
                                            onClick={handleRemoveImage}
                                        />
                                        </div>
                                    )}
                                    </div>
                                </div>
                                
                                <div className="btn-container">
                                    <div className='content-btn'>
                                        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                        <button type="submit" className="update-btn">Submit</button>
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