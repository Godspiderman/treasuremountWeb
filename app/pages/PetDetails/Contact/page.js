
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import React from 'react'

function page() {

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    console.log("Redux auth state:", isAuthenticated);

    //contact
    
      //const [showContainer, setShowContainer] = useState(false);
        const [formData, setFormData] = useState({
            fullName: "",
            shopName: "",
            phoneNumber: "",
            email: "",
            address: "",
            message: ""
        });
        const [formErrors, setFormErrors] = useState({
            fullName: "",
            shopName: "",
            phoneNumber: "",
            email: "",
            address: "",
            message: ""
        });
    
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
    
            // Clear the error when the user starts typing
            setFormErrors({
                ...formErrors,
                [name]: ""
            });
        };
    
        const handleSubmit = (e) => {
            e.preventDefault();
    
            let errors = {};
            let isValid = true;
    
            // Validate each field
            for (const [key, value] of Object.entries(formData)) {
                if (!value) {
                    errors[key] = "Please fill this field";
                    isValid = false;
                }
            }
    
            // Phone number validation (should be 10 digits)
            const phonePattern = /^[0-9]{10}$/;
            if (formData.phoneNumber && !phonePattern.test(formData.phoneNumber)) {
                errors.phoneNumber = "Phone number must be exactly 10 digits";
                isValid = false;
            }
    
            // If form is invalid, set errors and stop form submission
            if (!isValid) {
                setFormErrors(errors);
                return;
            }
    
            // Proceed with form submission
            console.log("Form Data:", formData);
    
            // Reset form data after submission
            setFormData({
                fullName: "",
                shopName: "",
                phoneNumber: "",
                email: "",
                address: "",
                message: ""
            });
    
            // Clear error messages after submission
            setFormErrors({
                fullName: "",
                shopName: "",
                phoneNumber: "",
                email: "",
                address: "",
                message: ""
            });
        };
    
      //

    return (
        <div className="contactpage">
        {/* Button to toggle container visibility */}
        {/* <button
          className="toggle-button"
          onClick={() => setShowContainer(!showContainer)}
        >
          {showContainer ? "Hide Contact Form" : "Contact Now"}
        </button> */}
      
        {/* Conditionally render the container */}
        {/* {showContainer && ( */}
          <div className="contactpage-container">
            <div className="contactpage-contents">
              <div className="contactpage-head">
                <h2>Contact Details</h2>
              </div>
              <div className="contactpage-contents">
                <div className="contactpage-content">
                  <form className="contactpage-form" onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className="contactpage-form-inputs">
                      <div className="form1">
                        <label>Full Name</label>
                        <input
                          className="contactpage-content-input"
                          name="fullName"
                          type="text"
                          placeholder="Name"
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                        
                      </div>
                    </div>
                    {formErrors.fullName && (
                          <div className="error-message">{formErrors.fullName}</div>
                        )}
      
                    {/* Shop Name */}
                    <div className="contactpage-form-inputs">
                      <div className="form1">
                        <label>Shop Name</label>
                        <input
                          className="contactpage-content-input"
                          name="shopName"
                          type="text"
                          placeholder="Shop Name"
                          value={formData.shopName}
                          onChange={handleChange}
                        />
                        
                      </div>
                    </div>
                    {formErrors.shopName && (
                          <div className="error-message">{formErrors.shopName}</div>
                        )}
      
                    {/* Phone Number */}
                    <div className="contactpage-form-inputs">
                      <div className="form1">
                        <label>Phone Number</label>
                        <input
                          className="contactpage-content-input"
                          name="phoneNumber"
                          type="text"
                          placeholder="Phone Number"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                        />
                        
                      </div>
                    </div>
                    {formErrors.phoneNumber && (
                          <div className="error-message">{formErrors.phoneNumber}</div>
                        )}
      
                    {/* Email */}
                    <div className="contactpage-form-inputs">
                      <div className="form1">
                        <label>Email</label>
                        <input
                          className="contactpage-content-input"
                          name="email"
                          type="text"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                       
                      </div>
                    </div>
                    {formErrors.email && (
                          <div className="error-message">{formErrors.email}</div>
                        )}
      
                    {/* Address */}
                    <div className="contactpage-form-inputs">
                      <div className="form1">
                        <label>Address</label>
                        <input
                          className="contactpage-content-input"
                          name="address"
                          type="text"
                          placeholder="Address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                       
                      </div>
                    </div>
                    {formErrors.address && (
                          <div className="error-message">{formErrors.address}</div>
                        )}
      
                    {/* Message */}
                    <div className="contactpage-form-inputs">
                      <div className="form1">
                        <label>Message</label>
                        <textarea
                          className="contactpage-content-input"
                          name="message"
                          rows={5}
                          placeholder="Type Message"
                          value={formData.message}
                          onChange={handleChange}
                        />
                       
                      </div>
                    </div>
                    {formErrors.message && (
                          <div className="error-message">{formErrors.message}</div>
                        )}
      
                    {/* Submit Button */}
                    <div className="form-submit">
                      <button type="submit" className="submit-button">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        {/* )} */}
      </div>
      
    )
}

export default page
