"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
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
import { API_URL } from "@/app/services/useAxiosInstance";
import AddToCartButton from "@/app/utils/AddCart/page";
import { getAllTestimonials } from "@/app/services/api";

const Homepage = ({ initialData }) => {
  console.log(initialData);

  const router = useRouter();

  const [activeTab, setActiveTab] = useState(1);
  const [latestProducts, setLatestProducts] = useState(initialData.latestProducts || []);
  const [topRatedProducts, setTopRatedProducts] = useState(initialData.topRatedProducts || []);
  const [bestSellingProducts, setBestSellingProducts] = useState(initialData.bestSellingProducts || []);
  const [blogs, setBlogs] = useState(initialData.blogs || []);
  const [testimonials, setTestimonials] = useState(initialData.testimonials || []);
  const [categories, setCategories] = useState(initialData.categories || []);
  const [banners, setBanners] = useState(initialData.banners || []);
  const [shops, setShops] = useState(initialData.shops || []);
  const [banner, setBanner] = useState({});
  const [currentBannerId, setCurrentBannerId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);


  useEffect(() => {
    if (banners.length > 0) {
      setBanner(banners[0]);
      setCurrentBannerId(banners[0]?.id || null);
    }
  }, [banners]);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        handleNextBanner();
      }, 3000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused]);




  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const handleShowDetails = async (userId) => {
    try {
      router.push(`/pages/Shop/ShopDetails?id=${userId}`);
    } catch (error) {
      console.error("Error fetching shop details:", error);
    }
  };

  const handleBlogClick = (id) => {
    router.push(`/pages/Blog/BlogView?id=${id}`);
  };


  //banner carousel logic

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBannerId((prevId) => {
        const currentIndex = banners.findIndex(
          (banner) => banner.id === prevId
        );
        const nextIndex = (currentIndex + 1) % banners.length;
        return banners[nextIndex]?.id;
      });
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [banners]);

  useEffect(() => {
    const selectedBanner = banners.find(
      (banner) => banner.id === currentBannerId
    );
    if (selectedBanner) {
      setBanner(selectedBanner);
    }
  }, [currentBannerId, banners]);


  const handleNextBanner = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const handlePrevBanner = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };


  const renderProductCards = (products) => (
    <div className="heroTabsCard">
      <div className="tabCards">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div className="tabCard" key={index}>
              <div
                className="product-card-img"
                onClick={() =>
                  router.push(
                    `/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`
                  )
                }
              >
                <img
                  src={product.imageUrl || "default-placeholder.jpg"}
                  alt={`product-img-${index}`}
                  className="default-img"
                />
              </div>

              <div
                onClick={() =>
                  router.push(
                    `/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`
                  )
                }
              >
                <span className="sub-category-name">
                  {product.subCategoryName}
                </span>
                <p>{product.productName}</p>
                <div className="tabPrice">
                  <p className="offer-price">
                    ₹
                    {(
                      product.price -
                      (product.price * product.discount) / 100
                    ).toFixed(2)}
                  </p>
                  <p className="price">₹{product.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="common-btn-container">
                <AddToCartButton product={product} />
              </div>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="homepage">
      {/* section-1 */}

      <div
        className="homepageContainer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="homepageContent">
          <div className="homepageTextSide">
            <div className="homepageText">
              <p>{banners[currentIndex]?.title}</p>
              <h2>{banners[currentIndex]?.subtitle}</h2>
              <p>{banners[currentIndex]?.shortDescription}</p>

              <a
                href={
                  banners[currentIndex]?.button === "Book Appointment"
                    ? "/pages/ConsultVet"
                    : banners[currentIndex]?.button === "Explore Pet"
                      ? "/pages/Pets"
                      : banners[currentIndex]?.button === "Shop Now"
                      ? "/pages/Shop"
                      : banners[currentIndex]?.redirectUrl || "#"
                }
              >
                {banners[currentIndex]?.button}
              </a>


            </div>
          </div>
          <div className="homepageImageSide">
            <img src={banners[currentIndex]?.imageUrl} alt="banner" />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="sliderNav">
          <button onClick={handlePrevBanner}>
            <GrFormPrevious />
          </button>
          <button onClick={handleNextBanner}>
            <GrFormNext />
          </button>
        </div>
      </div>


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
          <>
            {activeTab === 1 && renderProductCards(latestProducts)}
            {activeTab === 2 && renderProductCards(topRatedProducts)}
            {activeTab === 3 && renderProductCards(bestSellingProducts)}
          </>
        </div>

        <div className="product-style-btn">
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
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              href={`/pages/Pets?categoryId=${category.id}`}
              className="petsCard"
            >
              <img src={category.imageUrl} alt={category.name} />
              <div className="petCardText">
                <h2>{category.name}</h2>
              </div>
            </Link>
          ))}
        </div>

      </div>
      {/* section-5 */}
      <div className="petFood">
        <div className="petFoodImg">
          <img src="/image/home-41.jpg" alt="" />
          <div className="footContent">
            <p>30% off All Items</p>
            <h2>Birds</h2>
            <button>
              <Link href="/pages/Shop">SHOP NOW</Link>
            </button>
          </div>
        </div>
        <div className="petFoodImg">
          <img src="/image/home-42.png" alt="" />
          <div className="footContent">
            <p>30% off All Items</p>
            <h2>Dogs</h2>
            <button>
              <Link href="/pages/Shop">SHOP NOW</Link>
            </button>
          </div>
        </div>

        <div className="petFoodImg">
          <img src="/image/home-43.png" alt="" />
          <div className="footContent">
            <p>30% off All Items</p>
            <h2>Cats</h2>
            {/* <button>SHOP NOW</button> */}
            <button>
              <Link href="/pages/Shop">SHOP NOW</Link>
            </button>
          </div>
        </div>
      </div>

      {/* section-6 */}

      <div className="shop-pages">
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
                {shops.slice(0, 3).map((shop, index) => (
                  <div
                    key={index}
                    className="card"
                    onClick={() => handleShowDetails(shop.userId)}
                  >
                    <div className="product-card-img">
                      <img
                        src={shop.imageUrl || "default-placeholder.jpg"}
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
                        <p>{shop.postalCode || "Postal Code not available"} </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* section-7 */}
      <div className="carousel">
        <div className="carousel-head">
          <h2>Testimonials</h2>
          <p>
            See what our happy users have to say about our products and
            services!
          </p>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
        >
          {Array.isArray(testimonials) && testimonials.length > 0 ? (
            testimonials.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="review-card">
                  <img
                    src={review.imageUrl}
                    alt={review.description}
                    className="avatar"
                  />
                  <p className="review">{review.description}</p>
                  <p className="name">{review.name}</p>
                  <p className="role">{review.role}</p>
                  <div className="rating">
                    {[...Array(5)].map((_, i) =>
                      i < review.rating ? (
                        <AiFillStar key={i} />
                      ) : (
                        <AiOutlineStar key={i} />
                      )
                    )}
                  </div>
                  {/* <div className="rating">
                    {[...Array(5)].map((_, i) => {
                      if (i + 1 <= review.rating) {
                        return <AiFillStar key={i} />; // Full star
                      } else if (i + 0.5 === review.rating) {
                        return <AiFillStar key={i} style={{ clipPath: "inset(0 50% 0 0)" }} />; // Half star
                      } else {
                        return <AiOutlineStar key={i} />; // Empty star
                      }
                    })}
                  </div> */}
                </div>
              </SwiperSlide>
            ))
          ) : (
            <p>No testimonials available</p>
          )}
        </Swiper>
      </div>

      {/* section-8 (Blogs) */}

      <div className="homeBlog">
        <div className="homeBlogContainer">
          <div className="homeBlogHead">
            <h2>Our Blog</h2>
            <p>
              Stay updated with the latest pet care tips, products, and expert
              advice!
            </p>
          </div>

          <div className="homeBlogContent">
            {blogs.map((blog) => (
              <div
                className="BlogContentCard"
                key={blog.id}
                onClick={() => handleBlogClick(blog.id)}
              >
                <img src={blog.imageUrl} alt="pet img" className="blogImage" />
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
