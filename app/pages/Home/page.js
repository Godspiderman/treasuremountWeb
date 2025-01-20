"use client";

import React, { useEffect, useState , useRef} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiFillStar } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { startLoading, stopLoading } from "@/app/redux/slices/loadingSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  const [productsData, setProductsData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await axios.get(
        "http://localhost:8080/api/public/blog/getAll"
      );
      setBlogs(response.data);
    };

    fetchBlogs();
  }, []);

  const handleBlogClick = (id) => {
    router.push(`/pages/Blog/BlogView?id=${id}`);
  };

  const reviews = [
    {
      id: 1,
      name: "Cena",
      role: "Manager",
      rating: 4,
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: "/image/home-61.png",
    },
    {
      id: 2,
      name: "John",
      role: "CEO",
      rating: 5,
      review:
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: "/image/home-61.png",
    },
    {
      id: 3,
      name: "Doe",
      role: "Team Lead",
      rating: 4.5,
      review:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      image: "/image/home-61.png",
    },
  ];

  const fetchProducts = async () => {
    try {
      const queryParams = {
        userId: 0,
        categoryId: 0,
        subCategoryId: 0,
        minPrice: 0,
        maxPrice: 0,
        ProductStatusId: 0,
        isAdmin: false,
      };
      dispatch(startLoading());
      const response = await axios.get(
        "http://localhost:8080/api/public/product/getAll",
        {
          params: queryParams,
        }
      );
      const fetchedProducts = Array.isArray(response.data) ? response.data : [];
      setProductsData(fetchedProducts);
      console.log("API Response:", response.data);
      dispatch(stopLoading());
      fetchImagesForProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProductsData([]);
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
      fetchProducts();
    }, []);

    const [imageUrls, setImageUrls] = useState({});

    const imagesFetched = useRef(false);
  
    const fetchImagesForProducts = async (products) => {
      if (imagesFetched.current) {
        return; 
      }
  
      try {
        const images = {}; 
  
        await Promise.all(
          products.map(async (product) => {
            const response = await axios.get(
              `http://localhost:8080/api/public/productImages/getAll/${product.id}?positionId=1`
            );
  
            if (response.data && response.data.length > 0) {
              images[product.id] = response.data[0].imageUrl;
            } else {
              console.log(`No image found for product ID: ${product.id}`);
            }
          })
        );
  
        setImageUrls(images);
        imagesFetched.current = true; 
      } catch (error) {
        console.error("Error fetching product images:", error);
      }
    };
  
    useEffect(() => {
      if (productsData.length > 0 && !imagesFetched.current) {
        fetchImagesForProducts(productsData);
      }
    }, [productsData]); 
  

  const [banner, setBanner] = useState({});
  const [banners, setBanners] = useState([]);
  const [currentBannerId, setCurrentBannerId] = useState(null);
  const [error, setError] = useState("");
  
  // Fetch banners data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/public/homePage1/getAll');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setBanners(result);
        setCurrentBannerId(result[0]?.id); 
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchData();
  }, []);
  
  // Automatic slider transition every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBannerId((prevId) => {
        const currentIndex = banners.findIndex((banner) => banner.id === prevId);
        const nextIndex = (currentIndex + 1) % banners.length; // Loop to the start after the last banner
        return banners[nextIndex]?.id;
      });
    }, 3000);
  
    return () => {
      clearInterval(intervalId);
    };
  }, [banners]);
  
  // Update the banner when currentBannerId changes
  useEffect(() => {
    const selectedBanner = banners.find((banner) => banner.id === currentBannerId);
    if (selectedBanner) {
      setBanner(selectedBanner);
    }
  }, [currentBannerId, banners]);
  
  // Navigate to the next banner
  const handleNextBanner = () => {
    const currentIndex = banners.findIndex((banner) => banner.id === currentBannerId);
    const nextIndex = (currentIndex + 1) % banners.length;
    setCurrentBannerId(banners[nextIndex]?.id);
  };
  
  // Navigate to the previous banner
  const handlePrevBanner = () => {
    const currentIndex = banners.findIndex((banner) => banner.id === currentBannerId);
    const prevIndex = (currentIndex - 1 + banners.length) % banners.length;
    setCurrentBannerId(banners[prevIndex]?.id);
  };


  return (
    <div className="homepage">

      {/* section-1 */}

      <div
        className="homepageContainer"
        style={{ backgroundImage: `url(${banner.imageUrl})` }}
      >
        <div className="homepageContent">
          <div className="homepageSide">
            <div className="homepageText">
              <p>{banner.title}</p>
              <h2>{banner.subtitle}</h2>
              <p>{banner.shortDescription}</p>
              <Link href="/pages/Pets">
                <button>{banner.button}</button>
              </Link>
            </div>
          </div>
        </div>
        {/* Navigation buttons */}
        <div className="sliderNav">
          <button onClick={handlePrevBanner}><GrFormPrevious /></button>
          <button onClick={handleNextBanner}> <GrFormNext /></button>
          
        </div>
      </div>



      {/* section-2 */}
      {/* <div className="homepage-section">
      <div className="homepage-card-wrapper">
          <div className="homepage-card1">
            <div className="homepage-card-text d-flex">
              <p>New Product</p>
              <h2>Food For Pets</h2>
            </div>
            <img src="/image/home-21.png" alt="" className="w-50" />
          </div>
          <div className="homepage-card-content">
            <div className="homepage-card2">
              <img src="/image/home-22.png" alt="" />
              <div className="homepage-card-text">
                <p>New Product</p>
                <h2>Toys For Dogs</h2>
              </div>
            </div>
            <div className="homepage-card3">
              <div className="homepage-card-text">
                <p>New Product</p>
                <h2>Toys For Cats</h2>
              </div>
              <img src="/image/home-23.png" alt="" />
            </div>
          </div>
        </div>
      </div> */}

      {/* section-3 */}
      <div className="couresCards">
        <div className="heroTabsContainer">
          <div className="heroTabs">
            {["Latest Product", "Top Rating", "Best Selling"].map(
              (section, index) => (
                <div
                  key={index}
                  className={`tab ${activeTab === index + 1 ? "active" : ""}`}
                  onClick={() => handleTabClick(index + 1)}
                >
                  {section}
                </div>
              )
            )}
          </div>
        </div>
        <div className="heroPageContent">
          {activeTab === 1 && (
            <div className="heroTabsCard">
              <div className="tabCards">
                {productsData.length > 0 ? (
                  productsData
                    .sort(
                      (a, b) =>
                        new Date(b.createdDate) - new Date(a.createdDate)
                    ) // Sort by createdDate
                    .slice(0, 8) // Display first 8 products
                    .map((product, index) => (
                      <div
                        className="tabCard"
                        onClick={() =>
                          router.push(
                            `/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`
                          )
                        }
                        key={index}
                      >
                        <div className="product-card-img">
                          {/* {product.imageUrl ? (
                           <img
                            src={imageUrls[product.id] || "default-placeholder.jpg"}
                            alt={`product-img-${index}`}
                            className="default-img"
                          />
                          ) : (
                            <p>No image available</p>
                          )} */}
                           <img
                            src={imageUrls[product.id] || "default-placeholder.jpg"}
                            alt={`product-img-${index}`}
                            className="default-img"
                          />
                        </div> 

                        <p>{product.productName}</p>
                        <div className="tabPrice">
                          <p>₹{product.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No products available</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="heroTabsCard">
              <div className="tabCards">
                {productsData.length > 0 ? (
                  productsData
                    .filter((product) => product.productStatusId === 6) // Filter products with productStatusId === 6
                    .slice(0, 8) // Display first 8 products
                    .map((product, index) => (
                      <div
                        className="tabCard"
                        onClick={() =>
                          router.push(
                            `/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`
                          )
                        }
                        key={index}
                      >
                        <div className="product-card-img">
                           <img
                            src={imageUrls[product.id] || "default-placeholder.jpg"}
                            alt={`product-img-${index}`}
                            className="default-img"
                          />
                        </div> 
                        
                        <p>{product.productName}</p>
                        <div className="tabPrice">
                          <p>₹{product.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No products available</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="heroTabsCard">
              <div className="tabCards">
                {productsData.length > 0 ? (
                  productsData
                    .filter(
                      (product) =>
                        product.discount >= 5 && product.discount <= 10
                    ) // Filter products by discount
                    .slice(0, 8) // Display first 8 products
                    .map((product, index) => (
                      <div
                        className="tabCard"
                        onClick={() =>
                          router.push(
                            `/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`
                          )
                        }
                        key={index}
                      >
                        <div className="product-card-img">
                           <img
                            src={imageUrls[product.id] || "default-placeholder.jpg"}
                            alt={`product-img-${index}`}
                            className="default-img"
                          />
                        </div> 

                        <p>{product.productName}</p>
                        <div className="tabPrice">
                          <p>₹{product.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No products available</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="btn">
          {/* <button>All Products</button> */}
          <Link href="/pages/Products">All Products</Link>
        </div>
      </div>

      {/* section-4 */}
      <div className="allPets">
        <div className="allPetsHead">
          <h2>Available Pets</h2>
          <p>Choose your perfect pet</p>
        </div>
        <div className="allPetsContent">
          <Link href="/pages/Pets" className="petsCard">
            <img src="/image/home-31.jpg" alt="" />
            <div className="petCardText">
              <h2>Dogs & Cats</h2>
            </div>
          </Link>
          <Link href="/pages/Pets" className="petsCard">
            <img src="/image/home-32.png" alt="" />
            <div className="petCardText">
              <h2>Birds</h2>
            </div>
          </Link>
          <Link href="/pages/Pets" className="petsCard">
            <img src="/image/home-33.png" alt="" />
            <div className="petCardText">
              <h2>Aquarium</h2>
            </div>
          </Link>
          <Link href="/pages/Pets" className="petsCard">
            <img src="/image/home-34.png" alt="" />
            <div className="petCardText">
              <h2>Farm Animals</h2>
            </div>
          </Link>
        </div>
      </div>

      {/* section-5 */}
      <div className="petFood">
        <div className="petFoodImg">
          <img src="/image/home-41.jpg" alt="" />
          <div className="footContent">
            <p>30% off All Items</p>
            <h2>Accessory</h2>
            <button><Link href="/pages/Shop" >SHOP NOW</Link></button>
          </div>
        </div>
        <div className="petFoodImg">
          <img src="/image/home-42.png" alt="" />
          <div className="footContent">
            <p>30% off All Items</p>
            <h2>Accessory</h2>
            <button><Link href="/pages/Shop" >SHOP NOW</Link></button>
          </div>
        </div>

        <div className="petFoodImg">
          <img src="/image/home-43.png" alt="" />
          <div className="footContent">
            <p>30% off All Items</p>
            <h2>Accessory</h2>
            {/* <button>SHOP NOW</button> */}
            <button><Link href="/pages/Shop" >SHOP NOW</Link></button>
          </div>
        </div>
      </div>

      {/* section-6 */}

      <div className="availableShop">
        <div className="availableShopContainer">
          <div className="availableShopHead">
            <h2>Available Shops</h2>
            <p>Choose your perfect pet</p>
          </div>
          <div className="availableShopContent">
            {productsData
              .filter((product) => product.minStockLevel >= 5)
              .slice(0, 12)
              .map((product, index) => (
                <div
                  className="tabCard"
                  onClick={() =>
                    router.push(
                      `/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`
                    )
                  }
                  key={index}
                >
                 <div className="product-card-img">
                      <img
                      src={imageUrls[product.id] || "default-placeholder.jpg"}
                      alt={`product-img-${index}`}
                      className="default-img"
                    />
                  </div> 
                  <p>{product.shopName || "Unnamed Shop"}</p>
                  {/* <div className="tabPrice">
                    <p>
                      {" "}
                      ₹
                      {(
                        product?.price -
                        (product?.price * product?.discount) / 100
                      ).toFixed(2)}
                    </p>
                  </div> */}
                   <div className="tabPrice">
                    <p>₹{product.price.toFixed(2)}</p>
                    </div>
                  {/* <div className="locate">
                    <p>{product.location || "Location not available"}</p>
                  </div> */}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* section-7 */}
      <div className="carousel">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="review-card">
                <img src={review.image} alt={review.name} className="avatar" />
                <p className="review">{review.review}</p>
                <p className="name">{review.name}</p>
                <p className="role">{review.role}</p>
                <div className="rating">
                  <span>4.0</span>{" "}
                  {[...Array(4)].map((_, i) => (
                    <AiFillStar key={i} />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* section-8 (Blogs) */}

      <div className="homeBlog">
        <div className="homeBlogContainer">
          <div className="homeBlogHead">
            <h2>Our Blog</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
          </div>

          <div className="homeBlogContent">
            {blogs.map((blog) => (
              <div
                className="BlogContentCard"
                key={blog.id}
                onClick={() => handleBlogClick(blog.id)}
              >
                <img
                  src="/image/home-73.png"
                  alt="pet img"
                  className="blogImage"
                />
                <h2>{blog.heading}</h2>
                <p>{blog.shortDescription}</p>
                <Link href={`/pages/Blog/BlogView?id=${blog.id}`}>
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
