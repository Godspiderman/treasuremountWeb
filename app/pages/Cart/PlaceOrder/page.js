"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/app/redux/slices/loadingSlice";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/services/useAxiosInstance";

import { clearCartItems } from '@/app/redux/slices/cartSlice';

const PlaceOrder = () => {
  const dispatch = useDispatch();
  //form data
  const userId = useSelector((state) => state.auth.user?.userId || null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    userId: userId,
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    countryId: "",
    stateId: "",
    createDate: "",
    updateDate: "",
    defaultAddress: true,
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [imageUrls, setImageUrls] = useState({});
  const imagesFetched = useRef(false);
  const [loading, setLoading] = useState(true);
  const [shippingCharges, setShippingCharges] = useState([]);

  useEffect(() => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 10);

    setFormData((prev) => ({
      ...prev,
      createDate: currentDate.toISOString(),
      updateDate: futureDate.toISOString(),
    }));
  }, []);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/public/country/getAll`
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData.countryId) {
      const fetchStates = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/api/public/state/getAll`
          );
          const filteredStates = response.data.filter(
            (state) => state.countryId === parseInt(formData.countryId)
          );
          setStates(filteredStates);
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };

      fetchStates();
    } else {
      setStates([]);
    }
  }, [formData.countryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });

    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    if (!formData.addressLine1)
      newErrors.addressLine1 = "Address Line 1 is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.postalCode) newErrors.postalCode = "Postal Code is required";
    if (!formData.countryId) newErrors.countryId = "Country is required";
    if (!formData.stateId) newErrors.stateId = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    dispatch(startLoading());
    console.log(formData);

    try {
      const response = await axios.post(
        `${API_URL}/api/public/shippingAddress/add`,
        formData
      );
      alert("Address Added successfully!");
      console.log(response.data);

      const currentDate = new Date();
      const futureDate = new Date(currentDate);
      futureDate.setDate(currentDate.getDate() + 10);

      setFormData({
        fullName: "",
        userId: userId,
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        postalCode: "",
        countryId: "",
        stateId: "",
        createDate: currentDate.toISOString(),
        updateDate: futureDate.toISOString(),
        defaultAddress: true,
      });
      setErrors({});
      fetchAddresses();
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error placing the order:", error);
      alert("Failed to place the order.");
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleCancel = () => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 10);

    setFormData({
      fullName: "",
      userId: 0,
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postalCode: "",
      countryId: "",
      stateId: "",
      createDate: currentDate.toISOString(),
      updateDate: futureDate.toISOString(),
      defaultAddress: true,
    });
    setErrors({});
    setIsFormVisible(false);
  };


  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  // Fetch Cart Items
  useEffect(() => {
    const fetchCartData = async () => {
      //dispatch(stopLoading());
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/cart/getAll?userId=${userId}`);
        setCartItems(response.data);
        console.log("Fetched Cart Items:", response.data);
      } catch (err) {
        console.error("Failed to fetch cart items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCartData();
  }, []);
  const fetchAddresses = async () => {
    try {
      dispatch(startLoading());
      const response = await axios.get(
        `${API_URL}/api/public/shippingAddress/getAll/${userId}`
      );
      if (response.data.length === 1) {
        setAddresses(response.data);
        setSelectedAddressId(response.data[0].id);
        setSelectedAddress(response.data[0]);
      }
      setAddresses(response.data);

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);


  const fetchShippingCharge = async (productId, destinationPinCode, orderWeight) => {
    console.log(productId, destinationPinCode, orderWeight);

    try {
      const response = await axios.get(
        `${API_URL}/api/public/delhivery/checkServiceability`,
        {
          params: {
            productId,
            destinationPinCode,
            orderWeight,
          },
        }
      );

      console.log("API Response:", response.data);

      // If the response is an empty array or invalid, return 0 as the shipping charge
      if (!response.data || response.data.length === 0) {
        return 0;
      }

      return response.data.shippingCharge || 0; // Return 0 if shippingCharge is not available
    } catch (error) {
      console.error("Error fetching shipping charge:", error);
      return 0; // Return 0 in case of error
    }
  };

  // Example usage when an address is selected
  const handleAddressChange = async (addressId) => {
    console.log("Selected Address ID:", addressId);

    const selected = addresses.find((address) => address.id === parseInt(addressId));
    console.log("Selected Address:", selected);

    if (selected) {
      console.log("Selected Address Postal Code:", selected.postalCode);

      if (cartItems.length === 0) {
        console.log("No items in the cart.");
        return;
      }

      // Iterate over cart items and fetch shipping charges
      const shippingCharges = await Promise.all(
        cartItems.map(async (cartItem) => {
          console.log("Fetching Shipping Charge for:");
          console.log("Product ID:", cartItem.productId);
          console.log("Postal Code:", selected.postalCode);
          console.log("Weight:", cartItem.weight);

          const shippingCharge = await fetchShippingCharge(
            cartItem.productId,
            selected.postalCode,
            cartItem.weight
          );

          return {
            productId: cartItem.productId,
            postalCode: selected.postalCode,
            weight: cartItem.weight,
            shippingCharge: shippingCharge, // Use the fetched shipping charge or 0 if not available
          };
        })
      );

      console.log("Shipping Charges:", shippingCharges);

      // Update the state/UI with the calculated shipping charges
      // You can store the shipping charges in the state if needed
      setShippingCharges(shippingCharges);
    }

    setSelectedAddress(selected);
    setSelectedAddressId(addressId);
  };

  const handleAddNewAddress = () => {
    setIsFormVisible(true);
  };
  //card data

  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");
  const [cartItems, setCartItems] = useState([]);
  console.log("userId", userId);




  // Calculate totals
  const calculateTotals = () => {
    let totalAmount = 0;
    let totalTax = 0;

    const updatedItems = cartItems.map((item) => {
        const unitPrice = item.price;
        const quantity = item.quantity;
        const tax = unitPrice * 0.1;
        const subtotal = unitPrice * quantity + tax;

        // Get the shipping charge for this specific product
        const shippingCharge = shippingCharges.find((charge) => charge.productId === item.productId)?.shippingCharge || 0;

        totalTax += tax * quantity;
        totalAmount += subtotal + shippingCharge; // Ensures only numbers are added

        return {
            productId: item.productId,
            productName: item.productName,
            unitPrice,
            quantity,
            tax,
            shippingCharge,
            subtotal,
        };
    });

    console.log("Transformed Items for Order:", updatedItems);
    console.log("Calculated Total Tax:", totalTax);
    console.log("Calculated Grand Total:", totalAmount.toFixed(2)); // Ensuring it's a number

    return { updatedItems, totalTax, totalAmount };
};


  const { updatedItems, totalTax, totalAmount } = calculateTotals();

  // Handle Place Order
  const handlePlaceOrder = async () => {

    if (!selectedAddressId) {
      alert("Please select a shipping address before placing the order.");
      return; // Stop execution if no address is selected
    }

    const { updatedItems, totalAmount } = calculateTotals();

    const orderPayload = updatedItems.map((item) => ({
      userId: userId,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      tax: totalTax,
      shippingCharge: item.shippingCharge,
      subtotal: item.subtotal,
      totalAmount: totalAmount,
      orderDate: new Date().toISOString(),
      // deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
      deliveryDate: null,
      cancelled: false,
      returned: false,
      shippingAddressId: selectedAddressId,
      productId: item.productId,
      orderStatusId: 1,
    }));
    dispatch(startLoading());
    try {
      // Place order
      console.log("Final Payload to API:", JSON.stringify(orderPayload, null, 2));
      const orderResponse = await axios.post(
        `${API_URL}/api/orders/add`,
        orderPayload
      );

      console.log("Order placed successfully:", orderResponse.data);
      alert("Order placed successfully!");

      try {
        if (cartItems.length === 0) {
          console.log("No items in the cart to clear.");
          return;
        }

        console.log("Cart Items Before Deletion:", cartItems);

        await Promise.all(
          cartItems.map(async (item) => {
            if (!item.id) {
              console.warn(`Skipping item with missing cartId:`, item);
              return;
            }

            await axios.delete(
              `${API_URL}/cart/remove?userId=${userId}&cartId=${item.id}`
            );
            console.log(`Deleted cart item with ID: ${item.id}`);
          })
        );

        console.log("All cart items cleared successfully!");
        alert("Cart cleared successfully!");

        setCartItems([]);
        dispatch(clearCartItems());

        router.push("/pages/Products")
      } catch (cartError) {
        console.error("Failed to clear cart:", cartError);
        alert("Order placed, but failed to clear cart.");
      }
    } catch (orderError) {
      console.error("Error placing order:", orderError);
      alert("Failed to place the order. Please try again.");
    } finally {
      dispatch(stopLoading());
    }
  };


  useEffect(() => {
    if (updatedItems.length > 0 && !imagesFetched.current) {
      fetchImagesForOrders(updatedItems);
    }
  }, [updatedItems]);

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
              images[order.productId] = data[0].imageUrl;
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

    <div className="placeOrder">
      <div className="placeOrderContainer">
        <div className="placeOrderHead">
          <h2>Place Order</h2>
        </div>

        {!isFormVisible && (
          <>
            <div className="placeOrderContentMain">
              <div className="placeOrderContentHead">
                <h2>Shipping Address</h2>
                <button onClick={handleAddNewAddress}>Add New Address</button>
              </div>

              {addresses.length > 1 ? (
                <div className="placeOrderContent">
                  <label htmlFor="addressSelect">
                    <strong>Select Address:</strong>
                  </label>
                  <select
                    id="addressSelect"
                    className="addressDropdown"
                    value={selectedAddressId || ""}
                    onChange={(e) => handleAddressChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select an Address
                    </option>
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.fullName} - {address.city}, {address.postalCode}
                      </option>
                    ))}
                  </select>
                </div>
              ) : addresses.length === 0 ? (
                <p>No Addresses Available, Please Add a New Address</p>
              ) : null}

              {selectedAddress && (
                <div>
                  {/* <h4>Shipping Address Details</h4> */}
                  <p>
                    <strong>Full Name:</strong> {selectedAddress.fullName}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {selectedAddress.phoneNumber}
                  </p>
                  <p>
                    <strong>Address Line 1:</strong> {selectedAddress.addressLine1}
                  </p>
                  <p>
                    <strong>Address Line 2:</strong> {selectedAddress.addressLine2}
                  </p>
                  <p>
                    <strong>City:</strong> {selectedAddress.city}
                  </p>
                  <p>
                    <strong>Postal Code:</strong> {selectedAddress.postalCode}
                  </p>
                </div>
              )}

            </div>
          </>
        )}

        {isFormVisible && (
          <form className="placeOrderForm" onSubmit={handleSubmit}>
            <div className={`formGroup ${errors.fullName ? "errorGroup" : ""}`}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                className={`inputField ${errors.fullName ? "inputError" : ""}`}
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div
              className={`formGroup ${errors.phoneNumber ? "errorGroup" : ""}`}
            >
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                className={`inputField ${errors.phoneNumber ? "inputError" : ""}`}
                maxLength={10} // Restrict length to 10 characters
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div
              className={`formGroup ${errors.addressLine1 ? "errorGroup" : ""}`}
            >
              <label>Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                className={`inputField ${errors.addressLine1 ? "inputError" : ""
                  }`}
                value={formData.addressLine1}
                onChange={handleChange}
              />
            </div>

            <div className="formGroup">
              <label>Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                className={`inputField ${errors.addressLine1 ? "inputError" : ""
                  }`}
                value={formData.addressLine2}
                onChange={handleChange}
              />
            </div>

            <div className={`formGroup ${errors.city ? "errorGroup" : ""}`}>
              <label>City</label>
              <input
                type="text"
                name="city"
                className={`inputField ${errors.city ? "inputError" : ""}`}
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div
              className={`formGroup ${errors.postalCode ? "errorGroup" : ""}`}
            >
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                className={`inputField ${errors.postalCode ? "inputError" : ""
                  }`}
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>

            <div
              className={`formGroup ${errors.countryId ? "errorGroup" : ""}`}
            >
              <label>Country</label>
              <select
                name="countryId"
                className={`selectField ${errors.countryId ? "inputError" : ""
                  }`}
                value={formData.countryId}
                onChange={handleChange}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.countryName}
                  </option>
                ))}
              </select>
            </div>

            <div className={`formGroup ${errors.stateId ? "errorGroup" : ""}`}>
              <label>State</label>
              <select
                name="stateId"
                className={`selectField ${errors.stateId ? "inputError" : ""}`}
                value={formData.stateId}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.stateName}
                  </option>
                ))}
              </select>
            </div>

            <div className="formActions">
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit">Add Addresss</button>
            </div>
          </form>
        )}
      </div>

      <div className="OrderContainer">
        <div className="orderContainerHead">
          <h2>Place Your Order</h2>
          <div className="orderContainerContent">
            {loading ? (
              <p>Loading cart items...</p>
            ) : cartItems.length === 0 ? (
              <p>No items in cart</p>
            ) : (
              <table className="place-cart-items">
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Shipping Charge</th>
                    <th>Tax</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {updatedItems.map((item, index) => (
                    <tr key={index}>
                      <td className="place-image-column">
                        {imageUrls[item.productId] ? (
                          <img src={imageUrls[item.productId]} alt={item.productName} />
                        ) : (
                          <p>Image not available</p>
                        )}
                      </td>
                      <td className="place-details-column">
                        {item.productName}
                      </td>
                      <td className="place-price-column">
                        {item.unitPrice.toFixed(2)}
                      </td>
                      <td>
                        {/* Display shipping charge */}
                        {shippingCharges[index]?.shippingCharge || 0}
                      </td>
                      <td>
                        {item.tax.toFixed(2)}
                      </td>
                      <td>
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
                  <tr className="place-card-bottom">
                    <td colSpan="4">
                      Total: ₹ {totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          <div className="place-order-btn">
            <button className="update-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default PlaceOrder;
