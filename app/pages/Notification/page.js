"use client";

import React from 'react';
import { useRouter } from "next/navigation";

function NotificationPage() {
    const router = useRouter();

    const handleViewDetails = () => {
        router.push("/pages/Notification/DetailsPage");
    };

    return (
        <div className="notificationpage">
            <div className="notificationpageContainer">
                <div className="notificationpageContent">
                    <h2 className="notification">Notification</h2>
                    <div className="notificationSection">
                        <div className="notificationCard">
                            <div className="notificationImage">
                                <img src="/image/tap-2.png" alt="Merry Makings 1" />
                            </div>
                            <div className="notificationDetails">
                                <h3 className='notificationDetailsh3'>50% Offer Live Now.. Merry Makings 1</h3>
                                <p className='notificationDetailsp'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                    do eiusmod tempor incididunt ut labore dolore adipiscing elit,
                                    sed do eiusmod tempor consectetur.
                                </p>
                                <p className="offerEnding">Offer Ending Mon, 18 November</p>
                                <div className="actionButtons">
                                    <button className="deleteButton">Delete</button>
                                    <button className="viewButton" onClick={handleViewDetails}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='notificationShopbtn'>
                            <button className="shopNowButton">Shop Now</button>
                        </div>
                    </div>

                    <div className="notificationSection">
                        <div className="notificationCard">
                            <div className="notificationImage">
                                <img src="/image/tap-1.png" alt="Merry Makings 1" />
                            </div>
                            <div className="notificationDetails">
                                <h3 className='notificationDetailsh3'>50% Offer Live Now.. Merry Makings 1</h3>
                                <p className='notificationDetailsp'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                    do eiusmod tempor incididunt ut labore dolore adipiscing elit,
                                    sed do eiusmod tempor consectetur.
                                </p>
                                <p className="offerEnding">Offer Ending Mon, 18 November</p>
                                <div className="actionButtons">
                                    <button className="deleteButton">Delete</button>
                                    <button className="viewButton" onClick={handleViewDetails}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='notificationShopbtn'>
                            <button className="shopNowButton">Shop Now</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default NotificationPage;
