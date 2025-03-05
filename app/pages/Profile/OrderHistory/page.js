'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Pagination from "@/app/utils/Pagenation/Pagenation";
import { API_URL } from '@/app/services/useAxiosInstance';
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/app/redux/slices/loadingSlice";

function OrderHistoryPage(  { onNavigate }) {
  const router = useRouter();

  const dispatch = useDispatch();
const userId = useSelector((state) => state.auth?.user?.userId || null);


  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); 
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const imagesFetched = useRef(false);
  const [filters, setFilters] = useState({ OrderStatus: '', startDate: '', endDate: '' }); 

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; 

  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage); 
  
  // Paginate the filtered orders
  const paginatedOrders = filteredOrders.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handleViewDetails = (orderId, productId) => {
    console.log("Selected Product ID:", productId);
    console.log("Order ID:", orderId);

    // Create a mock order object or retrieve from state
    const selectedOrder = {
      orderId,
      productId,    
    };

    // Navigate to the view-Order-history section with the selected order details
    onNavigate("view-Order-history", selectedOrder);
  };
  // Fetch order statuses
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

  // Fetch orders (called once when component mounts)
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        console.error("User ID is not available");
        return;
      }

      try {
         dispatch(startLoading());
        const url = `${API_URL}/api/orders/getAll/${userId}`;
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();

          if (data.length === 0) {
            console.log('No orders found');
            setOrders([]); 
            setFilteredOrders([]);
          } else {
            setOrders(data);
            setFilteredOrders(data);
          }
        } else {
          console.error('Failed to fetch orders: Server responded with an error');
          setOrders([]); 
          setFilteredOrders([]); 
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]); 
        setFilteredOrders([]); 
      }
      finally{
        dispatch(stopLoading());
      }
    };

    fetchOrders();
  }, [userId]);

  // Fetch images for orders
  useEffect(() => {
    if (orders.length > 0 && !imagesFetched.current) {
      fetchImagesForOrders(orders);
    }
  }, [orders]);

  const fetchImagesForOrders = async (orders) => {
    if (imagesFetched.current) return;

    try {
      dispatch(startLoading());
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
    finally{
        dispatch(stopLoading());
     }
  };

  const getOrderStatusName = (statusId) => {
    const status = orderStatuses.find(status => status.id === statusId);
    return status ? status.name : 'Unknown';
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Apply filters based on selected values
  const applyFilters = () => {
    let filtered = [...orders]; 
    setCurrentPage(0);
    // Filter orders based on selected filters
    if (filters.OrderStatus) {
      filtered = filtered.filter(order => order.orderStatusId == filters.OrderStatus);
    }

    if (filters.startDate) {
      filtered = filtered.filter(order => new Date(order.orderDate) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(order => new Date(order.orderDate) <= new Date(filters.endDate));
    }

    setFilteredOrders(filtered);
  };

  // Clear filters and show all orders again
  const clearFilters = () => {
    setFilters({ OrderStatus: '', startDate: '', endDate: '' }); 
    setFilteredOrders(orders); 
  };

  if (!orders || !orderStatuses) {
    return <div>Loading orders and statuses...</div>;
  }

  // if (orders.length === 0) {
  //   return <div>No orders found for this user.</div>;
  // }

  return (
    <div className="orderhistory-page">
      <div className="orderhistory-container">
        <div className="orderhistory-header">
          <div className="box-container">
            <h2 className="orderhistory-head">Your Orders</h2>
          </div>
        {/* Filter Section */}
          <div className="orderhistory-filters">

            <div className="box-container">
              <select name="OrderStatus" value={filters.OrderStatus} onChange={handleFilterChange}>
                <option value="">All Statuses</option>
                {orderStatuses.map((status) => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
           
            <div className="input-container">
              <label htmlFor="startDate" className="date-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="date-input"
              />
            </div>

           <div className="input-container">
            <label htmlFor="startDate" className="date-label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              placeholder="End Date"
            />
           </div>

            <div className="box-container">
              <button onClick={applyFilters} className="btn-apply">Search</button>
              <button onClick={clearFilters} className="btn-clear">Clear</button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="orderhistory-list">
          {paginatedOrders .map((order) => (
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
                <p className="order-delivery">
                  {order.orderDate ? `Order Date: ${new Date(order.orderDate).toLocaleDateString('en-GB').replace(/\//g, '-')}` : ''}
                </p>
                <p className="order-delivery">
                  {order.deliveryDate ? `Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString('en-GB').replace(/\//g, '-')}` : ''}
                </p>

                <p className="order-delivery">Order Status: {getOrderStatusName(order.orderStatusId)}</p>
                <div className="order-actions">
                  <button
                    className="btn btn-details"
                    onClick={() => handleViewDetails(order.id, order.productId)}
                  >
                    View Details
                  </button>
             
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          setCurrentPage={setCurrentPage}
        />

      </div>
    </div>
  );
}

export default OrderHistoryPage;
