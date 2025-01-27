"use client";
import { useState, useEffect } from "react";
import { CiShare2 } from "react-icons/ci";
import { AiFillStar } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdStarRate } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { startLoading, stopLoading } from "@/app/redux/slices/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/app/services/useAxiosInstance";

//import { setCartCount } from '@/app/redux/slices/cartSlice';
import { incrementCartCount } from '@/app/redux/slices/cartSlice'; 

const PetDetails = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log("Redux auth state:", isAuthenticated);

  const [petDetails, setPetDetails] = useState("");
  const [foodDetails, setFoodDetails] = useState("");
  const [accessoriesDetails, setAccessoriesDetails] = useState("");
  const[medicineDetails,setMedicineDetails]=useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const categoryId = searchParams.get("categoryId");
  console.log("productId from params:", productId);
  console.log("categoryId from params:", categoryId);

  const userId = useSelector((state) => state.auth.user?.userId || null);
  // const userId = 2;
  console.log("userId", userId);

  //contact Page

  const [showContainer, setShowContainer] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    shopName: "",
    phoneNumber: "",
    emailId: "",
    address: "",
  });

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        console.log("Fetching data for productId:", productId);
        const response = await fetch(
          `${API_URL}/api/public/resource/pet/details/getOne/${productId}`
        );
        const data = await response.json();

        console.log("API Full Response:", data);
        const userDTO = data.userDTO || {};
        const vendorDTO = data.vendorDTO || {};

        console.log("userDTO:", userDTO);
        console.log("vendorDTO:", vendorDTO);

        setFormData({
          firstName: userDTO.firstName || "Not Available",
          shopName: vendorDTO?.shopName || "Not Available",
          phoneNumber: vendorDTO?.contactDetails || userDTO?.mobileNumber || "Not Available",
          emailId: userDTO?.emailId || "Not Available",
          address: vendorDTO?.address || "Not Available",
        });
      }
      catch (error) {
        //console.error("Error fetching data:", error);
        setFormData({
          firstName: "Not Available",
          shopName: "Not Available",
          phoneNumber: "Not Available",
          emailId: "Not Available",
          address: "Not Available",
        });

      }
    };

    fetchContactDetails();
  }, [categoryId, productId]);


  const handleViewContactDetails = () => {
    setShowContainer(true);
  };

  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(images[0]?.imageUrls);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReversing, setIsReversing] = useState(false);

  useEffect(() => {
    const fetchPetsDetails = async () => {
      dispatch(startLoading());
      try {
        const response = await fetch(
          `${API_URL}/api/public/resource/pet/getOne/${productId}`
        );
        const data = await response.json();
        console.log(data);
        setPetDetails(data);
        dispatch(stopLoading());
      } catch (error) {
      }
    };

    fetchPetsDetails();
  }, [categoryId, productId]);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      dispatch(startLoading());
      try {
        const response = await fetch(
          `${API_URL}/api/public/resource/food/getOne/${productId}`
        );
        const data = await response.json();
        setFoodDetails(data);
        setStockQuantity(data.stockQuantity); 
        console.log("Stock Quantity:", data.stockQuantity);
        console.log(data);
        dispatch(stopLoading());
      } catch (error) {
      }
    };

    fetchFoodDetails();
  }, [categoryId, productId]);


  useEffect(() => {
    const fetchAccessoriesDetails = async () => {
      dispatch(startLoading());
      try {
        const response = await fetch(
          `${API_URL}/api/public/resource/accessories/getOne/${productId}`
        );
        const data = await response.json();
        setAccessoriesDetails(data);
        setStockQuantity(data.stockQuantity); 
        console.log("Stock Quantity:", data.stockQuantity);
        dispatch(stopLoading());
        console.log(data);
      } catch (error) {
      }
    };

    fetchAccessoriesDetails();
  }, [categoryId, productId]);


  useEffect(() => {
    const fetchMedicineDetails = async () => {
      dispatch(startLoading());
      try {
        const response = await fetch(
          `${API_URL}/api/public/resource/medicine/getOne/${productId}`
        );
        const data = await response.json();
        setMedicineDetails(data);
        setStockQuantity(data.stockQuantity);
        console.log("Stock Quantity:", data.stockQuantity);
        console.log(data);
        dispatch(stopLoading());
      } catch (error) {
        // Handle error
      }
    };
  
    fetchMedicineDetails();
  }, [categoryId, productId]);
  


  useEffect(() => {
    const fetchImages = async () => {
      dispatch(startLoading());
      try {
        const response = await fetch(
          `${API_URL}/api/public/productImages/getAll/${productId}?positionId=0`
        );
        const data = await response.json();

        const activeImages = data.filter((img) => img.activeStatus);
        setImages(activeImages);

        const mainImageObj = activeImages.find((img) => img.positionId === 1);
        if (mainImageObj) {
          setMainImage(mainImageObj.imageUrl);
        }
        dispatch(stopLoading());
      } catch (error) {
        dispatch(stopLoading());
      }
    };

    fetchImages();
  }, [productId, dispatch]);


  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        let nextIndex = prevIndex + (isReversing ? -1 : 1);

        if (nextIndex >= images.length) {
          nextIndex = images.length - 1;
          setIsReversing(true);
        } else if (nextIndex < 0) {
          nextIndex = 0;
          setIsReversing(false);
        }

        setMainImage(images[nextIndex]?.imageUrl || mainImage);
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval); 
  }, [images, isReversing, mainImage]);

  const handleImageClick = (imageUrl, index) => {
    setMainImage(imageUrl);
    setCurrentIndex(index);
    setIsReversing(index === images.length - 1);
  };

  const [stockQuantity, setStockQuantity] = useState(0);
  const [count, setCount] = useState(1); 
  

  const increment = () => {
    console.log("Stock Quantity:", stockQuantity, "Current Count:", count);
    if (count < stockQuantity) {
      setCount((prevCount) => prevCount + 1);
    } else {
      alert("Maximum quantity reached.");
    }
  };
  
  const decrement = () => {
    console.log("Stock Quantity:", stockQuantity, "Current Count:", count); 
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    } else {
      alert("Minimum quantity is 1.");
    }
  };


  const handleAddToWishlist = async () => {
    if (count > stockQuantity) {
      alert("You cannot add more than the available stock.");
      return; 
    }
  
    const formData = {
      userId: userId,
      productId: productId,
      initialQuantity: count,
    };
  
    console.log("Parameters being sent:", formData);
  
    try {
      // Check if the product is already in the cart
      const checkResponse = await fetch(
        `${API_URL}/cart/getOne?ProductId=${productId}&userId=${userId}`
      );
  
      if (!checkResponse.ok) {
        throw new Error(`Error: ${checkResponse.status} - ${checkResponse.statusText}`);
      }
  
      // Check if response has content to parse as JSON
      const checkData = await checkResponse.text();
      const parsedData = checkData ? JSON.parse(checkData) : null;
  
      if (parsedData) {
        // If product exists in the cart, increase the quantity by 'count'
        const newQuantity = parsedData.quantity + count;
  
        if (newQuantity > stockQuantity) {
          alert("Cannot add more than the available stock in the cart.");
          return; // Prevent quantity increase beyond available stock
        }
  
        const increaseQuantityResponse = await fetch(
          `${API_URL}/cart/addQuantity/${parsedData.id}?incrementBy=${newQuantity}`,
          {
            method: "PATCH",  // Assuming you use PATCH to update the quantity
          }
        );
  
        if (!increaseQuantityResponse.ok) {
          throw new Error(`Error: ${increaseQuantityResponse.status} - ${increaseQuantityResponse.statusText}`);
        }
  
        // Read the response as text (not JSON)
        const increaseData = await increaseQuantityResponse.text();
        console.log("Quantity increased:", increaseData);
        dispatch(incrementCartCount(count));
        alert("Product quantity updated in cart!");
     
       

      } else {
        // If product is not in the cart, add it as a new item
        const response = await fetch(`${API_URL}/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
  
        // Read the response as text (not JSON)
        const data = await response.text();
        console.log("Product added to cart:", data);
        dispatch(incrementCartCount(count));
        alert("Product added to cart successfully!");

        

      }
  
      router.push(`/pages/Cart/?count=${count}`);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  

  const handleOrder = (OneproductId, count) => {
    router.push(`/pages/Cart/PlaceOrder?productId=${OneproductId}&count=${count}`);
  }


  const gotologin = () => {
    router.push("/pages/Login");
  };


  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/reviews/getAll`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        // Map API model to component format
        const mappedReviews = data.map((review) => ({
          id: review.id,
          userName: `User ${review.userId}`,
          date: new Date(review.createdDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          rating: review.rating,
          content: review.comments,
          profileImage: "/image/reviewProfile.png",
        }));
        setReviews(mappedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);


  return (
    <div className="petDetails">
      <div className="petDetailsContainer">
        <div className="petDetailsContent">
          <div className="detailsSection">
            <div className="detailsSectionContent">
              <div className="detailsImgSection">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="thumbnail"
                    onClick={() => handleImageClick(img.imageUrl, index)}
                  >
                    <img
                      src={img.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="thumbnail-image"
                    />
                  </div>
                ))}

                {petDetails.categoryId === 1 && petDetails.videoUrl && (
                  <div key={petDetails.id} className="thumbnail">
                    <video controls className="thumbnail-image">
                      <source src={petDetails.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {foodDetails.categoryId === 2 && foodDetails.videoUrl && (
                  <div key={foodDetails.id} className="thumbnail">
                    <video controls className="thumbnail-image">
                      <source src={foodDetails.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {accessoriesDetails.categoryId === 3 && accessoriesDetails.videoUrl && (
                  <div key={accessoriesDetails.id} className="thumbnail">
                    <video controls className="thumbnail-image">
                      <source src={accessoriesDetails.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {medicineDetails.categoryId === 4 && medicineDetails.videoUrl && (
                  <div key={medicineDetails.id} className="thumbnail">
                    <video controls className="thumbnail-image">
                      <source src={medicineDetails.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}


              </div>

              <div className="product-images">
                <div className="product-main-image">
                  <img src={mainImage} alt="Main Product" className="main-image" />
                </div>
              </div>
            </div>

            <>
              {petDetails.categoryId === 1 && (
                <button
                  className="toggle-button"
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      e.preventDefault();
                      router.push("/pages/Login");
                    } else {
                      handleViewContactDetails();
                    }
                  }}
                >
                  CONTACT NOW
                </button>
              )}
            </>


            {foodDetails.categoryId === 2 && (
              <div className="addCard">
                <div className="addCardContent">
                  <div className="addPlusBtn">
                    <button onClick={decrement} disabled={!isAuthenticated}>
                      <FaMinus />
                    </button>
                    <span>{count}</span>
                    <button onClick={increment} disabled={!isAuthenticated}>
                      <FaPlus />
                    </button>
                  </div>
                  
                  <button
                    className="addWishList"
                    onClick={(e) => {
                      if (isAuthenticated) {
                        console.log("Adding to cart...");
                        handleAddToWishlist();
                      } else {
                        console.log("Redirecting to login...");
                        e.preventDefault();
                        router.push("/pages/Login");
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add to Cart"}
                  </button>

                  {responseMessage && <p>{responseMessage}</p>}
                </div>


                <div className="ContactBtn">
                  <button
                    className="contactbutton"
                    onClick={(e) => {
                      if (isAuthenticated) {
                        console.log("Processing Buy Now...");
                        handleAddToWishlist();
                      } else {
                        console.log("Redirecting to login...");
                        e.preventDefault();
                        router.push("/pages/Login");
                      }
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {accessoriesDetails.categoryId === 3 && (
              <div className="addCard">
                <div className="addCardContent">
                  <div className="addPlusBtn">
                    <button onClick={decrement} disabled={!isAuthenticated}>
                      <FaMinus />
                    </button>
                    <span>{count}</span>
                    <button onClick={increment} disabled={!isAuthenticated}>
                      <FaPlus />
                    </button>
                  </div>
                  
                  <button
                    className="addWishList"
                    onClick={(e) => {
                      if (isAuthenticated) {
                        console.log("Adding to cart...");
                        handleAddToWishlist();
                      } else {
                        console.log("Redirecting to login...");
                        e.preventDefault();
                        router.push("/pages/Login");
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add to Cart"}
                  </button>


                  {responseMessage && <p>{responseMessage}</p>}
                </div>

                <div className="ContactBtn">
                  <button
                    className="contactbutton"
                    onClick={(e) => {
                      if (isAuthenticated) {
                        console.log("Processing Buy Now...");
                        handleAddToWishlist();
                      } else {
                        console.log("Redirecting to login...");
                        e.preventDefault();
                        router.push("/pages/Login");
                      }
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {medicineDetails.categoryId === 4 && (
              <div className="addCard">
                <div className="addCardContent">
                  <div className="addPlusBtn">
                    <button onClick={decrement} disabled={!isAuthenticated}>
                      <FaMinus />
                    </button>
                    <span>{count}</span>
                    <button onClick={increment} disabled={!isAuthenticated}>
                      <FaPlus />
                    </button>
                  </div>

                  <button
                    className="addWishList"
                    onClick={(e) => {
                      if (isAuthenticated) {
                        console.log("Adding to cart...");
                        handleAddToWishlist();
                      } else {
                        console.log("Redirecting to login...");
                        e.preventDefault();
                        router.push("/pages/Login");
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add to Cart"}
                  </button>

                  {responseMessage && <p>{responseMessage}</p>}
                </div>

                <div className="ContactBtn">
                  <button
                    className="contactbutton"
                    onClick={(e) => {
                      if (isAuthenticated) {
                        console.log("Processing Buy Now...");
                        handleAddToWishlist();
                      } else {
                        console.log("Redirecting to login...");
                        e.preventDefault();
                        router.push("/pages/Login");
                      }
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

          </div>

          {petDetails.categoryId === 1 && (
            <div className="detailsSection1">
              <div className="detailsSectionHead">
                <div className="detailsHead">
                  <h2>{petDetails.breed}</h2>
                  <div className="rating">
                    <span>4.0</span>
                    {[...Array(4)].map((_, i) => (
                      <AiFillStar key={i} />
                    ))}
                    <span>20 Reviews</span>
                  </div>
                </div>
                {/* <div className="detailsHead2">
                  <CiShare2 />
                </div> */}
              </div>

              <div className="detailsSectionContent">
                <h2>
                  ₹{(petDetails.productPrice - (petDetails.productPrice * petDetails.discount / 100)).toFixed(2)}
                </h2>

                <p>₹{petDetails.productPrice.toFixed(2)}</p>
              </div>

              <hr />
              <div className="petContent">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  eiusmod tempor incididunt ut labore dolore.
                </p>
              </div>
              <div className="petContent">
                <h2>Age: {petDetails.ageMonths} Month</h2>
                <h2>Color: {petDetails.color}</h2>
              </div>

              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Care Instructions</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{petDetails.careInstructions}</p>
                </div>
              </div>
              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>About Dog Baby</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{petDetails.about}</p>
                </div>
              </div>
              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Health Info</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{petDetails.healthInfo}</p>
                </div>
              </div>
              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Special Requirements</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{petDetails.specialRequirements}</p>
                </div>
              </div>
            </div>
          )}

          {foodDetails.categoryId === 2 && (
            <div className="detailsSection1">
              <div className="detailsSectionHead">
                <div className="detailsHead">
                  <h2>{foodDetails.brand}</h2>
                  <div className="rating">
                    <span>4.0</span>
                    {[...Array(4)].map((_, i) => (
                      <AiFillStar key={i} />
                    ))}
                    <span>20 Reviews</span>
                  </div>
                </div>
                <div className="detailsHead2">
                  <CiShare2 />
                </div>
              </div>

              <div className="detailsSectionContent">
                <h2>₹{(foodDetails.productPrice - (foodDetails.productPrice * foodDetails.discount / 100)).toFixed(2)}</h2>
                <p>₹{foodDetails.productPrice.toFixed(2)}</p>
              </div>

              <hr />
              <div className="petContent">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  eiusmod tempor incididunt ut labore dolore.
                </p>
              </div>
              <div className="petContent">
                <h2>Weight: {foodDetails.weight} {foodDetails.weightUnit}</h2>
              </div>

              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Ingredients</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{foodDetails.ingredients}</p>
                </div>
              </div>
              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Nutritional Info</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{foodDetails.nutritionalInfo}</p>
                </div>
              </div>
              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Storage Instructions</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{foodDetails.storageInstructions}</p>
                </div>
              </div>
              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Feeding Guidelines</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{foodDetails.feedingGuidelines}</p>
                </div>
              </div>
            </div>
          )}

          {accessoriesDetails.categoryId === 3 && (
            <div className="detailsSection1">
              <div className="detailsSectionHead">
                <div className="detailsHead">
                  <h2>{accessoriesDetails.brand}</h2>
                  <div className="rating">
                    <span>4.0</span>
                    {[...Array(4)].map((_, i) => (
                      <AiFillStar key={i} />
                    ))}
                    <span>20 Reviews</span>
                  </div>
                </div>
                <div className="detailsHead2">
                  <CiShare2 />
                </div>
              </div>

              <div className="detailsSectionContent">
                <h2>₹{(accessoriesDetails.productPrice - (accessoriesDetails.productPrice * accessoriesDetails.discount / 100)).toFixed(2)}</h2>
                <p>₹{accessoriesDetails.productPrice.toFixed(2)}</p>
              </div>

              <hr />
              <div className="petContent">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  eiusmod tempor incididunt ut labore dolore.
                </p>
              </div>
              <div className="petContent">
                <h2>Size: {accessoriesDetails.size}</h2>
                <h2>Color: {accessoriesDetails.color}</h2>
              </div>

              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Specifications</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{accessoriesDetails.specifications}</p>
                </div>
              </div>
              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Care Instructionsy</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{accessoriesDetails.careInstructions}</p>
                </div>
              </div>
              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Usage Instructions</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{accessoriesDetails.usageInstructions}</p>
                </div>
              </div>
            </div>
          )}



          {medicineDetails.categoryId === 4 && (
            <div className="detailsSection1">
              <div className="detailsSectionHead">
                <div className="detailsHead">
                  <h2>{medicineDetails.productName}</h2>
                  <div className="rating">
                    <span>4.0</span>
                    {[...Array(4)].map((_, i) => (
                      <AiFillStar key={i} />
                    ))}
                    <span>20 Reviews</span>
                  </div>
                </div>
                <div className="detailsHead2">
                  <CiShare2 />
                </div>
              </div>

              <div className="detailsSectionContent">
                <h2>₹{(medicineDetails.productPrice - (medicineDetails.productPrice * medicineDetails.discount / 100)).toFixed(2)}</h2>
                <p>₹{medicineDetails.productPrice.toFixed(2)}</p>
              </div>

              <hr />
              <div className="petContent">
                <p>
                  {medicineDetails.usageInstruction || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore dolore.'}
                </p>
              </div>

              <div className="petContent">
                <h2>Dosage: {medicineDetails.dosage} {medicineDetails.dosageUnit}</h2>
              </div>

              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Active Ingredients</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{medicineDetails.activeIngredients}</p>
                </div>
              </div>

              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Nutritional Info</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{medicineDetails.nutritionalInfo || 'Not Available'}</p>
                </div>
              </div>

              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Storage Instructions</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{medicineDetails.storageInstruction || 'Not Available'}</p>
                </div>
              </div>

              <div className="petFeature">
                <div className="petFeatureHead">
                  <h2>Warnings</h2>
                </div>
                <div className="petFeatureContent">
                  <p>{medicineDetails.warnings}</p>
                </div>
              </div>

            </div>
          )}


        </div>

        <div className="contactpage">
          {/* <button className="toggle-button" onClick={handleViewContactDetails}>
            View Contact Details
          </button> */}

          {showContainer && (
            <div className="contactpage-container">
              <div className="contactpage-contents">
                <div className="contactpage-head">
                  <h2>Contact Details</h2>
                </div>
                <div className="contactpage-contents">
                  <div className="contactpage-content">
                    <form className="contactpage-form">
                      {/* Full Name */}
                      <div className="contactpage-form-inputs">
                        <div className="form1">
                          <label>User Name</label>
                          <input
                            className="contactpage-content-input"
                            name="firstName"
                            type="text"
                            value={formData.firstName || "Not Available"}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Shop Name */}
                      <div className="contactpage-form-inputs">
                        <div className="form1">
                          <label>Shop Name</label>
                          <input
                            className="contactpage-content-input"
                            name="shopName"
                            type="text"
                            value={formData.shopName || "Not Available"}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="contactpage-form-inputs">
                        <div className="form1">
                          <label>Phone Number</label>
                          <input
                            className="contactpage-content-input"
                            name="phoneNumber"
                            type="text"
                            value={formData.phoneNumber || "Not Available"}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="contactpage-form-inputs">
                        <div className="form1">
                          <label>Email</label>
                          <input
                            className="contactpage-content-input"
                            name="email"
                            type="text"
                            value={formData.emailId || "Not Available"}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="contactpage-form-inputs">
                        <div className="form1">
                          <label>Address</label>
                          <input
                            className="contactpage-content-input"
                            name="address"
                            type="text"
                            value={formData.address || "Not Available"}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Close Button */}
                      <div className="form-close">
                        <button
                          type="button"
                          className="close-button"
                          onClick={() => setShowContainer(false)}
                        >
                          Close
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="reviewContainer">
          <h3>Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={review.id}>
                <div className="reviewContent">
                  <div className="reviewProfile">
                    <img src={review.profileImage} width={55} height={90} alt="Profile" />
                  </div>

                  <div className="reviewDetails">
                    <div className="userName">
                      <h4>{review.userName}</h4>
                      <p>{review.date}</p>
                    </div>

                    <div className="reviewRating">
                      <div className="reviewStars">
                        {[...Array(review.rating)].map((_, starIndex) => (
                          <MdStarRate key={starIndex} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="reviewData">
                  <p>{review.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>


        {/* <div className="alsoLike">
          <div className="alsoLikeHead">
            <h2>You Might Also Like</h2>
          </div>
          <div className="alsoLikeContent">
            <div className="tabCards">
              <div className="tabCard">
                <img src="/image/tap-1.png" alt="" />
                <p>Simply Cat</p>
                <div className="tabPrice">
                  <p>$60.00 USD</p>
                  <p>$60.00 USD</p>
                </div>
              </div>
              <div className="tabCard">
                <img src="/image/tap-2.png" alt="" />
                <p>Simply Cat</p>
                <div className="tabPrice">
                  <p>$60.00 USD</p>
                  <p>$60.00 USD</p>
                </div>
              </div>
              <div className="tabCard">
                <img src="/image/tap-3.png" alt="" />
                <p>Simply Cat</p>
                <div className="tabPrice">
                  <p>$60.00 USD</p>
                  <p>$60.00 USD</p>
                </div>
              </div>
              <div className="tabCard">
                <img src="/image/tap-4.png" alt="" />
                <p>Simply Cat</p>
                <div className="tabPrice">
                  <p>$60.00 USD</p>
                  <p>$60.00 USD</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PetDetails;
