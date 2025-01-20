import React from 'react';
import { BsCheck2 } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";

function Page() {
    return (
        <div className="order-tracking">
            <div className="order-tracking-container">
                <h2 className="order-title">Order Tracking</h2>
                <p className="order-status">
                    <span className="order-id">012345</span> Status: <span className="current-status">Out for Delivery</span>
                </p>

                <div className='progress-bar-container'>
                    <div className="progress-bar">
                        <div className="Bar-container">
                            <div className="completed"><BsCheck2 /></div>
                            <div className="bar-sts">Ordered</div>
                        </div>

                        <div className="line fill"></div>

                        <div className="Bar-container">
                            <div className="completed"><BsCheck2 /></div>
                            <div className="bar-sts">In Transit</div>
                        </div>

                        <div className="line fill "></div>

                        <div className="Bar-container">
                            <div className="completed">
                                <BsCheck2 />
                                </div>
                            <div className="bar-sts">Out for Delivery</div>
                        </div>

                        <div className="line "></div>

                        <div className="Bar-container">
                            <div className="step"></div>
                            <div className="bar-sts">Delivered</div>
                        </div>
                    </div>
                </div>


                <div className="timeline">
                    <div className="timeline-item">
                        <div className="circle completed"></div>
                        <div className="info-container">
                        <div className="info">
                            <span className="status">Out for Delivery<FaArrowRightLong /></span>
                            <span className="time">2024-11-11 10:35 UTC</span>
                        </div>
                        <div className="info-ans">
                            <span className="ans">Out for Delivery</span>
                        </div>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="circle completed"></div>
                        <div className="info-container">
                        <div className="info">
                            <span className="status">In Transit<FaArrowRightLong /></span>
                            <span className="time">2024-11-11 10:35 UTC</span>
                        </div>
                        <div className="info-ans">
                            <span className="ans">In Transit</span>
                        </div>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="circle completed"></div>
                        <div className="info-container">
                        <div className="info">
                            <span className="status">Ordered<FaArrowRightLong /></span>
                            <span className="time">2024-11-11 10:35 UTC</span>
                        </div>
                        <div className="info-ans">
                            <span className="ans">Ordered</span>
                        </div>
                        </div>
                    </div>
                    <button className="show-more">SHOW MORE</button>
                </div>
            </div>
        </div>
    );
}

export default Page;
