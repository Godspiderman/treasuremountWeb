"use client";

import React, { useState } from "react";
import { API_URL } from "@/app/services/useAxiosInstance";
import "./AppointmentDetails.scss";
import { IoClose } from "react-icons/io5";

const AppointmentDetails = ({ appointment, onNavigate }) => {
  if (!appointment) {
    return <p>Loading appointment details...</p>;
  }

  const [appointmentDetails, setAppointmentDetails] = useState(appointment);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const handleBack = () => {
    if (onNavigate) {
      onNavigate("booked-appointment");
    }
  };

  const handleCancelAppointment = async () => {
    try {
      const apiUrl = `${API_URL}/api/public/appointments/appointments/status/${selectedAppointmentId}?status=CANCELLED`;
      const response = await fetch(apiUrl, {
        method: "PUT",
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Error: ${response.statusText} - ${errorDetails}`);
      }

      setAppointmentDetails({ ...appointmentDetails, status: "CANCELLED" });

      setShowModal(false);
      alert("Appointment cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const openModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointmentId(null);
  };

  const formatTime = (time) => (time ? time.slice(0, 5) : "");

  return (
    <div className="appointment-details">
      <div className="appointment-details-head">
        <h2>Appointment Details</h2>
          <div className="btns">
            {appointmentDetails.status !== "CANCELLED" &&
              appointmentDetails.status !== "COMPLETED" && (
                <button
                  className="cancel-button"
                  onClick={() => openModal(appointmentDetails.id)}
                >
                  Cancel Appointment
                </button>
              )}

            <button onClick={handleBack} className="btn">
              Back
            </button>
          </div>
      </div>

      <div className="appointment-details-content">
        <div className="appointment-card-img">
          <img src={appointment.imageUrl} alt="img" />
        </div>

        <div className="appointment-details">
          <div className="detail-item">
            <h5>Status:</h5>
            <p>{appointment.status}</p>
          </div>

          <div className="detail-item">
            <h5>Veterinarian:</h5>
            <p>{appointment.firstName}</p>
          </div>

          <div className="detail-item">
            <h5>Mobile:</h5>
            <p>{appointment.mobileNumber}</p>
          </div>

          <div className="detail-item">
            <h5>Requested Date:</h5>
            <p>
              {appointment.appointmentRequestedDate
                ? new Date(appointment.appointmentRequestedDate)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")
                : ""}
            </p>
          </div>

          <div className="detail-item">
            <h5>Start Time:</h5>
            <p>
              {formatTime(appointment.startTime)} -{" "}
              {formatTime(appointment.endTime)}
            </p>
          </div>
        </div>

        <div className="appointments-details-text">
          <div className="detail-item">
            <h5>Pet Type:</h5>
            <p>{appointment.petType}</p>
          </div>

          <div className="detail-item">
            <h5>Appointment Reason:</h5>
            <p>{appointment.appointmentReason}</p>
          </div>

          <div className="detail-item">
            <h5>Address:</h5>
            <p>
              {appointment.address}, {appointment.city}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirm Cancellation</h2>
              <button className="close-modal-button" onClick={closeModal}>
                <IoClose />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel this appointment?</p>
            </div>
            <div className="modal-footer">
              <button className="clearButton" onClick={handleCancelAppointment}>
                Yes, Cancel
              </button>
              <button onClick={closeModal}>No, Keep It</button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default AppointmentDetails;
