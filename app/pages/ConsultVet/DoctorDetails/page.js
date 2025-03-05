"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { API_URL } from "@/app/services/useAxiosInstance";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/app/redux/slices/loadingSlice";
import "./DoctorDetails.scss";
import {FaArrowRight } from "react-icons/fa";


const DoctorDetails = () => {
  const userId = useSelector((state) => state.auth.user?.userId || null);
  console.log(userId);

  const dispatch = useDispatch();

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("");
  const [appointmentData, setAppointmentData] = useState(null);

  const [petType, setPetType] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const slotsPerPage = 10;

  useEffect(() => {
    if (!id) return;

    const fetchDoctorDetails = async () => {
      try {
        dispatch(startLoading());
        const response = await fetch(
          `${API_URL}/api/public/veterinarian/getOne/${id}`
        );
        const data = await response.json();

        if (response.ok && data) {
          setDoctor(data);
          const vetId = data.veterinarianDTO.id;

          setAppointmentData({
            id: 0,
            veterinarianId: vetId,
            userId: userId,
            //petType: "Dog",
            //appointmentReason: "General Checkup",
            appointmentRequestedDate: currentDate,
            startTime: "",
            status: "PENDING",
            createdDate: new Date().toISOString().split("T")[0],
          });

          fetchAvailableSlots(vetId);
          fetchBookedSlots(vetId);
        } else {
          console.error("Error fetching doctor details:", data);
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchDoctorDetails();
  }, [id, currentDate]);

  const fetchAvailableSlots = async (veterinarianId) => {
    console.log(currentDate);

    try {
      const response = await fetch(
        `${API_URL}/api/public/schedule/available-slots/${veterinarianId}?date=${currentDate}`
      );
      const data = await response.json();

      console.log("Available Slots:", data);

      if (data[currentDate]) {
        const filteredSlots = data[currentDate].filter((slot) => {
          const slotDate = new Date(`${currentDate}T${slot.split(" - ")[0]}`);
          const currentTime = new Date();

          return slotDate > currentTime;
        });
        setAvailableSlots(filteredSlots || []);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  const fetchBookedSlots = async (veterinarianId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/public/schedule/booked-slots/${veterinarianId}`
      );
      const data = await response.json();
      console.log("Booked Slots:", data);

      setBookedSlots(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      setBookedSlots([]);
    }
  };

  const [petTypeError, setPetTypeError] = useState("");
  const [appointmentReasonError, setAppointmentReasonError] = useState("");
  
  const handlePetTypeChange = (e) => {
    setPetType(e.target.value);
    if (e.target.value) {
      setPetTypeError(""); 
    }
  };
  
  const handleAppointmentReasonChange = (e) => {
    setAppointmentReason(e.target.value);
    if (e.target.value) {
      setAppointmentReasonError(""); 
    }
  };

  const bookAppointment = async () => {

    let valid = true;

  if (!petType) {
    setPetTypeError("Please enter pet type.");
    valid = false;
  }

  if (!appointmentReason) {
    setAppointmentReasonError("Please enter appointment reason.");
    valid = false;
  }

  if (!valid) {
    return;
  }

    const updatedAppointmentData = {
      ...appointmentData,
      petType,
      appointmentReason,
      startTime: selectedSlot,
    };

    const formattedDate = new Date(
      updatedAppointmentData.appointmentRequestedDate
    )
      .toISOString()
      .split("T")[0];
    updatedAppointmentData.appointmentRequestedDate = formattedDate;
    console.log(updatedAppointmentData);

    try {
      const response = await fetch(`${API_URL}/api/public/appointments/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAppointmentData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("API Response Error:", errorResponse);
        setAppointmentStatus(
          "Error: " + errorResponse?.message ||
            "An unexpected error occurred. Please try again."
        );
        return;
      }

      const responseData = await response.json();
      alert("Appointment booked successfully!");

      setAvailableSlots(availableSlots.filter((slot) => slot !== selectedSlot));
      setBookedSlots([...bookedSlots, selectedSlot]);

      setPetType("");
      setAppointmentReason("");
      setSelectedSlot("");

      setAppointmentData((prev) => ({
        ...prev,
        startTime: "",
      }));

      const today = new Date().toISOString().split("T")[0];
      setCurrentDate(today);

      fetchBookedSlots(id);
      fetchAvailableSlots(id);

      router.push('/pages/ConsultVet');

    } catch (error) {
      console.error("Network or API error:", error);
      setAppointmentStatus("Network error, please try again.");
    }
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    let formattedHour = parseInt(hour);
    const period = formattedHour >= 12 ? "PM" : "AM";
    if (formattedHour > 12) formattedHour -= 12;
    if (formattedHour === 0) formattedHour = 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  const formatSlot = (slot) => {
    const [start, end] = slot.split(" - ");
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const handleSlotChange = (timeSlot) => {
    const startTime = timeSlot.split(" - ")[0];
    setSelectedSlot(startTime);
    setAppointmentData((prev) => ({
      ...prev,
      startTime: startTime,
    }));

    const allSlots = document.querySelectorAll(".time-slot");
    allSlots.forEach((slotElement) => {
      slotElement.classList.remove("selected");
    });

    const selectedSlotElement = document
      .querySelector(`input[value="${timeSlot}"]`)
      .closest(".time-slot");
    if (selectedSlotElement) {
      selectedSlotElement.classList.add("selected");
    }
  };

  // Pagination
  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const currentSlots = availableSlots.slice(indexOfFirstSlot, indexOfLastSlot);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => prevPage + direction);
  };

  const today = new Date().toISOString().split("T")[0];

  if (!id) {
    return <div>No doctor selected.</div>;
  }

  if (!doctor) {
    return <div>Loading doctor details...</div>;
  }

  return (
    <div className="doctor-section">
      <div className="doctor-details-banner">
        <div className="doctor-details-container">
          <div className="doctor-details-row">
            <div>
              <div className="doctor-details-head">
                <h2>Doctor Details</h2>
                <button  className="go-back-btn" onClick={() => router.back()}>Back</button>
              </div>
            </div>
          </div>
        </div>

        <div className="doctor-about-container">
          <div className="doctor-about">
            <div className="doctor-about-img">
              <img
                src={doctor.veterinarianDTO.imageUrl || "/image/doctor.jpg"}
                alt="Doctor"
              />
            </div>

            <div className="doctor-info-container">
         
              <p>
                <strong>Name:</strong>  {doctor.userDTO.firstName} {doctor.userDTO.lastName}
              </p>
              <p>
                <strong>University:</strong> {doctor.veterinarianDTO.education}
              </p>
              <p>
                <strong>Location:</strong> {doctor.veterinarianDTO.city}
              </p>
              <p>
                <strong>Specialization:</strong>{" "}
                {doctor.veterinarianDTO.animalType}
              </p>
              <p>
                <strong>Languages:</strong> {doctor.veterinarianDTO.language}
              </p>
            </div>
            <div className="doctor-info-container w-100">
              <p>
                <strong>About:</strong> {doctor.veterinarianDTO.aboutMe}
              </p>
            </div>
          </div>
          <div className="doctor-time-slot-container">
            <h4>Pick a time slot</h4>
            <div className="doctor-time-slot-table">
              <div className="date-picker-container">
                <label htmlFor="date-picker">Select Date:</label>
                <input
                  type="date"
                  id="date-picker"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  min={today}
                />
              </div>

              <div className="pet-type-container">
                <label htmlFor="petType">Pet Type:</label>
                <input
                  type="text"
                  id="petType"
                  value={petType}
                  onChange={handlePetTypeChange}
                  placeholder="Enter the pet type"
                  maxLength={50}
                />
                  {petTypeError && <p className="error-message">{petTypeError}</p>}
              </div>

              <div className="reason-container">
                <label htmlFor="reason">Appointment Reason:</label>
                <textarea
                  rows={5}
                  id="reason"
                  value={appointmentReason}
                  onChange={handleAppointmentReasonChange}
                  placeholder="Enter the reason "
                  maxLength={250}
                />
                 {appointmentReasonError && (
                  <p className="error-message">{appointmentReasonError}</p>
                )}
              </div>
            </div>

            {currentSlots.length > 0 ? (
              <>
              <h4>Available Slots </h4>
                <div className="time-slot-container">
                  {currentSlots.map((timeSlot, index) => (
                    <div className="time-slot" key={index}>
                      <input
                        type="radio"
                        id={`slot-${index}`}
                        name="timeSlot"
                        value={timeSlot}
                        onChange={() => handleSlotChange(timeSlot)}
                      />
                      <label htmlFor={`slot-${index}`}>
                        {formatSlot(timeSlot)}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="slot-controls">
                  <button
                    onClick={bookAppointment}
                    disabled={!selectedSlot}
                    className="book-slot-button"
                  >
                    Book Appointment
                  </button>

                  <button
                    onClick={() => {
                      setSelectedSlot("");
                      setPetType("");
                      setAppointmentReason("");

                      setPetTypeError("");
                      setAppointmentReasonError("");

                      setAppointmentData((prev) => ({
                        ...prev,
                        startTime: "",
                      }));

                      const radioButtons = document.querySelectorAll(
                        '.time-slot input[type="radio"]'
                      );
                      radioButtons.forEach((radioButton) => {
                        radioButton.checked = false;
                      });

                      const allSlots = document.querySelectorAll(".time-slot");
                      allSlots.forEach((slotElement) => {
                        slotElement.classList.remove("selected");
                      });
                    }}
                    className="clear-all-button"
                  >
                    Clear All
                  </button>
                </div>

                <div className="pagination-controls">
                  <button
                    onClick={() => handlePageChange(-1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>Page {currentPage}</span>
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={indexOfLastSlot >= availableSlots.length}
                  >
                    Next
                  </button>
                </div>

              </>
            ) : (
              <div>No available slots.</div>
            )}

            {appointmentStatus && (
              <div className="appointment-status">{appointmentStatus}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
