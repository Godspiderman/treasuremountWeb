"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "@/app/utils/Pagenation/Pagenation";
import { API_URL } from "@/app/services/useAxiosInstance";

function BookedAppointment({ onNavigate }) {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const userId = useSelector((state) => state.auth.user?.userId || null);

  const status = "";

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId) {
        return;
      }
  
      try {
        const apiUrl = `${API_URL}/api/public/appointments/getAll/${userId}?isVeterinarianId=false&Status=${status}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Get the current date and time
        const currentDateTime = new Date();
  
        // Filter out past appointments
        const futureAppointments = data.filter((appointment) => {
          const appointmentStartDateTimeString = `${appointment.appointmentRequestedDate}T${appointment.startTime}`;
          const appointmentStartDateTime = new Date(appointmentStartDateTimeString);
  
          // Check if the date is valid
          if (isNaN(appointmentStartDateTime.getTime())) {
            console.error(`Invalid date format for appointment: ${appointmentStartDateTimeString}`);
            return false;  
          }
          
          return appointmentStartDateTime > currentDateTime;
        });
  
        console.log("Filtered Future Appointments:", futureAppointments); 
  
        setAppointments(futureAppointments);
  
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
  
    fetchAppointments();
  }, [userId, status]);
  


  const indexOfLastAppointment = (currentPage + 1) * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const pageCount = Math.ceil(appointments.length / itemsPerPage);
  const handleViewDetails = (appointment) => {
    onNavigate("appointment-details", appointment);
  };


  // const handleCancelAppointment = async (appointmentId) => {
  //   try {
  //     const apiUrl = `${API_URL}/api/public/appointments/appointments/status/${appointmentId}?status=CANCELLED`;
  //     const response = await fetch(apiUrl, {
  //       method: "PUT", 
  //     });
  
  //     if (!response.ok) {
  //       const errorDetails = await response.text();
  //       throw new Error(`Error: ${response.statusText} - ${errorDetails}`);
  //     }
  
  //     setAppointments((prevAppointments) =>
  //       prevAppointments.map((appointment) =>
  //         appointment.id === appointmentId
  //           ? { ...appointment, status: "CANCELLED" } 
  //           : appointment
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error cancelling appointment:", error);
  //   }
  // };

  const formatTime = (time) => time ? time.slice(0, 5) : "";

  

  return (
    <div className="appointments-container">
      <h1>Booked Appointments</h1>
      <div className="appointments-cards">
        {currentAppointments.length > 0 ? (
          currentAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-card-img">
                <img src={appointment.imageUrl} alt="img" />
              </div>
              <div
                className="book-appointment-details"
                onClick={() => handleViewDetails(appointment)}
              >
               <div className="detail-item">
                  <h5>Status:</h5>
                  <p>{appointment.status}</p>
                </div>
                <div className="detail-item">
                  <h5>Requested Date:</h5>
                  <p>
                    {appointment.appointmentRequestedDate 
                      ? new Date(appointment.appointmentRequestedDate).toLocaleDateString('en-GB').replace(/\//g, '-')
                      : ''}
                  </p>

                </div>
                <div className="detail-item">
                  <h5>Start Time:</h5>
                  <p>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</p>
                </div>
                <div className="detail-item">
                  <h5>Veterinarian:</h5>
                  <p>{appointment.firstName}</p>
                </div>
                <div className="detail-item">
                  <h5>Mobile:</h5>
                  <p>{appointment.mobileNumber}</p>
                </div>
               
               
              </div>

              <div className="appointments-details-text">
                <div className="detail-item">
                    <h5>Address:</h5>
                    <p>
                      {appointment.address}, {appointment.city}
                    </p>
                  </div>
                <div className="detail-item">
                    <h5>Start Time:</h5>
                    <p>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</p>
                  </div>
                <div className="detail-item">
            
                    <h5>Pet Type:</h5>
                    <p>{appointment.petType}</p>
                </div>
                
                <div className="detail-item">
                  <h5>Appointment Reason:</h5>
                  <p>{appointment.appointmentReason}</p>
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
