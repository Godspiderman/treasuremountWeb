"use client";

import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import Head from "next/head";
import { startLoading, stopLoading } from "@/app/redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/app/utils/Pagenation/Pagenation";
import axios from "axios";
import { API_URL } from "@/app/services/useAxiosInstance";
import AddToCartButton from "@/app/utils/AddCart/page";

// Fetch products from API. You can modify this function if you wish to pass in a category/subCategory filter.
async function fetchProducts(subCategoryId = 0) {
  const response = await fetch(
    `${API_URL}/api/public/product/getAll?userId=0&categoryId=1&subCategoryId=${subCategoryId}&minPrice=0&maxPrice=0&isAdmin=false`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export default function PetsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Read the categoryId query parameter from the URL (if any)
  const queryCategoryId = searchParams.get("categoryId");

  // STATES
  const [products, setProducts] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // Categories for tabs (if no API categories, you can also use static categories)
  const [categories, setCategories] = useState([]);
  // We set activeCategory once the user selects a category or via the query param.
  const [activeCategory, setActiveCategory] = useState(null);

  const itemsPerPage = 8;

  // Fetch images for each product asynchronously
  const fetchImagesForProducts = async (productsList) => {
    try {
      const images = {};
      await Promise.all(
        productsList.map(async (product) => {
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

  // Load products when the component mounts (or when subCategoryId changes)
  // Here subCategoryId is kept as 0; you might modify this logic if you want to fetch
  // products based on a category ID coming from the query.
  useEffect(() => {
    async function loadProducts() {
      try {
        dispatch(startLoading());
        const data = await fetchProducts(0);
        dispatch(stopLoading());
        setProducts(data);
        // Initially, show all products
        setFilteredProducts(data);
        await fetchImagesForProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    loadProducts();
  }, [dispatch]);

  // Handle search input filtering
  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredProducts(
      products.filter((product) =>
        product.productName?.toLowerCase().includes(query.toLowerCase()) ||
        product.subCategoryName?.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  // Example static categories if needed
  const staticCategories = [
    {
      id: 1,
      name: "Dogs",
      imageUrls: ["/image/home-42.png", "/image/tap-3.png", "/image/pet-1.png"],
    },
    {
      id: 2,
      name: "Cats",
      imageUrls: ["/image/home-23.png", "/image/shop-8.png", "/image/selectShop-2.png"],
    },
    {
      id: 3,
      name: "Birds",
      imageUrls: ["/image/shop-11.jpg", "/image/pet-2.png", "/image/shop-11.jpg"],
    },
    {
      id: 4,
      name: "Fish",
      imageUrls: ["/image/pet-3.png", "/image/shop-12.jpg", "/image/home-33.png"],
    },
    {
      id: 5,
      name: "Farm Animals",
      imageUrls: ["/image/shop-7.jpg", "/image/shop-9.jpg", "/image/pet-4.png"],
    },
  ];

  // If you want to use API categories instead of static ones, you can load them:
  const fetchCategories = async () => {
    try {
      dispatch(startLoading());
      const response = await fetch(
        `${API_URL}/api/public/subCategory/getAllSubCategory/1`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      console.log("Fetched Categories:", data);
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err.message);
    } finally {
      dispatch(stopLoading());
    }
  };

  // For demonstration, you can choose either staticCategories or API categories.
  // Here we use API categories if available, else fallback to staticCategories.
  useEffect(() => {
    fetchCategories();
  }, [dispatch]);

  // If API categories are not loaded, use the static ones.
  const availableCategories = categories.length > 0 ? categories : staticCategories;

  // Handle category click from the categories navigation.
  // This filters the products based on the category name.
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setFilteredProducts(
      products.filter((product) =>
        product.subCategoryName?.toLowerCase().includes(category.name.toLowerCase())
      )
    );
    // Optionally, reset page number when filtering changes
    setCurrentPage(0);
  };

  // Automatically select the category based on the query parameter.
  // This effect runs when the query param or available categories change.
  useEffect(() => {
    if (queryCategoryId && availableCategories.length > 0) {
      const categoryFromQuery = availableCategories.find(
        (cat) => String(cat.id) === queryCategoryId
      );
      if (categoryFromQuery) {
        setActiveCategory(categoryFromQuery);
        // Filter products accordingly
        setFilteredProducts(
          products.filter((product) =>
            product.subCategoryName?.toLowerCase().includes(categoryFromQuery.name.toLowerCase())
          )
        );
      }
    }
  }, [queryCategoryId, availableCategories, products]);

  // Image carousel logic for active category images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const goToNextImage = () => {
    if (activeCategory?.imageUrls?.length) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % activeCategory.imageUrls.length);
    }
  };

  const goToPreviousImage = () => {
    if (activeCategory?.imageUrls?.length) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex - 1 + activeCategory.imageUrls.length) % activeCategory.imageUrls.length
      );
    }
  };

  // Rotate images every 3 seconds when an active category is set
  useEffect(() => {
    const interval = setInterval(goToNextImage, 3000);
    return () => clearInterval(interval);
  }, [activeCategory]);

  // Pagination
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <div className="petspage">
      <Head>
        <title>Pets for Sale | Find Your Perfect Companion</title>
        <meta
          name="description"
          content="Discover a wide range of pets including dogs, cats, birds, and farm animals. Find your perfect companion today!"
        />
        <meta
          name="keywords"
          content="pets for sale, dogs, cats, birds, farm animals, pets online"
        />
        <meta name="author" content="Your Website Name" />
      </Head>

      {/* Hero Section */}
      <div className="petspageHeroSection">
        <div className="petspageContent">
          <h1 className="title">Our Pets</h1>

          {/* Categories Navigation */}
          <div className="categories">
            {availableCategories.slice(0, 5).map((category) => (
              <div
                key={category.id}
                className={`categoryContent ${
                  activeCategory && activeCategory.id === category.id ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                <div className="category">
                  <img
                    src={category.imageUrl || "fallback-image-url"}
                    alt={category.name}
                    className="categoryImage"
                  />
                </div>
                <h2 className="categoriesTitle">{category.name}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="petspageContainer">
        <div className="sectionTitle">
          <h2>
            {activeCategory
              ? `Products in ${activeCategory.name}`
              : "Available Pets"}
          </h2>
          <p>Choose your perfect pet</p>
        </div>

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
            {paginatedProducts.map((product, index) => (
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
                    <p className="offer-price">
                      ₹{product.price.toFixed(2)}
                    </p>
                    <p className="price">₹{product.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="common-btn-container">
                  <AddToCartButton product={product} />
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
    </div>
  );
}
