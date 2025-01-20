"use client";

import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import Pagination from "@/app/utils/Pagenation/Pagenation";

function BookedAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8; 

  const userId = useSelector((state) => state.auth.user?.userId || null);

  const status = "";

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId) {
        //console.error("User ID is not available");
        return;
      }

      try {
        const apiUrl = `http://localhost:8080/api/public/appointments/getAll/${userId}?isVeterinarianId=false&Status=${status}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [userId, status]);

  const indexOfLastAppointment = (currentPage + 1) * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const pageCount = Math.ceil(appointments.length / itemsPerPage);

  return (
    <div className="appointments-container">
      <h1>Booked Appointments</h1>
      <div className="appointments-cards">
        {currentAppointments.length > 0 ? (
          currentAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-details">
                <div className="detail-item">
                  <h5>Pet Type:</h5>
                  <p>{appointment.petType}</p>
                </div>
                <div className="detail-item">
                  <h5>Appointment Reason:</h5>
                  <p>{appointment.appointmentReason}</p>
                </div>
                <div className="detail-item">
                  <h5>Requested Date:</h5>
                  <p>{appointment.appointmentRequestedDate}</p>
                </div>
                <div className="detail-item">
                  <h5>Start Time:</h5>
                  <p>{appointment.startTime}</p>
                </div>
                <div className="detail-item">
                  <h5>Status:</h5>
                  <p>{appointment.status}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No appointments booked.</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default BookedAppointment;
