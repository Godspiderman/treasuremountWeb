"use client";

import "./Profile.scss";
import { FaUser, FaShoppingCart, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useState } from 'react';
import { logout, selectAuth } from "@/app/redux/slices/authSlice";
import { useSelector } from "react-redux";
import OrderDetails from "../Notification/DetailsPage/page";
import OrderHistoryPage from "./OrderHistory/page";
import UserProfile from "./UserProfile/page";
import BecomeVendor from "./BecomeVendor/page";
import BookedAppointment from "./BookedAppointment/page";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { CiLogout } from "react-icons/ci";
import { useRouter } from 'next/navigation';
import { MdOutlinePets } from "react-icons/md";
import AddPets from "./AddPets/page";
import PetAdd from "./PetAdd/page";
import { LuBookMinus } from "react-icons/lu";
import { MdOutlineHistory } from "react-icons/md";

const Profile = () => {

  //const { user } = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('personal-info');

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleSectionChange = (section) => {
    setActiveSection(section);

    // Check screen width and toggle sidebar if necessary
    if (window.innerWidth <= 854) {
      setIsSidebarOpen((prevState) => !prevState);
    }
  };

  const handleLogout = () => {
    dispatch(logout());

    router.push('/');
  };

  return (
    <div className="profile">
      <div className="profile-container">
        {/* Sidebar */}
        <div className={`profile-sidenav ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="menu" onClick={toggleSidebar}>
            <IoIosCloseCircleOutline />
          </div>
          <div className="sideNav-lists">
            <div className={`sideNav-list ${activeSection === 'personal-info' ? 'active' : ''}`}
              onClick={() => handleSectionChange('personal-info')}>
              <FaUser /> <p>Personal Info</p>
            </div>
            <div className={`sideNav-list ${activeSection === 'add-pets' ? 'active' : ''}`}
              onClick={() => handleSectionChange('add-pets')}>
              <MdOutlinePets /> <p>Pets</p>
            </div>

            <div className={`sideNav-list ${activeSection === 'order-history' ? 'active' : ''}`}
              onClick={() => handleSectionChange('order-history')}>
              <MdOutlineHistory /><p>Order History</p>
            </div>
            <div className={`sideNav-list ${activeSection === 'become-vendor' ? 'active' : ''}`}
              onClick={() => handleSectionChange('become-vendor')}>
              <FaUser /> <p>Become Vendor</p>
            </div>
            <div className={`sideNav-list ${activeSection === 'booked-appointment' ? 'active' : ''}`}
              onClick={() => handleSectionChange('booked-appointment')}>
             <LuBookMinus /> <p>Booked Appointments</p>
            </div>
            <div className="sideNav-list" onClick={handleLogout} >
              <CiLogout /><p>Logout</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="profile-content">
          <div className="profile-head">
            <div className="menu" onClick={toggleSidebar}>
              <FaBars />
            </div>
            <div className="text">
              <h2>Profile</h2>
            </div>
          </div>
          <div className="main-content">
            {activeSection === 'personal-info' && (
              <>
                <UserProfile />
              </>
            )}

            {activeSection === 'add-pets' && (
              <>
                <AddPets />
              </>
            )}

            {activeSection === 'order-history' && (
              <OrderHistoryPage />
            )}
            
            {activeSection === 'become-vendor' && (
              <BecomeVendor />
            )}
            {activeSection === 'booked-appointment' && (
              <BookedAppointment />
            )}
          </div>
          {/* Other content goes here */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
