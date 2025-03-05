"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/app/services/useAxiosInstance";
import {useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { RiStarSFill } from "react-icons/ri";
import { IoCallOutline } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import "./ViewDetails.scss";


const ViewDetails = ({ order, onNavigate }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({ cancel: false, return: false });
  const productId = order?.productId;
  const orderId = order?.orderId;
  const router = useRouter();
  
  const [cancelStatus, setCancelStatus] = useState(null);
  const [returnStatus, setReturnStatus] = useState(null); 
  const [productDetails, setProductDetails] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [returnReason, setReturnReason] = useState("");

  const [cancelError, setCancelError] = useState("");
  const [returnError, setReturnError] = useState("");


  

  //review
  
  const userId = useSelector((state) => state.auth.user?.userId || null);

  const [showForm, setShowForm] = useState(false);

  const [reviewData, setReviewData] = useState({
    id: 0,
    userId: userId,
    productId: productId,
    rating: 0,
    comments: "",
    isApproved: false,
    createdDate: new Date().toISOString(),
  });
  
  const [errors, setErrors] = useState({
    rating: '',
    comments: ''
  });

  const handleStarClick = (selectedRating) => {
   
    setReviewData((prevData) => ({ ...prevData, rating: selectedRating }));
  
    if (selectedRating >= 1 && selectedRating <= 5) {
      setErrors((prevErrors) => ({ ...prevErrors, rating: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({ ...prevData, [name]: value }));
  
    if (name === 'comments' && value.length <= 500) {
      setErrors(prevErrors => ({ ...prevErrors, comments: '' }));
    }
  };

  const handleClear = () => {
    // Reset rating and comments
    setReviewData((prevData) => ({ ...prevData, rating: 0, comments: "" }));
    setErrors({ rating: "", comments: "" });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = {};
  
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      validationErrors.rating = "Please select a rating between 1 and 5 stars.";
    }
  
    if (!reviewData.comments) {
      validationErrors.comments = 'Comments cannot be empty.';
    } else if (reviewData.comments.length > 500) {
      validationErrors.comments = 'Comments cannot exceed 500 characters.';
    }
  
    if (Object.keys(validationErrors).length === 0) {
      const payload = {
        id: 0,
        userId: reviewData.userId,
        productId: reviewData.productId,
        rating: Number(reviewData.rating),
        comments: reviewData.comments.trim(),
        isApproved: true,
        createdDate: new Date().toISOString(),
      };
  
      try {
        const response = await fetch("http://localhost:8080/api/public/reviews/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          throw new Error("Failed to submit review");
        }
  
        const data = await response.json();
  
        alert("Review submitted successfully!");
        setReviewData({ ...reviewData, rating: "", comments: "" });
        setShowForm(false);
  
      } catch (error) {
        console.error("Error submitting review:", error);
        alert(error.message || "An error occurred while submitting.");
      }
    } else {
      setErrors(validationErrors);
    }
  };


  useEffect(() => {
    if (!orderId) {
      setError("Product ID not found in URL parameters.");
      return;
    }

    // Fetch the API data
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders/getOne/${orderId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [orderId]);



  useEffect(() => {
    if (!productId) {
      setError("Product ID not found in URL parameters.");
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/product/getOne/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch product details.");
        const data = await response.json();
        console.log(data);
        setProductDetails(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProductDetails();
  }, [productId]);


  const handleReturnOrder = async () => {
    if (!orderDetails) return;

    const returnPayload = {
        id: 0,
        orderId: orderDetails.id,
        returnReason: returnReason,
        returnStatus: "Pending",
        requestedDate: new Date().toISOString(),
        approvedDate: null,
        isApproved: false,
        userId: orderDetails.userId,
        createdDate: new Date().toISOString(),
        productId: productId,
    };

    setLoading((prevState) => ({ ...prevState, return: true }));

    try {
        const response = await fetch(`${API_URL}/api/public/return/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(returnPayload),
        });

        if (!response.ok) {
            throw new Error("Failed to submit return request.");
        }

        const result = await response.json();
        console.log("Return API Response:", result);

        fetchReturnDetails(result.id);
    } catch (err) {
        alert(`Error: ${err.message}`);
    } finally {
        setLoading((prevState) => ({ ...prevState, return: false }));
    }
};

const fetchReturnDetails = async (returnId) => {
    try {
        const response = await fetch(`${API_URL}/api/public/return/getOne/${returnId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch return details.");
        }
        const returnDetails = await response.json();
        console.log("Return Details:", returnDetails);
        setReturnStatus(returnDetails);
    } catch (err) {
        console.error("Error fetching return details:", err.message);
    }
};


const handleCancelOrder = async () => {
  if (!orderDetails) return;

  const cancelPayload = {
      id: 0,
      orderId: orderDetails.id,
      cancelReason: cancelReason,
      cancelStatus: "Pending",
      requestedDate: new Date().toISOString(),
      approvedDate: null,
      isApproved: false,
      userId: orderDetails.userId,
      createdDate: new Date().toISOString(),
      productId: productId,
  };

  setLoading((prevState) => ({ ...prevState, cancel: true }));

  try {
      const response = await fetch(`${API_URL}/api/public/cancel/add`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(cancelPayload),
      });

      if (!response.ok) {
          throw new Error("Failed to submit cancellation request.");
      }

      const result = await response.json();
      console.log("Cancel API Response:", result);

      // Fetch the cancel details using the id from the POST response
      fetchCancelDetails(result.id);
  } catch (err) {
      alert(`Error: ${err.message}`);
  } finally {
      setLoading((prevState) => ({ ...prevState, cancel: false }));
  }
};

const fetchCancelDetails = async (cancelId) => {
  try {
      const response = await fetch(`${API_URL}/api/public/cancel/getOne/${cancelId}`);
      if (!response.ok) {
          throw new Error("Failed to fetch cancel details.");
      }
      const cancelDetails = await response.json();
      console.log("Cancel Details:", cancelDetails);
      setCancelStatus(cancelDetails);
  } catch (err) {
      console.error("Error fetching cancel details:", err.message);
  }
};


const isEligibleForReturn = () => {
  if (!orderDetails || !orderDetails.orderDate || !orderDetails.deliveryDate || productDetails.returnWithin == null) {
    return false;
  }

  const deliveryDate = new Date(orderDetails.deliveryDate); 
  const today = new Date();
  const daysSinceDelivered = Math.floor((today - deliveryDate) / (1000 * 60 * 60 * 24));

  return daysSinceDelivered < productDetails.returnWithin; 
};


const submitCancelOrder = () => {
  if (!cancelReason.trim()) {
    setCancelError("Reason is required");
    return;
  }
  handleCancelOrder();
  setShowCancelModal(false);
  setCancelReason("");
  alert("Cancel order submitted successfully");
};

const submitReturnOrder = () => {
  if (!returnReason.trim()) {
    setReturnError("Reason is required");
    return;
  }
  handleReturnOrder();
  setShowReturnModal(false);
  setReturnReason("");
  alert("Return order submitted successfully");
};

const handleBack = () => {
    if (onNavigate) {
      onNavigate("order-history");
    }
  };
  // const handleBack = () => {
  //   onNavigate("order-history"); 
  // };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  const { orderStatusId } = orderDetails;

  return (
    <div className="view-order">
      <div className="view-order-container box-shadow">

        
        <div className="view-order-head p-15">
            <h2>Order Id:{orderDetails.uniqueId}</h2>

            <div className="all-btns">
      
              <div className="btns">

                <div className="add-review-container">
                  {orderStatusId === 6 && !showForm && (
                    <button className="open-review-button" onClick={() => setShowForm(true)}>
                      Add Review
                    </button>
                  )}

                  {showForm && (
                    <div className="reviewpage-overlay">
                      <div className="reviewpage-contents">
                        <div className="reviewpage-head">
                          <h2>Add Review</h2>
                          <button
                            className="close-review-button"
                            onClick={() => {
                              setShowForm(false);
                              setErrors({ rating: "", comments: "" });
                            }}
                          >
                            <IoClose />
                          </button>
                        </div>

                        <div className="reviewpage-content">
                          <form onSubmit={handleSubmit} className="reviewpage-form">
                            <div className="reviewpage-form-inputs">
                              <div className="form">
                                <label>Rating</label>
                                <div className="star-rating">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <RiStarSFill
                                      key={star}
                                      className={`star-icon ${
                                        star <= reviewData.rating ? "selected" : ""
                                      }`}
                                      onClick={() => handleStarClick(star)}
                                    />
                                  ))}
                                </div>
                                {errors.rating && <p className="error-message">{errors.rating}</p>}
                              </div>
                              <div className="form">
                                <label>Comments</label>
                                <textarea
                                  name="comments"
                                  value={reviewData.comments}
                                  onChange={handleChange}
                                  maxLength={250}
                                />
                                {errors.comments && <p className="error-message">{errors.comments}</p>}
                              </div>
                            </div>

                            <div className="reviewpage-buttons">
                              <button type="submit" className="reviewpage-submit-button">
                                Submit
                              </button>
                              <button type="button" className="clear-all-button" onClick={handleClear}>
                                Clear All
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>


                <div className="actionButtons">
                  {/* Cancel Section */}
                  {orderStatusId >= 1 && orderStatusId <= 3 && !cancelStatus?.isApproved && (
                    <button
                      className="cancelButton"
                      onClick={() => setShowCancelModal(true)}
                      disabled={loading.cancel}
                    >
                      {loading.cancel ? "Processing..." : "Cancel Order"}
                    </button>
                  )}

                  {/* Return Section */}
                  {orderStatusId === 6 && isEligibleForReturn() && !returnStatus && (
                    <button
                      className="returnButton"
                      onClick={() => setShowReturnModal(true)}
                      disabled={loading.return}
                    >
                      {loading.return ? "Processing..." : "Return Order"}
                    </button>
                  )}

                  {/* Modal for Cancel Order */}
                  {showCancelModal && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h2>Cancel Order</h2>
                          <button
                            className="close-modal-button"
                            onClick={() => {
                              setShowCancelModal(false);
                              setCancelError("");
                            }}
                          >
                            <IoClose />
                          </button>
                        </div>
                        <div className="modal-body">
                          <label>Reason</label>
                          <textarea
                            value={cancelReason}
                            onChange={(e) => {
                              setCancelReason(e.target.value);
                              setCancelError("");
                              
                            }}
                            placeholder="Enter reason for cancellation"
                            maxLength={250}
                          />
                          {cancelError && <p className="error-message">{cancelError}</p>}
                        </div>
                        <div className="modal-footer">
                          <button
                            onClick={() => {
                              setCancelReason("");
                              setCancelError("");
                            }}
                            disabled={loading.cancel}
                            className="clearButton"
                          >
                            Clear All
                          </button>
                          <button onClick={submitCancelOrder} disabled={loading.cancel}>
                            {loading.cancel ? "Processing..." : "Submit"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modal for Return Order */}
                  {showReturnModal && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h2>Return Order</h2>
                          <button
                            className="close-modal-button"
                            onClick={() => {
                              setShowReturnModal(false);
                              setReturnError("");
                            }}
                          >
                            <IoClose />
                          </button>
                        </div>
                        <div className="modal-body">
                          <label>Reason</label>
                          <textarea
                            value={returnReason}
                            onChange={(e) => {
                              setReturnReason(e.target.value);
                              setReturnError("");
                            }}
                            placeholder="Enter reason for return"
                            maxLength={250}
                          />
                          {returnError && <p className="error-message">{returnError}</p>}
                        </div>
                        <div className="modal-footer">
                          <button
                            onClick={() => {
                              setReturnReason("");
                              setReturnError("");
                            }}
                            disabled={loading.return}
                            className="clearButton"
                          >
                            Clear All
                          </button>
                          <button onClick={submitReturnOrder} disabled={loading.return}>
                            {loading.return ? "Processing..." : "Submit"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                
              </div>

              <div className="back-btn">
          
                <button onClick={handleBack} className="go-back-btn">Back</button>
              </div>
            </div>
        </div>
         
      

      <div className="order-details">
        <div className="order-details-container">
          
          <div className="orderdetails-content">
            <div className="order-details-content-left">
              <div className="order-details-head">
                <h2>Order Item</h2>
              </div>
              <div className="content-left-container">
                <div className="left-content1">
                  <img src={orderDetails.imageUrl} alt="img" />
                  <div className="content-left-content">
                    <p>{orderDetails.productName}</p> 
                    <p>{orderDetails.shopName}</p>
                    <h3>{orderDetails.categoryName}</h3> <h3>||</h3>
                    <h3>{orderDetails.subCategoryName}</h3>
                  </div>
                </div>
                <div className="left-content2">
                  <div className="left-content2-input">
                    {orderDetails.quantity}X ₹{orderDetails.unitPrice}
                  </div>
                  <div className="left-content2-total">
                    {orderDetails.totalAmount}
                  </div>
                </div>
            
              </div>
            </div>

              <div className="order-right-common">
              <div className="order-details-content-right">
                <h2>Customers</h2>
               <div className="order-details-content-address">
                  <p><FaRegUser /> {orderDetails.shippingAddress?.fullName}</p>

                </div>
              </div>

              <div className="order-details-content-rights">
                  <h2>Contact Information</h2>
                  <div className="order-details-content-address">
                  <p><IoCallOutline /> {orderDetails.userEmail}</p>
                  <p><IoMailOutline /> {orderDetails.shippingAddress?.phoneNumber}</p>
                </div>
              </div>
            </div>
          
          </div>

          <div className="orderdetails-summary">
            <div className="orderdetails-summary-left">

              <div className="summary-head">
                <h2>Order Summary</h2>
                  <p
                    className={
                      {
                        Pending: "status-pending",
                        Confirmed: "status-confirmed",
                        Packaging: "status-packaging",
                        Shipped: "status-shipped",
                        "Out for Delivery": "status-outfordelivery",
                        Delivered: "status-delivered",
                        Cancelled: "status-cancelled",
                        Returned: "status-returned",
                        Refunded: "status-refunded",
                      }[orderDetails.orderStatusName] || ""
                      }
                    >
                    {{
                      Pending: "Pending",
                      Confirmed: "Confirmed",
                      Packaging: "Packaging",
                      Shipped: "Shipped",
                      "Out for Delivery": "Out for Delivery",
                      Delivered: "Delivered",
                      Cancelled: "Cancelled",
                      Returned: "Returned",
                      Refunded: "Refunded",
                    }[orderDetails.orderStatusName] || ""}
                  </p>
                </div>

                <div className="orderdetails-summary-left-content">
                    <div className="summary-left">
                        <p>Subtotal</p>
                        <p>{orderDetails.subtotal}</p>
                    </div>
                    <div className="summary-left">
                        <p>Tax</p>
                        <p>{orderDetails.tax}</p>
                    </div>
                    <div className="summary-left">
                        <p>Shipping</p>
                        <p>{orderDetails.shippingCharge}</p>
                    </div>
                    <div className="summary-left">
                        <b>Total</b>
                        <p>{orderDetails.totalAmount}</p>
                    </div>
                </div>
            </div>
            <div className="orderdetails-summary-right">
                <h2>Billing Address</h2> 
                <div className="orderdetails-content-address">
                <p><FaRegUser />  {orderDetails.shippingAddress?.fullName}</p>

                <p><IoLocationOutline  />{orderDetails.shippingAddress?.addressLine1}</p>
                <p> {orderDetails.shippingAddress?.addressLine2}</p>
                <p> {orderDetails.shippingAddress?.countryName}</p>
                <p> {orderDetails.shippingAddress?.postalCode}</p>
                
                </div>
            </div>
          </div>
        </div>
      </div>
        
      </div>

  
    </div>
  );
};  

export default ViewDetails;
