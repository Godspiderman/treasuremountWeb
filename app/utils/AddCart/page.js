"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setCartCount } from "@/app/redux/slices/authSlice";
import { API_URL } from "@/app/services/useAxiosInstance";

const AddToCartButton = ({ product }) => {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const userId = useSelector((state) => state.auth?.user?.userId || null);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/pages/Login");
      return;
    }

    if (count > product?.stockQuantity) {
      alert("You cannot add more than the available stock.");
      return;
    }

    setLoading(true);

    const requestBody = {
      userId: userId,
      productId: product?.id,
      initialQuantity: count,
    };

    try {
      console.log("Fetching data for productId:", product?.id);
      
      // Check if the product is already in the cart
      const checkResponse = await fetch(
        `https://petsshopapi-d6dccjc9bne5g7ce.centralindia-01.azurewebsites.net/cart/getOne?ProductId=${product?.id}&userId=${userId}`
      );

      if (!checkResponse.ok) {
        throw new Error(`Error: ${checkResponse.status} - ${checkResponse.statusText}`);
      }

      const checkData = await checkResponse.text();
      const parsedData = checkData ? JSON.parse(checkData) : null;

      if (parsedData) {
        const newQuantity = parsedData.quantity + count;

        if (newQuantity > product?.stockQuantity) {
          alert("Cannot add more than the available stock in the cart.");
          return;
        }

        const increaseQuantityResponse = await fetch(
          `https://petsshopapi-d6dccjc9bne5g7ce.centralindia-01.azurewebsites.net/cart/addQuantity/${parsedData.id}?incrementBy=${newQuantity}`,
          {
            method: "PATCH",
          }
        );

        if (!increaseQuantityResponse.ok) {
          throw new Error(`Error: ${increaseQuantityResponse.status} - ${increaseQuantityResponse.statusText}`);
        }

        alert("Product quantity updated in cart!");
   

      } else {
        const response = await axios.post("https://petsshopapi-d6dccjc9bne5g7ce.centralindia-01.azurewebsites.net/cart/add", requestBody, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
   
          alert("Product added to cart successfully!");
          fetchCartItems();
        } else {
          alert("Failed to add to cart. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred while adding to the cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactNow = () => {
    if (!isAuthenticated) {
      router.push("/pages/Login");
      return;
    }
    if (product?.categoryId) {
      router.push(`/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}&showContainer=true`);
    } else {
      alert("Category information is missing.");
    }
  };



    
  const fetchCartItems = async () => {
    console.log("start");
    
    try {
      const response = await fetch(`${API_URL}/cart/getAll?userId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("ds");
        
        dispatch(setCartCount(data.length)); // ✅ Properly update total cart count
      } else {
        console.error("Failed to fetch cart items:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId, dispatch]);

  return (
    <div className="common-btn-container">
      {product?.categoryId === 1 || product?.categoryId === 7 ? (
        <button className="contact-now-btn" onClick={handleContactNow}>
          Contact Now
        </button>
      ) : product?.stockQuantity === 0 ? (
        <button className="out-of-stock-btn" disabled>
          Out of Stock
        </button>
      ) : (
        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={loading}>
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
