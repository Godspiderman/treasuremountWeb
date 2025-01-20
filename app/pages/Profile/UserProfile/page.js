"use client";

import React, { useState, useEffect } from "react";
import "./UserProfile.scss";
import { useSelector } from "react-redux";
import { getUserById, updateUser } from "@/app/services/api";

const UserProfile = () => {
  const userId = useSelector((state) => state.auth.user?.userId || null);
  console.log(userId);

  const [userData, setUserData] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    emailId: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    activeStatus: true,
    roleId: 0,
    createdDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
  });
  
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const response = await getUserById(userId);
          setUserData(response);
          setEditedData(response);
          console.log(response);
        } catch (err) {
          setError("Error fetching user data");
          console.error(err);
        } finally {
        }
      }
    };

    fetchUser();
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateUser(userId, editedData); // Ensure updateUser is defined in your API service
      setUserData(editedData);
      setIsEditing(false);
    } catch (err) {
      setError("Error saving user data");
      console.error("Error saving user data:", err);
    } finally {
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      <div className="user-profile-container">
        <div className="user-profile-contents">
          <div className="user-profile-head">
            <h2>User Profile</h2>
            <div className="btns">
              {isEditing ? (
                <>
                  <span
                    style={{ marginRight: "10px" }}
                    className="btn"
                    onClick={handleSave}
                  >
                    Save
                  </span>
                  <span onClick={handleCancel} className="btn-cancel">
                    Cancel
                  </span>
                </>
              ) : (
                <span onClick={handleEditClick} className="btn">
                  Edit
                </span>
              )}
            </div>
          </div>

          <div className="user-data">
            <div className="form">
              <div className="form1">
                <label> First Name</label>
                <input
                  className="user-profile-content-input"
                  name="firstName"
                  type="text"
                  value={editedData.firstName}
                  onChange={(e) => handleInputChange(e, "firstName")}
                  readOnly={!isEditing}
                />
              </div>
              <div className="form1">
                <label>Last Name</label>
                <input
                  className="user-profile-content-input"
                  name="lastName"
                  type="text"
                  value={editedData.lastName}
                  onChange={(e) => handleInputChange(e, "lastName")}
                  readOnly={!isEditing}
                />
              </div>
              <div className="form1">
                <label>Phone Number</label>
                <input
                  className="user-profile-content-input"
                  name="mobileNumber"
                  type="text"
                  value={editedData.mobileNumber}
                  onChange={(e) => handleInputChange(e, "mobileNumber")}
                  readOnly={!isEditing}
                />
              </div>

              <div className="form1">
                <label>Email</label>
                <input
                  className="user-profile-content-input"
                  name="email"
                  type="text"
                  value={editedData.emailId}
                  onChange={(e) => handleInputChange(e, "emailId")}
                  readOnly={!isEditing}
                />
              </div>
              <div className="form1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
