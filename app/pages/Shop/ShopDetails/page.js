"use client";

import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getVendorById } from "@/app/services/api";
import { startLoading, stopLoading } from "@/app/redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Pagination from "@/app/utils/Pagenation/Pagenation";
import axios from "axios";
import { API_URL } from "@/app/services/useAxiosInstance";
import { useSelector } from "react-redux";
import AddToCartButton from "@/app/utils/AddCart/page";


const ShopDetails = () => {
  const [details, setDetails] = useState(null);

  const searchParams = useSearchParams();

  const userId = searchParams.get("id");
  console.log("user id", userId);

  //  const userId = useSelector((state) => state.auth?.user?.userId);
  //  console.log("user Id" ,userId);

  useEffect(() => {
    if (!userId) return;

    const fetchVendorDetails = async () => {
      try {
        const data = await getVendorById(userId);
        setDetails(data);
      } catch (error) {
        console.error("Failed to fetch vendor details:", error);
      }
    };

    fetchVendorDetails();
  }, [userId]);

  //product details

  const dispatch = useDispatch();
  const router = useRouter();
  const subCategoryId = 0;

  async function fetchProducts(subCategoryId = 0) {
    const response = await fetch(
      `${API_URL}/api/public/product/getAll?userId=${userId}&categoryId=0&subCategoryId=${subCategoryId}&minPrice=0&maxPrice=0&ProductStatusId=0&isAdmin=false`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  }

  const [products, setProducts] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const fetchImagesForProducts = async (products) => {
    try {
      const images = {};
      await Promise.all(
        products.map(async (product) => {
          const response = await axios.get(
            `${API_URL}/api/public/productImages/getAll/${product.id}?positionId=1`
          );
          if (response.data && response.data.length > 0) {
            images[product.id] = response.data[0].imageUrl;
          } else {
            console.log(`No image found for product ID: ${product.id}`);
          }
        })
      );
      setImageUrls(images);
    } catch (error) {
      console.error("Error fetching product images:", error);
    }
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        dispatch(startLoading());
        const data = await fetchProducts(subCategoryId);
        dispatch(stopLoading());
        setProducts(data);
        setFilteredProducts(data);

        await fetchImagesForProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    loadProducts();
  }, [subCategoryId]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredProducts(
      products.filter(
        (product) =>
          product.productName?.toLowerCase().includes(query.toLowerCase()) ||
          product.subCategoryName?.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <div className="shop-details-section">
      <div className="shop-detail">
        <div className="shop-detail-container">
          <div className="shop-details-content">
            <div className="details-cards">
              <div className="card-container">
                {details && (
                  <div className="card">
                    <div className="product-card-img">
                      <img
                        src={details.imageUrl}
                        alt="Shop"
                        className="default-img"
                      />
                    </div>

                    <div className="card-details">
                      <p className="card-title">{details.name}</p>

                      <div className="details">
                        <h5> Shop Name:</h5>
                        <p>{details.shopName || "Shop Name not available"}</p>
                      </div>

                      <div className="details">
                        <h5>Address:</h5>
                        <p>{details.address || "Address not available"}</p>
                      </div>

                      <div className="details">
                        <h5>City:</h5>
                        <p>{details.city || "Location not available"}</p>
                      </div>

                      <div className="details">
                        <h5>Postal Code:</h5>
                        <p>
                          {details.postalCode || "Postal Code not available"}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="petspageContainer">
        {details && (
          <div className="sectionTitle">
            <h2>
              Available Products in{" "}
              {details.shopName ? details.shopName : "Shop Name not available"}
            </h2>
            <p>Choose your perfect product</p>
             <button  className="go-back-btn" onClick={() => router.back()}>Back</button>
          </div>
        )}

        <div className="productpage-section2">
          <div className="heroTabsContainer">
            <div className="searchInput">
              <div className="searchBox">
                <FiSearch size={20} />
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

      
          <div className="product-cards">
            {filteredProducts.length === 0 ? (
              <div className="no-products-message">
                <p>No products available for this user.</p>
              </div>
            ) : (
              paginatedProducts.map((product, index) => (
                <div className="product-card" key={index}>
                  <div
                    className="product-card-img"
                    onClick={() =>
                      router.push(
                        `/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`
                      )
                    }
                  >
                    {imageUrls[product.id] ? (
                      <img
                        src={imageUrls[product.id]}
                        alt={product.productName}
                        className="default-img"
                      />
                    ) : (
                      <p>Image not available</p>
                    )}
                  </div>

                  <div
                    className="product-card-text"
                    onClick={() =>
                      router.push(
                        `/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`
                      )
                    }
                  >
                    <span className="sub-category-name">
                      {product.subCategoryName}
                    </span>
                    <h1>{product.productName}</h1>
                    <div className="product-card-price">
                      <p className="offer-price">₹{product.price.toFixed(2)}</p>
                      <p className="price">₹{product.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="common-btn-container">
                      <AddToCartButton product={product} />
                    </div>
                </div>
              ))
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
