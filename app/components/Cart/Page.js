"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const Cart = () => {
  const [orders, setOrders] = useState([]);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/cart/getAll?userId=${2}`
      );
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch orders:", response.status);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleRemove = async (cartId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/cart/remove?userId=${2}&cartId=${cartId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Update the orders list after successful deletion
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== cartId));
        alert("Item removed successfully.");
      } else {
        console.error("Failed to remove item:", response.status);
        alert("Failed to remove item. Please try again.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Error occurred while removing the item.");
    }
  };

  // Calculate the total amount and other required values
  const totalAmount = orders.reduce((total, order) => total + order.price, 0);
  const shippingCharge = 10; // Example shipping charge, adjust as needed
  const tax = 20; // Example tax, adjust as needed
  const subtotal = totalAmount - tax - shippingCharge; // Example calculation

  // Handle place order logic
  const handlePlaceOrder = async () => {
    try {
      // Get current date for orderDate and deliveryDate
      const currentDate = new Date().toISOString().split('T')[0];  

      // Prepare the order data
      const orderData = {
        userId: 2,
        quantity: 1,  
        tax: tax,
        shippingCharge: shippingCharge,
        subtotal: subtotal,
        totalAmount: totalAmount,
        shippingAddress: "chennai", // Example shipping address, you can adjust this logic
        orderDate: currentDate,
        deliveryDate: currentDate, // Assuming delivery date is the same as order date
        productId: 1, 
        orderStatusId: 1, 
        returned: false,
        cancelled: false,
      };

      const response = await fetch("http://localhost:8080/api/orders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([orderData]), // Send the order data as an array
      });

      if (response.ok) {
        // Clear the cart after placing the order
        setOrders([]);
        alert("Order placed successfully!");
      } else {
        console.error("Failed to place order:", response.status);
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error occurred while placing the order.");
    }
  };

  return (
    <div className="orderhistory-page">
      <div className="orderhistory-container">
        <h2 className="orderhistory-head">Your Cart</h2>
        {orders.length > 0 ? (
          <>
            <div className="orderhistory-list">
              {orders.map((order) => (
                <div className="orderhistory-card" key={order.id}>
                  <img
                    src={order.imageUrl}
                    alt={order.categoryName}
                    className="orderhistory-image"
                  />
                  <div className="orderhistory-info">
                    <h3 className="order-title">{order.categoryName}</h3>
                    <p className="order-description">{order.productName}</p>
                    <p className="order-delivery">{order.shopName}</p>
                    <div className="order-actions">
                      <button
                        className="btn btn-details"
                        onClick={() => handleRemove(order.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="order-price">${order.price.toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Display the total amount */}
            <div className="order-total">
              <h3>Total: ${totalAmount.toFixed(2)}</h3>
            </div>

            {/* Place Order Button */}
            <div className="place-order-btn">
           
           <button className="cancel-btn"  >
             Cancel     
           </button>
           <button className="update-btn" onClick={handlePlaceOrder}>
             Place Order     
           </button>
           </div>
          </>
        ) : (
          <p>No items in your cart.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
