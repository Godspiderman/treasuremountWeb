"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { LuSettings2 } from "react-icons/lu";
import axios from "axios";
import "./Shop.scss";
import Pagination from "@/app/utils/Pagenation/Pagenation";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/services/useAxiosInstance";

const Shoppage = () => {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [openFilter, setOpenFilter] = useState("CATEGORIES");
  const [openCategory, setOpenCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");


  const [searchName, setSearchName] = useState("");

  const toggleFilter = (filterName) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const toggleCategory = (categoryId) => {
    setOpenCategory((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleFilterSelection = (category, subCategory) => {
    const newFilter = `${category}: ${subCategory}`;
    setSelectedFilter(newFilter);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/public/category/getAll`);
      setCategories(res.data);
      if (res.data.length > 0) {
        setOpenCategory(res.data.map((category) => category.id));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/public/subCategory/getAll`);
      setSubCategories(res.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/public/product/getAll?userId=0&categoryId=0&subCategoryId=0&minPrice=0&maxPrice=0&ProductStatusId=0&isAdmin=false`
      );
      const fetchedProducts = Array.isArray(res.data) ? res.data : [];
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setFilteredProducts([]);
    }
  };

  const handleFilter = async () => {
    const categoryId = selectedCategories.length > 0 ? selectedCategories.join(",") : "0";
    const subCategoryId = selectedSubCategories.length > 0 ? selectedSubCategories.join(",") : "0";

    try {
      const res = await axios.get(
        `${API_URL}/api/public/product/getAll?userId=0&categoryId=${categoryId}&subCategoryId=${subCategoryId}&minPrice=${minPrice || 0}&maxPrice=${maxPrice || 0}&ProductStatusId=0&isAdmin=false`
      );
      setFilteredProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      setFilteredProducts([]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setProducts([]);
    setFilteredProducts([]);
    setSelectedFilter(null);
    setMinPrice("");
    setMaxPrice("");
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [selectedCategories, selectedSubCategories, minPrice, maxPrice]);

  const removeFilter = (filter) => {
    setSelectedSubCategories((prevFilters) =>
      prevFilters.filter((item) => item !== filter)
    );
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories((prevState) => {
      if (prevState.includes(categoryId)) {
        return [];
      }
      return [categoryId];
    });
    setSelectedSubCategories([]);
  };

  const toggleSubCategorySelection = (subCategoryId, categoryName, subCategoryName) => {
    setSelectedSubCategories((prevState) => {
      if (prevState.includes(subCategoryId)) {
        removeFilter(`${categoryName}: ${subCategoryName}`);
        return [];
      } else {
        handleFilterSelection(categoryName, subCategoryName);
        return [subCategoryId];
      }
    });
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

  const hasSelectedFilters = selectedCategories.length > 0 || selectedSubCategories.length > 0 || minPrice || maxPrice;

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const [imageUrls, setImageUrls] = useState({});
  const imagesFetched = useRef(false);

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  useEffect(() => {
    if (searchName === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        (product.productName?.toLowerCase() || "").includes(searchName.toLowerCase()) ||
        (product.shopName?.toLowerCase() || "").includes(searchName.toLowerCase())
    );
    
      setFilteredProducts(filtered);
    }
  }, [searchName, products]);


  const fetchImagesForProducts = async (products) => {
    if (imagesFetched.current) {
      return; // Do not fetch images again if they are already fetched
    }

    try {
      const images = {};

      await Promise.all(
        products.map(async (product) => {
          const response = await axios.get(
            `${API_URL}/api/public/productImages/getAll/${product.id}?positionId=1`
          );

          // If the response contains image data, store it
          if (response.data && response.data.length > 0) {
            images[product.id] = response.data[0].imageUrl;
          } else {
            console.log(`No image found for product ID: ${product.id}`);
          }
        })
      );

      setImageUrls(images);
      imagesFetched.current = true; // Prevent fetching again
    } catch (error) {
      console.error("Error fetching product images:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    if (products.length > 0 && !imagesFetched.current) {
      fetchImagesForProducts(products);
    }
  }, [products]);


  return (
    <div className="shop-page">
      <div className="shoppage-Container">
        <div className="shoppage-Head">
          <div className="shoppage-Head-Container">
            <h2>Available Shops</h2>
            <p>Choose your perfect pet shop</p>
          </div>
          <div className="templates-Btn">
            <button
              className="filter-Toggle-Btn"
              onClick={() => setShowFilter((prev) => !prev)}
            >
              <LuSettings2 />
            </button>
          </div>
        </div>

        <div className="hero-Tabs-Container">
          <div className="search-Input">
            <div className="search-Box">
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
        </div>

        {hasSelectedFilters && (
          <>
            <button className="clear-All-Btn" onClick={clearAllFilters}>
              Clear All
            </button>

            <div className="selected-Filters">
              {selectedFilter && (
                <div className="selected-Filter-Item">
                  {selectedFilter}{" "}
                  <button onClick={() => setSelectedFilter(null)}>×</button>
                </div>
              )}

              {(minPrice || maxPrice) && (
                <div className="selected-Filter-Item">
                  Price:
                  {minPrice && `₹ ${minPrice}`}
                  {minPrice && maxPrice ? ` - ` : ""}
                  {maxPrice && `₹ ${maxPrice}`}
                  <button onClick={() => { setMinPrice(""); setMaxPrice(""); }}>×</button>
                </div>
              )}
            </div>
          </>
        )}

        <div className="shoppage-Content">
          <div className="templates-Filter">
            <div className="template-Filter-Group">
              <label
                className="template-Filter-Name"
                onClick={() => toggleFilter("CATEGORIES")}
              >
                CATEGORIES{" "}
                <span>
                  {openFilter === "CATEGORIES" ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </span>
              </label>
              {openFilter === "CATEGORIES" && (
                <div className="template-Custom-Select">
                  <ul className="template-Dropdown">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <label onClick={() => toggleCategory(category.id)}>
                          {category.name}
                          <span>
                            {openCategory.includes(category.id) ? <IoIosArrowUp /> : <IoIosArrowDown />}
                          </span>
                        </label>

                        {openCategory.includes(category.id) && (
                          <ul className="sub-Dropdown">
                            {subCategories
                              .filter((sub) => sub.categoryId === category.id)
                              .map((sub) => (
                                <li key={sub.id}>
                                  <label>
                                    {sub.name}
                                    <input
                                      type="checkbox"
                                      checked={selectedSubCategories.includes(sub.id)}
                                      onChange={() => {
                                        toggleSubCategorySelection(sub.id, category.name, sub.name);
                                      }}
                                    />
                                  </label>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="filter-Item">
              <div className="dropdown-Header">
                <label>Price Range</label>
              </div>
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
          </div>

          <div className="template-Cards">
            <div className="cards-Container">
              {paginatedProducts.map((product, intex) => (
                <div
                  onClick={() => router.push(`/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`)}
                  key={intex}
                  className="card">
                  <div className="product-card-img">
                    <img
                      src={imageUrls[product.id] || "default-placeholder.jpg"}
                      alt={`product-img-${product.id}`}
                      className="default-img"
                    />
                  </div>

                  <div className="card-Details">
                    <p className="card-Title">{product.productName}</p>
                    <p className="card-Title">Shop Name: {product.shopName || "Location not available"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Shoppage;
