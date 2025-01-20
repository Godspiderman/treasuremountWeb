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
 
    const Footer = () => {
     
    return (
        <>
        <div className="footerContainer">
            <div className="contactDetails">
                <div className="footerLogo">
                    <img src="/image/26 copy.png" alt="Logo" />
                </div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod
                    
                </p>
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
                    <Link href="/pages/Pets" className="footer-list-item"><MdKeyboardDoubleArrowRight /> About</Link>
                    {/* <Link href="/pages/Products" className="footer-list-item"><MdKeyboardDoubleArrowRight /> Products</Link> */}
                    <Link href="/pages/Shop" className="footer-list-item"><MdKeyboardDoubleArrowRight /> Shop</Link>
                    <Link href="/pages/Blog" className="footer-list-item"><MdKeyboardDoubleArrowRight /> Blog</Link>
                </div>
          
            </div>

            <div className="recent-detail">
                <h3>Recent</h3>
                <p>Lorem ipsum dolor sit amet dolor sit amet</p>
           
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
                            <p className="address-head">Lorem ipsum dolor sit amet</p>
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
                            <p className="address-head">garden@gmail.com</p>
                        </div>
                    </div>
                </div>


            </div>
        
        </div>

        <div className="footer-buttom">
            <p>&copy; 2024 Treasuremount. All rights reserved.</p>
        </div>
        
    </>
);
};

export default Footer;
