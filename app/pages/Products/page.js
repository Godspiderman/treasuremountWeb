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
import AddToCartButton from "@/app/utils/AddCart/page";

const Products = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // console.log("Redux auth state:", isAuthenticated);

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  console.log(categoryId);


  const searchQuery = useSelector((state) => state.search.searchQuery);

  useEffect(() => {
    fetchProducts({ search: searchQuery, categoryId });
  }, [searchQuery, categoryId]);

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
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setMinPrice("");
    setMaxPrice("");
    try {
      const userIdFromParams = searchParams.get("userId") || 0;
      const queryParams = new URLSearchParams({
        search: filters.search || "",
        userId: filters.userId || userIdFromParams,
        categoryId: filters.categoryId || categoryId || [],
        subCategoryId: filters.subCategoryId || [],
        minPrice: filters.minPrice || 0,
        maxPrice: filters.maxPrice || 0,
        ProductStatusId: filters.ProductStatusId || [],
        isAdmin: false,
      });
      console.log(queryParams.subCategoryId);
      console.log(categoryId);
      dispatch(startLoading());

      const response = await axios.get(`${API_URL}/api/public/product/getAll/temp?${queryParams.toString()}`);

      const fetchedProducts = Array.isArray(response.data) ? response.data : [];
      setProductsData(fetchedProducts);
      dispatch(stopLoading());

    } catch (error) {
      dispatch(startLoading());

      console.error("Error fetching products:", error);
      setProductsData([]);
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
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setMinPrice("");
    setMaxPrice("");

    setSearchName(event.target.value);

    //setSearchQuery(event.target.value);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, searchName]);


  const filteredData = productsData.filter((products) =>
    (products.productName?.toLowerCase() || "").includes(searchName.toLowerCase()) &&
    (products.productName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (products.subCategoryName?.toLowerCase() || "").includes(searchName.toLowerCase()) &&
    (products.subCategoryName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (products.categoryName?.toLowerCase() || "").includes(searchName.toLowerCase()) &&
    (products.categoryName?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);


  // if (currentPage >= pageCount) {
  //   setCurrentPage(1);
  // }

  useEffect(() => {
    if (currentPage >= pageCount) {
      setCurrentPage(0);
    }
  }, [filteredData, pageCount]);

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
        setFetchedProductIds((prev) => new Set([...prev, ...newProductIds]));
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
                          selectedCategories.length === categories.filter(cat => cat.activeStatus).length &&
                          categories.filter(cat => cat.activeStatus).length > 0
                        }
                      />
                      <label htmlFor="select-all-categories">Select All</label>
                    </div>
                    {categories
                      .filter(category => category.activeStatus) // Filter active categories
                      .map((category) => (
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
                          selectedSubCategories.length === filteredSubCategories.filter(subCat => subCat.activeStatus).length &&
                          filteredSubCategories.filter(subCat => subCat.activeStatus).length > 0
                        }
                      />
                      <label htmlFor="select-all-subcategories">Select All</label>
                    </div>

                    {filteredSubCategories
                      .filter(subCategory => subCategory.activeStatus) // Filter active subcategories
                      .map((subCategory) => (
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
                  key={index}
                >

                  <div className="product-card-img"
                    onClick={() => router.push(`/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`)}
                  >
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

                  <div className="product-card-text"
                    onClick={() => router.push(`/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`)}
                  >
                    <span className="sub-category-name">{product.subCategoryName}</span>

                    <h1>{product.productName}</h1>
                    <div className="product-card-price">
                      <p className="offer-price">₹{(product.price - (product.price * product.discount / 100)).toFixed(2)} </p>
                      <p className="price">₹{product.price.toFixed(2)} </p>
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
    </div>
  );
};

export default Products;
