"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaPlus, FaMinus } from "react-icons/fa";
import { API_URL } from "@/app/services/useAxiosInstance";

const Card = () => {
  const [orders, setOrders] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const userId = useSelector((state) => state.auth?.user?.userId);

  console.log("userId",userId);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${API_URL}/cart/getAll?userId=${userId}`
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
        `${API_URL}/cart/remove?userId=${userId}&cartId=${cartId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== cartId)
        );
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

  const decrementQuantity = async (id) => {
    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        if (order.id === id) {
          const updatedCount = Number(order.quantity) - 1;
          if (updatedCount >= 1) {
            updateQuantity(id, updatedCount);
            return { ...order, quantity: updatedCount };
          }
        }
        return order;
      });
    });
  };

  const updateQuantity = async (cartId, updatedCount) => {
    try {
      const response = await fetch(
        `${API_URL}/cart/addQuantity/${cartId}?incrementBy=${updatedCount}`,
        { method: "PATCH" }
      );

      if (response.ok) {
        const responseData = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === cartId
              ? { ...order, quantity: responseData.newQuantity }
              : order
          )
        );
      } else {
        console.error("Failed to update quantity:", response.status);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const incrementQuantity = async (id) => {
    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        if (order.id === id) {
          const updatedCount = Number(order.quantity) + 1;
          if (updatedCount <= order.actualQuantity) {
            updateQuantity(id, updatedCount);
            return { ...order, quantity: updatedCount };
          } else {
            setErrorMessages((prevMessages) => ({
              ...prevMessages,
              [order.id]: `Maximum available quantity is ${order.actualQuantity}`,
            }));
          }
        }
        return order;
      });
    });
  };

  const handlePlaceOrder = () => {
    let isOrderValid = true;
    orders.forEach((order) => {
      if (order.quantity > order.actualQuantity) {
        setErrorMessages((prevMessages) => ({
          ...prevMessages,
          [order.id]: `The quantity for ${order.productName} exceeds the available stock. Maximum quantity: ${order.actualQuantity}. Remove this one for Placing Order`,
        }));
        isOrderValid = false;
      }
    });

    if (isOrderValid) {
      orders.forEach((order) => {
        router.push(
          `/pages/Cart/PlaceOrder?cartId=${order.id}&productId=${order.productId}&count=${order.quantity}`
        );
        console.log(`Placing order for ${order.productName} with quantity ${order.quantity}`);
      });
    }
  };

  const totalAmount = orders.reduce(
    (total, order) => total + order.price * order.quantity,
    0
  );

const [imageUrls, setImageUrls] = useState({});
const imagesFetched = useRef(false);


useEffect(() => {
  if (orders.length > 0 && !imagesFetched.current) {
    fetchImagesForOrders(orders);
  }
}, [orders]);

const fetchImagesForOrders = async (orders) => {
  if (imagesFetched.current) return;

  try {
    const images = {};
    await Promise.all(
      orders.map(async (order) => {
        const response = await fetch(
          `${API_URL}/api/public/productImages/getAll/${order.productId}?positionId=1`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            images[order.id] = data[0].imageUrl;
          }
        }
      })
    );
    setImageUrls(images);
    imagesFetched.current = true;
  } catch (error) {
    console.error("Error fetching order images:", error);
  }
};


  return (
    <div className="cartpage">
      <div className="cartpage-container">
        <h2 className="cartpage-head">Your Cart</h2>
        {orders.length > 0 ? (
          <>
            <div className="cartpage-list">
              {orders.map((order) => (
                <div className="cartpage-card" key={order.id}>
                   <div className="product-card-img">
                      {imageUrls[order.id] ? (
                        <img
                          src={imageUrls[order.id]}
                          alt={order.productName}
                          className="cartpage-image"
                        />
                      ) : (
                        <p>Image not available</p>
                      )}
                    </div>



                  <div className="cartpage-info">
                    <h3 className="cartpage-title">{order.categoryName}</h3>
                    <p className="cartpage-description">Name: {order.productName}</p>
                    <p className="cartpage-description">Quantity: {order.quantity}</p>
                    <p className="cartpage-delivery">Shop Name: {order.shopName}</p>
                    <div className="cartpage-actions">
                      <button
                        className="btn btn-details"
                        onClick={() => handleRemove(order.id)}
                      >
                        Remove
                      </button>
                    </div>
                    {errorMessages[order.id] && (
                      <div className="error-message">
                        {errorMessages[order.id]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <h3>Total: ₹ {totalAmount.toFixed(2)}</h3>
            </div>

            <div className="place-order-btn">
              <button
                className="update-btn"
                onClick={handlePlaceOrder}
              >
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

export default Card;
