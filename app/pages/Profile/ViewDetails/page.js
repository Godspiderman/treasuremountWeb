"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const ViewDetails = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({ cancel: false, return: false });
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const orderId = searchParams.get("orderId");
  const [cancelStatus, setCancelStatus] = useState(null); // { isApproved: boolean }
  const [returnStatus, setReturnStatus] = useState(null); // { isApproved: boolean }
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError("Product ID not found in URL parameters.");
      return;
    }

    // Fetch the API data
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/getOne/${orderId}`);
        
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
        const response = await fetch(`http://localhost:8080/api/public/product/getOne/${productId}`);
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
        returnReason: "User-requested return",
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
        const response = await fetch("http://localhost:8080/api/public/return/add", {
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

        // Fetch the return details using the id from the POST response
        fetchReturnDetails(result.id);
    } catch (err) {
        alert(`Error: ${err.message}`);
    } finally {
        setLoading((prevState) => ({ ...prevState, return: false }));
    }
};

const fetchReturnDetails = async (returnId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/public/return/getOne/${returnId}`);
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
      cancelReason: "User-requested cancellation",
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
      const response = await fetch("http://localhost:8080/api/public/cancel/add", {
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
      const response = await fetch(`http://localhost:8080/api/public/cancel/getOne/${cancelId}`);
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


  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  const { orderStatusId } = orderDetails;

  return (
    <div className="viewDetails">
      <div className="viewDetailsContainer">
        
        <div className="viewDetailsHead">
         <h1>Order Details</h1>
        </div>

        <div className="viewDetailsContent">
          <div className="viewDetailsProduct">
            <h4>Order Details :</h4>
            <p><strong>User Name:</strong> {orderDetails.userName}</p>
            <p><strong>Product Name:</strong> {orderDetails.productName}</p>
            <p><strong>Unit Price:</strong> ₹ {orderDetails.unitPrice.toFixed(2)}</p>
            <p><strong>Quantity:</strong> {orderDetails.quantity}</p>
            
            <p><strong>Total Amount:</strong> ₹ {orderDetails.totalAmount.toFixed(2)}</p>
            <p><strong>Order Status:</strong> {orderDetails.orderStatusName}</p>
            <p><strong>Order Date:</strong> {orderDetails.orderDate}</p>
            <p><strong>Delivery Date:</strong> {orderDetails.deliveryDate}</p>
          
          </div>  
          <div className="viewDetailsProduct">
              
            <ul>
                <h4>User Details :</h4>    
                <li><strong>Full Name:</strong> {orderDetails.shippingAddress.fullName}</li>
                <li><strong>Phone Number:</strong> {orderDetails.shippingAddress.phoneNumber}</li>
                <li><strong>Address Line 1:</strong> {orderDetails.shippingAddress.addressLine1}</li>
                <li><strong>City:</strong> {orderDetails.shippingAddress.city}</li>
                <li><strong>Postal Code:</strong> {orderDetails.shippingAddress.postalCode}</li>
            </ul>
          </div>
        </div>
        
        <div className="actionButtons">
          {/* Cancel Section */}
          {orderStatusId >= 1 && orderStatusId <= 3 && !cancelStatus?.isApproved && (
            cancelStatus ? (
              cancelStatus.isApproved ? (
                <p style={{ color: "green" }}>
                  Order has been canceled successfully.
                </p>
              ) : (
                <p style={{ color: "green" }}>
                  Order cancellation is being processed.
                </p>
              )
            ) : (
              <button
                className="cancelButton"
                onClick={handleCancelOrder}
                disabled={loading.cancel}
              >
                {loading.cancel ? "Processing..." : "Cancel Order"}
              </button>
            )
          )}

          {/* Return Section */}
          {orderStatusId === 6 && (
            isEligibleForReturn() ? (
              returnStatus ? (
                <p style={{ color: "green" }}>
                  {returnStatus.isApproved
                    ? "Order has been returned successfully."
                    : "Order return is being processed."}
                </p>
              ) : (
                <button className="returnButton" onClick={handleReturnOrder} disabled={loading.return}>
                  {loading.return ? "Processing..." : "Return Order"}
                </button>
              )
            ) : (
              <p style={{ color: "red" }}>Product is no longer eligible for return.</p>
            )
        )}

        </div>


      </div>
    </div>
  );
};

export default ViewDetails;
