"use client"; 

import React, { useState } from 'react';
import { IoIosArrowForward, IoIosArrowDown   } from "react-icons/io";

const OrderDetails = () => {

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const questions = [
        { question: "Track Package", answer: "Our return policy allows you to return items within 30 days of purchase." },
        { question: "Request Cancellation", answer: "You can track your order by clicking the tracking link in your order confirmation email." },
        { question: "Return or Replace Items", answer: "Once an order is placed, it cannot be changed, but you can cancel and reorder." },
        { question: "Write Product Review", answer: "Once an order is placed, it cannot be changed, but you can cancel and reorder." }
    ];

    return (
        <div className="detailsPage">
            <div className="detailsPageContainer">
                <div className="detailsPageContent">
                    <h2 className="details">Order Details</h2>
                    <div className="detailsSection1">
                        <div className='detailsinformation'>
                            <h5 className='detailsinformationhead'>Order Date</h5>
                            <p className='detailsinformationAns'>18-Nov-2024</p>
                        </div>
                        <div className='detailsinformation'>
                            <h5 className='detailsinformationhead'>Order Id</h5>
                            <p className='detailsinformationAns'>12345</p>
                        </div>
                        <div className='detailsinformation'>
                            <h5 className='detailsinformationhead'>Order Total</h5>
                            <p className='detailsinformationAns'>$60.00</p>
                        </div>
                    </div>
                    <div className="detailsSection2">
                        <div className="detailsCard">
                            <div className="detailsImage">
                                <img src="/image/tap-2.png" alt="Merry Makings 1" />
                            </div>
                            <div className="detailsDetails">
                                <h3 className='detailsDetailsh3'>Merry Makings 1</h3>
                                <p className='detailsDetailsp'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                    do eiusmod tempor incididunt ut labore dolore adipiscing elit,
                                    sed do eiusmod tempor consectetur.
                                </p>
                                <p className="offerEnding">Arriving Mon, 18 November</p>
                            </div>
                        </div>
                    </div>
                    <div className='detailsSection3'>
                        <div className='SubProgramQuest'>
                            <div className="questionsContainer">
                                {questions.map((item, index) => (
                                    <div key={index} className="question">
                                        <button onClick={() => toggleFAQ(index)}>
                                            <span>{item.question}</span>
                                            {activeIndex === index ? (
                                                <IoIosArrowDown   className="arrow" />
                                            ) : (
                                                <IoIosArrowForward  className="arrow" />
                                            )}
                                        </button>
                                        <p className={`${"answer"} ${activeIndex === index ? "show" : ''}`}>
                                            {item.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
