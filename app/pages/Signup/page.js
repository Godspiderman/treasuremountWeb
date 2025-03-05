"use client";

import React, { useState } from "react";
import "./Signup.scss";
import Link from "next/link";
import axiosInstance from "@/app/utils/axios";
import { useRouter } from 'next/navigation';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; 
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';

const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    emailId: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    createdDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";

    if (!formData.emailId.trim()) {
      newErrors.emailId = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = "Invalid email format.";
    }   

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number.";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (formData.password.length > 15) {
      newErrors.password = "Password must be no longer than 15 characters.";
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    setErrors((prev) => ({ ...prev, [name]: "" }));
  
    if (name === "emailId") {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, emailId: "Email is required." }));
      } else if (!emailPattern.test(value)) {
        setErrors((prev) => ({ ...prev, emailId: "Invalid email format." }));
      }
    } else if (name === "mobileNumber") {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, mobileNumber: "Mobile number is required." }));
      } else if (!/^\d{10}$/.test(value)) {
        setErrors((prev) => ({ ...prev, mobileNumber: "Enter a valid 10-digit mobile number." }));
      }
    }
  };
  


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const payload = {
      ...formData,
      activeStatus: true,
      roleId: 3,
    };
  
    try {
      setLoading(true);
      console.log(payload);
  
      const response = await axiosInstance.post(`/api/public/user/add`, payload);
      setLoading(false);
  
      if (response.data) {
        setSuccessMessage("Signup successful! You can now login.");
        setFormData({
          id: 0,
          firstName: "",
          lastName: "",
          emailId: "",
          mobileNumber: "",
          password: "",
          confirmPassword: "",
        });
  
        dispatch(loginSuccess(response.data));
        router.push('/');
      }
    } catch (error) {
      setLoading(false);
  
      if (error.response) {
        const statusCode = error.response.status;
  
        if (statusCode === 409) {
          setErrors({
            emailId: "The email address is already in use. Please use a different email.",
          });
        } else if (error.response.data?.message) {
          setErrors({ form: error.response.data.message });
        } else {
          setErrors({ form: "An unexpected error occurred. Please try again." });
        }
      } else {
        setErrors({ form: "Unable to connect to the server. Please try again later." });
      }
    }
  };
  

  return (
    <div className="signup">
      <div className="signup-container">
        <div className="signup-form">
          <div className="signup-form-content">

            <div className="signup-form-head">
                <h2>Create an Account</h2>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errors.form && <p className="error-message">{errors.form}</p>}
            </div>

            <form onSubmit={handleSubmit} className="signup-form-forms">
                <div className="signup-form1">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      maxLength={100}
                      className={errors.firstName ? "input-error" : ""}
                    />
                    {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                </div>

                <div className="signup-form1">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      maxLength={100}
                    />
                     {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                </div>

                <div className="signup-form1">
                    <label>Email</label>
                    <input
                      type="email"
                      name="emailId"
                      value={formData.emailId}
                      onChange={handleChange}
                      maxLength={100}
                      className={errors.emailId ? "input-error" : ""}
                    />
                    {errors.emailId && <p className="error-message">{errors.emailId}</p>}
                </div>

                <div className="signup-form1">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      name="mobileNumber"
                      maxLength={10}
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className={errors.mobileNumber ? "input-error" : ""}
                    />
                    {errors.mobileNumber && <p className="error-message">{errors.mobileNumber}</p>}
                </div>

                <div className="signup-form1">
                  <label>Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      maxLength={15}
                      className={errors.password ? "input-error" : ""}
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(!showPassword)} 
                    >
                      {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                    </span>
                  </div>
                  {errors.password && <p className="error-message">{errors.password}</p>}
                </div>

                <div className="signup-form1">
                  <label>Confirm Password</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      maxLength={50}
                      className={errors.confirmPassword ? "input-error" : ""}
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    >
                      {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                    </span>
                  </div>
                  {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>

                <div className="signup-form-btns">
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                    <p>
                        Already have an account? <Link href="/pages/Login" className="link">Login</Link>
                    </p>

                </div>

        
            </form>

          </div>
        </div>

        <div className="signup-img">
          <div className='signup-img-box'>
            <img src="/image/login.png" alt='signup-page' /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
