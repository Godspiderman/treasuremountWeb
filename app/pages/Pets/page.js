"use client";

import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import Head from "next/head";
import { startLoading, stopLoading } from '@/app/redux/slices/loadingSlice';
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Pagination from "@/app/utils/Pagenation/Pagenation";
import axios from "axios";
import { API_URL } from "@/app/services/useAxiosInstance";


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
  const subCategoryId =0;

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
        setImageUrls(images);  // Set image URLs in the state
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
            
            // Fetch images for the products after they're loaded
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
      products.filter((product) =>
        product.productName?.toLowerCase().includes(query.toLowerCase())
      )
    );
  };  

  const staticCategories = [
    { 
      id: 1, 
      name: "Dogs", 
      imageUrls: ["/image/home-42.png", "/image/tap-3.png", "/image/pet-1.png"] 
    },
    { 
      id: 2, 
      name: "Cats", 
      imageUrls: ["/image/home-23.png", "/image/shop-8.png", "/image/selectShop-2.png"] 
    },
    { 
      id: 3, 
      name: "Birds", 
      imageUrls: ["/image/shop-11.jpg", "/image/pet-2.png", "/image/shop-11.jpg"] 
    },
    { 
      id: 4, 
      name: "Fish", 
      imageUrls: ["/image/pet-3.png", "/image/shop-12.jpg", "/image/home-33.png"] 
    },
    { 
      id: 5, 
      name: "Farm Animals", 
      imageUrls: ["/image/shop-7.jpg", "/image/shop-9.jpg", "/image/pet-4.png"] 
    },
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(staticCategories[0]);

   const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % activeCategory.imageUrls.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + activeCategory.imageUrls.length) % activeCategory.imageUrls.length);
  };

  useEffect(() => {
    const interval = setInterval(goToNextImage, 3000);
    return () => clearInterval(interval); 
  }, [activeCategory]);


  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
      currentPage * itemsPerPage,
      currentPage * itemsPerPage + itemsPerPage
  );

  const handleCategoryClick = (category) => {
    setActiveCategory(category); // Set the active category
    setFilteredProducts(
      products.filter((product) =>
        product.subCategoryName?.toLowerCase().includes(category.name.toLowerCase())
      )
    );
  };
  

 
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
            {staticCategories.map((category) => (
              <div
                key={category.id}
                className={`categoryContent ${activeCategory.id === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)} // Update handler
              >
                <div className="category">
                  <img
                    src={category.imageUrls[currentImageIndex]}
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


     {/* <div className="petspageHeroSection">
        <div className="petspageContent">
          <h1 className="title">Our Pets</h1>

          <div className="categories">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
              
                <div className="category-images">
                  <div className="slider">
                    <img
                      src={category.images[category.currentImageIndex]}
                      alt={`${category.name} image ${category.currentImageIndex}`}
                      className="category-image"
                    />
                  </div>
                </div>
                <h3>{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div> */}


      {/* Product Section */}
      <div className="petspageContainer">
        <div className="sectionTitle">
          <h2>
            {subCategoryId
              ? `Products in ${categoryData.find((c) => c.id === subCategoryId)?.name
              }`
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
              <div className="product-card"
                onClick={() => router.push(`/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`)}
                key={index}
              >
                <div className="product-card-img">
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

                <div className="product-card-text">
                  <span className="sub-category-name">{product.subCategoryName}</span>
                  <h1>{product.productName}</h1>
                  <div className="product-card-price">
                    <p className="offer-price">₹{product.price.toFixed(2)} </p>
                    <p className="price">₹{product.price.toFixed(2)} </p>
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
    </div>
  );
}
