'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { API_URL } from '@/app/services/useAxiosInstance';

function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const imagesFetched = useRef(false);

  const userId = useSelector((state) => state.auth.user?.userId || null);
  const isUser = true;

  const handleViewDetails = (orderId, productId) => {
    console.log("Selected Product ID:", productId);
    console.log("Order ID:", orderId);
    router.push(`/pages/Profile/ViewDetails?orderId=${orderId}&productId=${productId}`);
  };

  const handleTrackOrder = (orderId, productId) => {
    console.log("Tracking Order ID:", orderId);
    console.log("Product ID:", productId);
    router.push(`/pages/Profile/OrderHistory/TrackOrder?orderId=${orderId}&productId=${productId}`);
  };

  useEffect(() => {
    const fetchOrderStatuses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/orderStatus/getAll`);
        if (response.ok) {
          const data = await response.json();
          setOrderStatuses(data);
        } else {
          console.error('Failed to fetch order statuses');
        }
      } catch (err) {
        console.error('Error fetching order statuses:', err);
      }
    };

    fetchOrderStatuses();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        console.error("User ID is not available");
        return;
      }

      try {
        const url = `${API_URL}/api/orders/getAll/${userId}`;
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();

          if (data.length === 0) {
            console.log('No orders found');
            setOrders([]);
          } else {
            setOrders(data);
            console.log(data);
          }
        } else {
          console.error('Failed to fetch orders: Server responded with an error');
          setOrders([]);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [userId]);


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

  const getOrderStatusName = (statusId) => {
    const status = orderStatuses.find(status => status.id === statusId);
    return status ? status.name : 'Unknown';
  };

  // Added check for orders' valid data
  if (!orders && !orderStatuses) {
    return <div>Loading orders and statuses...</div>;
}

if (orders.length === 0) {
  return <div>No orders found for this user.</div>;
}

  return (
    <div className="orderhistory-page">
      <div className="orderhistory-container">
        <h2 className="orderhistory-head">Your Orders</h2>
          <div className="orderhistory-list">
            {orders.map((order) => (
              <div className="orderhistory-card" key={order.id}>
                <img
                  src={imageUrls[order.id] || '/path/to/default-image.jpg'} 
                  alt={order.categoryName}
                  className="orderhistory-image"
                />
                <div className="orderhistory-info">
                  <p className='order-product'>Product Name: {order.productName}</p>
                  <p className='order-product'>Quantity: {order.quantity}</p>
                  <p className="order-description">Product Price: ₹ {order.totalAmount.toFixed(2)}</p>
                  <p className="order-delivery">Order Date: {order.orderDate}</p>
                  <p className="order-delivery">Delivery Date: {order.deliveryDate}</p>
                  <p className="order-delivery">Order Status: {getOrderStatusName(order.orderStatusId)}</p>

                  <div className="order-actions">
                    <button
                      className="btn btn-details"
                      onClick={() => handleViewDetails(order.id, order.productId)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-track"
                      onClick={() => handleTrackOrder(order.id, order.productId)}
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

      </div>
    </div>
  );
}

export default OrderHistoryPage;
