"use client";

import React, { useState, useEffect  } from "react";
import axios from "axios";
import "./Shop.scss";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/services/useAxiosInstance";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/app/redux/slices/loadingSlice";

const Shoppage = () => {

  const router = useRouter();
  const [shops, setShops] = useState([]);

  const dispatch = useDispatch();

  const fetchShops = async () => {
    try {
      dispatch(startLoading());
      const res = await axios.get(`${API_URL}/api/public/vendor/getAll`);
      
      // Filter the fetched shops to include only those with activeStatus === true
      const fetchedShops = Array.isArray(res.data) 
        ? res.data.filter(shop => shop.activeStatus === true) 
        : [];
      
      setShops(fetchedShops);
      console.log(fetchedShops);
      dispatch(stopLoading());
    } catch (error) {
      console.error("Error fetching shops:", error);
      setShops([]);
      setFilteredProducts([]);
    }
  };
  
  useEffect(() => {
    fetchShops();
  }, []);


  const handleShowDetails = async (userId) => {
    try {    
  
      router.push(`/pages/Shop/ShopDetails?id=${userId}`);
    } catch (error) {
      console.error("Error fetching shop details:", error);
    }
  };
  

  return (
    <div className="shop-page">
      <div className="shoppage-Container">
        <div className="shoppage-Head">
          <div className="shoppage-Head-Container">
            <h2>Available Shops</h2>
            <p>Choose your perfect pet shop</p>
          </div>
        
        </div>

        <div className="shoppage-Content">
          <div className="template-Cards">
            <div className="cards-Container">
              {shops.map((shop, index) => (
                 <div
                    key={index}
                    className="card"
                    onClick={() => handleShowDetails(shop.userId)}
                  >

                  <div className="product-card-img">
                    <img
                      src={shop.imageUrl|| "default-placeholder.jpg"} 
                      alt={`${shop.name}`}
                      className="default-img"
                    />
                  </div>

                  <div className="card-Details">
                    <p className="card-Title">{shop.name}</p>

                    <div className="details">
                      <h5> Shop Name:</h5>
                      <p>{shop.shopName || "Shop Name not available"}</p>
                    </div>
                   
                    <div className="details">
                      <h5>Address:</h5>
                      <p>{shop.address || "Address not available"}</p>
                    </div>

                    <div className="details">
                      <h5>City:</h5>
                      <p>{shop.city || "Location not available"}</p>
                    </div>

                    <div className="details">
                      <h5>Postal Code:</h5>
                      <p>{shop.postalCode|| "Postal Code not available"} </p>
                    </div>

                   
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

   
      </div>
    </div>
  );
};

export default Shoppage;
