"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/services/useAxiosInstance";

const CreateAccount = () => {
  const router = useRouter();

  const initialFormData = {
    firstName: "",
    lastName: "",
    emailId: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  };

  const initialErrors = {
    firstName: "",
    lastName: "",
    emailId: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors(initialErrors);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.emailId.trim() || !/\S+@\S+\.\S+/.test(formData.emailId))
      newErrors.emailId = "Valid Email ID is required";
    if (
      !formData.mobileNumber.trim() ||
      !/^\d{10}$/.test(formData.mobileNumber)
    )
      newErrors.mobileNumber = "Valid Contact Number is required";
    if (!formData.password.trim() || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const currentDate = new Date().toISOString();
    const payload = {
      id: 0,
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailId: formData.emailId,
      mobileNumber: formData.mobileNumber,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      activeStatus: true,
      roleId: 3,
      createdDate: currentDate,
      modifiedDate: currentDate,
    };

    try {
      const response = await fetch(
        `${API_URL}/api/public/user/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // Check if the response has a body
        const contentType = response.headers.get("Content-Type");
        let data = null;

        if (contentType && contentType.includes("application/json")) {
          data = await response.json(); 
        }

        console.log("Account created successfully:", data);
        // Show success alert
        alert("Account created successfully!");
        // Reset form on successful submission
        setFormData(initialFormData);
        setErrors(initialErrors);
      } else {
        const errorMessage = await response.text(); 
        console.error("Failed to create account:", errorMessage);

        setErrors((prevErrors) => ({
          ...prevErrors,
          apiError:
            errorMessage || "Failed to create account. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        apiError:
          "An error occurred. Please check your connection and try again.",
      }));
      alert("An error occurred. Please check your connection and try again.");
    }
  };

  return (
    <div className="createAccount">
      <div className="createAccountContainer">
        <div className="createAccountHead">
          <h2>Create Account</h2>
        </div>
        <form className="createAccountContent" onSubmit={handleSubmit}>
          <div className="content1-form">
            <div className="content1-form-inputs">
              <div className="form2">
                <label>First Name</label>
                <input
                  className={`content-input ${
                    errors.firstName ? "input-error" : ""
                  }`}
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form2">
                <label>Last Name</label>
                <input
                  className={`content-input ${
                    errors.lastName ? "input-error" : ""
                  }`}
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="content1-form-inputs">
              <div className="form2">
                <label>Contact Number</label>
                <input
                  className={`content-input ${
                    errors.mobileNumber ? "input-error" : ""
                  }`}
                  name="mobileNumber"
                  type="text"
                  placeholder="Contact Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="form2">
                <label>Email ID</label>
                <input
                  className={`content-input ${
                    errors.emailId ? "input-error" : ""
                  }`}
                  name="emailId"
                  type="email"
                  placeholder="Email ID"
                  value={formData.emailId}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="content1-form-inputs">
              <div className="form2">
                <label>Password</label>
                <input
                  className={`content-input ${
                    errors.password ? "input-error" : ""
                  }`}
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form2">
                <label>Confirm Password</label>
                <input
                  className={`content-input ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="btn-container">
              <div className="content-btn">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="update-btn">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
