"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoLocationSharp } from "react-icons/io5";
import Pagination from "@/app/utils/Pagenation/Pagenation";

const ConsultVet = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const handleChange = (id) => {
    console.log("Clicked Vet ID:", id);
    router.push(`/pages/ConsultVet/DoctorDetails?id=${id}`);
  };

  const fetchVeterinarians = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (date) queryParams.append("date", date);
      if (startTime) queryParams.append("start", startTime);
      if (endTime) queryParams.append("end", endTime);

      const response = await fetch(
        `http://localhost:8080/api/public/veterinarian/getAll?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch veterinarian details.");
      }
      const data = await response.json();
      console.log("Fetched Data:", data);
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVeterinarians();
  }, [date, startTime, endTime]);

  const clearAllFilters = () => {
    setDate("");
    setStartTime("");
    setEndTime("");
  };

  // Calculate page count
  const pageCount = Math.ceil(doctors.length / itemsPerPage);

  // Paginate the data
  const paginatedDoctors = doctors.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <div className="consult-banner">
      {/* Hero Section */}
      <div className="consult-banner-container">
        <h1>Online Vet Consultation</h1>
      </div>

     <div className="consult-about-section"> 
      <div className="consult-filters-card"> 
        <div className="templates-Filter">
          <div className="filter-Item">
            <div className="dropdown-Header">
              <label>Select Date:</label>
            </div>
            <div className="price-Range">
              <input
                type="date"
                className="price-Input"
                value={date}
                min={new Date().toISOString().split("T")[0]} 
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="dropdown-Header">
              <label>Select Time:</label>
            </div>

            <div className="price-Range">
              <label>Start Time:</label>
              <input
                type="time"
                className="price-Input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
              
            <div className="price-Range">
              <label>End Time:</label>
              <input
                type="time"
                value={endTime}
                className="price-Input"
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <button className="clear-All-Btn" onClick={clearAllFilters}>
            Clear All
          </button>
        </div>

        {/* About Section */}
        <div className="consult-about-container">
          {loading && <p>Loading veterinarians...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading &&
            !error &&
            paginatedDoctors.map((vet) => (
              <div
                className="consult-about-card"
                key={vet.veterinarianDTO.id}
                onClick={() => handleChange(vet.veterinarianDTO.id)}
              >
                <div className="consult-about-img">
                  <img
                    src={vet.veterinarianDTO.imageUrl || "/image/doctor.jpg"}
                    alt={`About ${vet.userDTO.firstName} ${vet.userDTO.lastName}`}
                  />
                </div>
                <div className="consult-about-texts">
                  <div className="consult-about-para">
                    <h1 className="consult-name">
                      {vet.userDTO.firstName} {vet.userDTO.lastName}
                    </h1>
                    <h3 className="consult-university">
                      {vet.veterinarianDTO.education}
                    </h3>

                    <p>
                      Year of Experience: {vet.veterinarianDTO.yearsOfExperience}
                    </p>

                    <p>Languages: {vet.veterinarianDTO.language}</p>

                    <p>Animal Type: {vet.veterinarianDTO.animalType}</p>

                    <p className="consult-location">
                      <IoLocationSharp /> {vet.veterinarianDTO.city}
                    </p>

                    <div className="consult-about-btn">
                      <button>Learn More</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        
        </div>
        {/* Pagination Component */}
        <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            setCurrentPage={setCurrentPage}
          />
      </div>
    </div>
  );
};

export default ConsultVet;
