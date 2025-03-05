"use client";

import React from "react"; 
import { RiWhatsappFill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setActiveSection } from "@/app/redux/slices/searchSlice";
import LanguageSelector from "@/app/utils/LanguageSelector/LanguageSelector";
 
const Footer = () => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

    const dispatch = useDispatch();
    const router = useRouter();

    const navigateToSection = (section) => {
        if (!isAuthenticated) {
            router.push("/pages/Login");
            return;
          }
        dispatch(setActiveSection(section));
        router.push('/pages/Profile');

      };

    return (
        <>
        <div className="footerContainer">
            <div className="contactDetails">
                <div className="footerLogo">
                    <img src="/image/26 copy.png" alt="Logo" />
                </div>
                <p>Your trusted pet shop for healthy pets, quality
                       pet products, and hassle-free veterinary booking.</p>
                <div className="footerIcons">
                    <RiWhatsappFill />
                    <FaFacebook />
                    <RiInstagramFill />
                    <FaSquareXTwitter />
                    <FaYoutube />
                </div>
            </div>

            <div className="explore-detail">
                <h3>Explore</h3>
                
                <div className="footer-lists">
                    <Link href="/" className="footer-list-item"><MdKeyboardDoubleArrowRight /> Home</Link>
                    <Link href="/pages/Pets" className="footer-list-item"><MdKeyboardDoubleArrowRight /> Pets</Link>
                    <Link href="/pages/Products" className="footer-list-item"><MdKeyboardDoubleArrowRight /> Products</Link>
                    <Link href="/pages/Shop" className="footer-list-item"><MdKeyboardDoubleArrowRight /> Shop</Link>
                    <Link href="/pages/Blog" className="footer-list-item"><MdKeyboardDoubleArrowRight /> Blog</Link>
             
                </div>
          
            </div>

            <div className="recent-detail">
                <h3>Other Links</h3>
                <div className="footer-lists">
                    <span  onClick={() => navigateToSection("add-pets")} className="footer-list-item"><MdKeyboardDoubleArrowRight /> Sell Your Pets</span>
                    <span onClick={() => navigateToSection("become-vendor")} className="footer-list-item"><MdKeyboardDoubleArrowRight /> Vendor Register</span>
                    <span onClick={() => navigateToSection("order-history")} className="footer-list-item"><MdKeyboardDoubleArrowRight /> Order History</span>
                    <span onClick={() => navigateToSection("booked-appointment")} className="footer-list-item"><MdKeyboardDoubleArrowRight /> Appointments History</span>
              
                </div>
            </div>

            <div className="contacts">
                <h3>Contacts</h3>

                <div className="address">
                    <div className="address-icon">
                        <FaLocationDot />
                    </div>

                    <div className="address-details">
                        <div className="address-info">
                            <p className="address-head">Our Location</p>
                            <p className="address-head">Chennai, Tamil Nadu</p>
                        </div>

                    </div>
                </div>

                <div className="address">
                    <div className="address-icon">
                      <FaPhoneAlt />
                    </div>

                    <div className="address-details">
                        <div className="address-info">
                            <p className="address-head">Our Phone</p>
                            <p className="address-head">+91 12345 67890</p>
                        </div>
                    </div>
                </div>

                <div className="address">
                    <div className="address-icon">
                    <MdOutlineMailOutline />
                    </div>

                    <div className="address-details">
                        <div className="address-info">
                            <p className="address-head">Our Email</p>
                            <p className="address-head">treasuremount@gmail.com</p>
                        </div>
                    </div>

                </div>
                <LanguageSelector />

            </div>
        
        </div>

        <div className="footer-buttom">
            <p>&copy; 2025 Treasuremount. All rights reserved.</p>
        </div>
        
    </>
);
};

export default Footer;
