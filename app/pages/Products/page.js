"use client";

import { useState, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import "./Products.scss";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/app/redux/slices/loadingSlice";
import { FiSearch } from "react-icons/fi";
import { LuListFilter } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Pagination from "@/app/utils/Pagenation/Pagenation";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { API_URL } from "@/app/services/useAxiosInstance";

const Products = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId"); 
  const categoryId = searchParams.get("categoryId");
  const userId = searchParams.get("userId");
  const [showFilter, setShowFilter] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const searchQuery = useSelector((state) => state.search.searchQuery);

  useEffect(() => {
    fetchProducts({ search: searchQuery });
  }, [searchQuery]);


  //add cart -show

  const [petDetails, setPetDetails] = useState("");
  const [foodDetails, setFoodDetails] = useState("");
  const [accessoriesDetails, setAccessoriesDetails] = useState("");
  const[medicineDetails,setMedicineDetails]=useState("");

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


  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/category/getAll`);
      setCategories(response.data);
    } catch (err) {
      setError("Failed to fetch categories.");
      console.error("Error fetching categories:", err.message);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/subCategory/getAll`);
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error.message);
    }
  };


  const fetchProducts = async (filters = {}) => {
    try {
      const userIdFromParams = searchParams.get("userId") || 0;
      const queryParams = new URLSearchParams({
        search: filters.search || "",
        userId: filters.userId || userIdFromParams,
        categoryId: filters.categoryId || [],
        subCategoryId: filters.subCategoryId || [],
        minPrice: filters.minPrice || 0,
        maxPrice: filters.maxPrice || 0,
        ProductStatusId: filters.ProductStatusId || [],
        isAdmin:false,
      });
      console.log(queryParams.subCategoryId);
      dispatch(startLoading());

      const response = await axios.get(`${API_URL}/api/public/product/getAll/temp?${queryParams.toString()}`);
      
      const fetchedProducts = Array.isArray(response.data) ? response.data : [];
      setProductsData(fetchedProducts); 
      dispatch(stopLoading());

    } catch (error) {
      dispatch(startLoading());

      console.error("Error fetching products:", error);
      setProductsData([]); // Reset to empty array on error
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubCategoryChange = (subCategoryId) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };

  const handleSelectAllCategories = (selectAll) => {
    if (selectAll) {
      setSelectedCategories(categories.map((category) => category.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectAllSubCategories = (selectAll) => {
    if (selectAll) {
      const filteredSubCategoryIds = filteredSubCategories.map(
        (subCategory) => subCategory.id
      );
      setSelectedSubCategories(filteredSubCategoryIds);
    } else {
      setSelectedSubCategories([]);
    }
  };


  const handleApplyFilters = async () => {
    console.log(selectedCategories);
    console.log(selectedSubCategories);

    // Dynamically create the filter object only if they are not empty
    const filters = {
      userId: 0, 
      categoryId: selectedCategories.length > 0 ? selectedCategories : 0, 
      subCategoryId: selectedSubCategories.length > 0 ? selectedSubCategories : 0,  
      minPrice: minPrice || 0,
      maxPrice: maxPrice || 0,
      ProductStatusId: 0, // Static for now
      isAdmin: false, // Static for now
    };

    console.log(filters);

    await fetchProducts(filters); 
    setShowFilter(!showFilter)
  };


  const handlePriceChange = (e, isMinPrice) => {
    const value = e.target.value;
  
    if (value === "") {
      if (isMinPrice) setMinPrice("");
      else setMaxPrice("");
      return;
    }
  
    const parsedValue = parseFloat(value);
  
    if (isNaN(parsedValue) || parsedValue < 0) {
      alert("Price cannot be negative");
      return;
    }
  
    if (isMinPrice) {
      setMinPrice(parsedValue);
      
      if (maxPrice !== "" && parsedValue > parseFloat(maxPrice)) {
        alert('Min price cannot be greater than max price');
      }
    } else {
      setMaxPrice(parsedValue);
      
      if (minPrice !== "" && parsedValue < parseFloat(minPrice)) {
        // alert('Max price cannot be less than min price');
      }
    }
  };

  const handleClearFilters = async () => {
    // Reset all filter states
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setMinPrice("");
    setMaxPrice("");

    await fetchProducts();
    setShowFilter(!showFilter)
  };

  const filteredSubCategories =
    selectedCategories.length > 0
      ? subCategories.filter((subCategory) =>
        selectedCategories.includes(subCategory.categoryId)
      )
      : subCategories;

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchProducts(

    );
  }, []);
  
  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
    //setSearchQuery(event.target.value);
  };

  useEffect(() => {
    fetchProducts();
}, [searchQuery, searchName]); 


  
  const filteredData = productsData.filter((products) =>
    (products.productName?.toLowerCase() || "").includes(searchName.toLowerCase()) &&
    (products.productName?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  
  );
  

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedProducts = filteredData.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const [hoverImages, setHoverImages] = useState({});
  const [fetchedProductIds, setFetchedProductIds] = useState(new Set());


  useEffect(() => {
    const fetchImagesForProducts = async () => {
      const newProductIds = productsData
        .map((product) => product.id)
        .filter((id) => !fetchedProductIds.has(id)); 

      if (newProductIds.length > 0) {
        await Promise.all(
          newProductIds.map(async (productId) => {
            await fetchProductImages(productId);
          })
        );
        setFetchedProductIds((prev) => new Set([...prev, ...newProductIds])); // Update fetched products
      }
    };

    fetchImagesForProducts();
  }, [productsData]); // Run only when productsData changes

  const fetchProductImages = async (productId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/public/productImages/getAll/${productId}`
      );

      if (response.data && response.data.length > 0) {
        const defaultImage = response.data.find((image) => image.positionId === 1)?.imageUrl || "default-placeholder.jpg"; // Position 1 image
        const hoverImage = response.data.find((image) => image.positionId === 2)?.imageUrl || defaultImage; // Position 2 image

        setHoverImages((prevState) => ({
          ...prevState,
          [productId]: { default: defaultImage, hover: hoverImage },
        }));
      }
    } catch (error) {
      console.error("Error fetching product images:", error);
    }
  };

  const handleAddToCart = async () => {
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
  
      const checkData = await checkResponse.text();
      const parsedData = checkData ? JSON.parse(checkData) : null;
  
      if (parsedData) {
        const newQuantity = parsedData.quantity + count;
  
        if (newQuantity > stockQuantity) {
          alert("Cannot add more than the available stock in the cart.");
          return; 
        }
  
        const increaseQuantityResponse = await fetch(
          `${API_URL}/cart/addQuantity/${parsedData.id}?incrementBy=${newQuantity}`,
          {
            method: "PATCH",  
          }
        );
  
        if (!increaseQuantityResponse.ok) {
          throw new Error(`Error: ${increaseQuantityResponse.status} - ${increaseQuantityResponse.statusText}`);
        }
  
        const increaseData = await increaseQuantityResponse.text();
        console.log("Quantity increased:", increaseData);
        dispatch(incrementCartCount(count));
        alert("Product quantity updated in cart!");
     
      } else {
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
  
        const data = await response.text();
        console.log("Product added to cart:", data);
        dispatch(incrementCartCount(count));
        alert("Product added to cart successfully!");    
      }
  
      // Redirect to cart page with the item count
      router.push(`/pages/Cart/?count=${count}`);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className="products-page">
      <div className="products-page-head">
        <h1>Products</h1>
      </div>
      <div className="products-page-container">
        <div className="products-page-container-head">

          <div className="searchInput">
            <div className="searchBox">
              <FiSearch size={20} />
              <input
                id="searchName"
                type="text"
                placeholder="Search here..."
                value={searchName}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <p onClick={() => setShowFilter(!showFilter)} className="filter-btn"><LuListFilter /> Filter</p>

        </div>
        <div className="products-page-container-content">
          <div className={`products-page-filter ${showFilter ? "open" : ""}`}>
            <div className="products-page-filter-content">
              <div className="products-page-filter-head">
                <h2>Filter</h2>
                <span>
                  <IoIosCloseCircleOutline onClick={() => setShowFilter(!showFilter)} />
                </span>
              </div>
              <div className="filter-container">
                <div className="filter-list-card">
                  <h3>Category</h3>
                  <div className="filter-lists">
                    <div className="filter-list-item">
                      <input
                        type="checkbox"
                        id="select-all-categories"
                        onChange={(e) => handleSelectAllCategories(e.target.checked)}
                        checked={
                          selectedCategories.length === categories.length &&
                          categories.length > 0
                        }
                      />
                      <label htmlFor="select-all-categories">Select All</label>
                    </div>
                    {categories.map((category) => (
                      <div key={`category-${category.id}`} className="filter-list-item">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                        />
                        <label htmlFor={`category-${category.id}`}>{category.name}</label>
                      </div>
                    ))}

                  </div>
                </div>
                <div className="filter-list-card">
                  <h3>Sub Category</h3>
                  <div className="filter-lists">
                    <div className="filter-list-item">
                      <input
                        type="checkbox"
                        id="select-all-subcategories"
                        onChange={(e) => handleSelectAllSubCategories(e.target.checked)}
                        checked={
                          selectedSubCategories.length === filteredSubCategories.length &&
                          filteredSubCategories.length > 0
                        }
                      />
                      <label htmlFor="select-all-subcategories">Select All</label>
                    </div>

                    {filteredSubCategories.map((subCategory) => (
                      <div key={`subcategory-${subCategory.id}`} className="filter-list-item">
                        <input
                          type="checkbox"
                          id={`subCategory-${subCategory.id}`}
                          checked={selectedSubCategories.includes(subCategory.id)}
                          onChange={() => handleSubCategoryChange(subCategory.id)}
                        />
                        <label htmlFor={`subCategory-${subCategory.id}`}>
                          {subCategory.name}
                        </label>
                      </div>
                    ))}

                  </div>
                </div>
                <div className="filter-list-card">
                  <h3>Price</h3>
                  <div className="price-Range">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => handlePriceChange(e, true)} // Pass true for minPrice
                  className="price-Input"
                />

                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => handlePriceChange(e, false)} // Pass false for maxPrice
                  className="price-Input"
                />
              </div>
                </div>
                <div className="filter-btns">
                  <button onClick={handleClearFilters} className="btn-cancel">Clear</button>
                  <button onClick={handleApplyFilters} className="btn">Apply</button>

                </div>
              </div>
            </div>
          </div>
          <div className="products-page-products-cards">
            <div className="product-cards">
              {paginatedProducts.map((product, index) => (
                <div
                  className="product-card"
                  onClick={() => router.push(`/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`)}
                  key={index}
                >

                <div className="product-card-img">
                  {hoverImages[product.id] && (
                    <>
                      <img
                        className="default-img"
                        src={hoverImages[product.id].default}
                        alt={`default-img-${product.id}`}
                      />
                      <img
                        className="hover-img"
                        src={hoverImages[product.id].hover}
                        alt={`hover-img-${product.id}`}
                      />
                    </>
                  )}
                </div>


                  {/* <div className="product-card-img">{product.imageUrl}</div> */}

                  <div className="product-card-text">
                    <span className="sub-category-name">{product.subCategoryName}</span>

                    <h1>{product.productName}</h1>
                    <div className="product-card-price">
                      <p className="offer-price">₹{(product.price - (product.price * product.discount / 100)).toFixed(2)} </p>
                      <p className="price">₹{product.price.toFixed(2)} </p>
                    </div>

                    <div className="add-btn">
                      {(product.categoryId === 2 || product.categoryId === 3 || product.categoryId === 4) && (
                        <button
                          className="addWishList"
                          onClick={(e) => {
                            if (isAuthenticated) {
                              console.log("Adding to cart...");
                              handleAddToCart();  // Call your new handle function to add to cart
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
                      )}
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
    </div>
  );
};

export default Products;
