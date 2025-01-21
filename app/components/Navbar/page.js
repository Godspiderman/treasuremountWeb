"use client"

import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/app/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios"; 
import { IoMdSearch } from "react-icons/io";
import { RiCloseFill } from "react-icons/ri";
// import Pagination from "./Pagination"; 


import { setSearchQuery } from "@/app/redux/slices/searchSlice";
import { API_URL } from "@/app/services/useAxiosInstance";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const menuRef = useRef(null); 
  const pathname = usePathname(); 

  // Fetch Products function
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/product/getAll`);
      setProductsData(response.data || []);
      setFilteredProducts(response.data || []);
      setPageCount(Math.ceil(response.data.length / 10)); 
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const searchQuery = useSelector((state) => state.search.searchQuery);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };


  const handleSearchSubmit = (event) => {
    event.preventDefault(); 
    if (searchQuery.trim()) {
      router.push(`/pages/Products?search=${searchQuery}`);
    }
  };


  const toggleMenu = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 854) {
      setIsMenuOpen(!isMenuOpen);
      //document.body.classList.toggle("menu-open", !isMenuOpen);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Sticky Navbar on Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const getLinkClass = (href) => {
    return pathname === href ? "active" : "";
  };


  const handleIconClick = () => {
    if (searchTerm) {
      router.push(`/pages/Products?search=${searchTerm}`);
    }
    setIsSearchOpen(!isSearchOpen); // Toggle search dropdown
    if (!isSearchOpen) {
      setFilteredProducts(productsData); 
    } else {
      setSearchTerm(""); 
      setFilteredProducts([]); 
    }
  };
  
  
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

  const handleProductCardClick = (product) => {
    setIsSearchOpen(false); 
    setSearchTerm("");
    setFilteredProducts([]);
    
    router.push(`/pages/PetDetails?productId=${product.id}&categoryId=${product.categoryId}`);
  };

  
  
  return (
    <div className={`navbarMain ${isSticky ? "fixed" : ""}`}>

      <div className="navbarContainer">
        <nav className="navbar">
          <div className="navIcons">
            <div className="menuToggle" onClick={toggleMenu}>
              {!isMenuOpen ? <FaBars className="icon" /> : <FaTimes className="icon" />}
            </div>
            <div className="logo">
              <Link href="/">
                <img src="/image/logo.png" alt="Logo" />
              </Link>
            </div>

            <ul ref={menuRef} className={`navItems ${isMenuOpen ? "active" : ""}`}>
              {/* Menu Links */}
              <li onClick={closeMenu}><Link href="/" className={getLinkClass("/")}>Home</Link></li>
              <li onClick={closeMenu}><Link href="/pages/Pets" className={getLinkClass("/pages/Pets")}>Pets</Link></li>
              <li onClick={closeMenu}><Link href="/pages/Products" className={getLinkClass("/pages/Products")}>Products</Link></li>
              <li onClick={closeMenu}><Link href="/pages/Shop" className={getLinkClass("/pages/Shop")}>Shops</Link></li>
              <li onClick={closeMenu}><Link href="/pages/Blog" className={getLinkClass("/pages/Blog")}>Blog</Link></li>
              <li onClick={closeMenu}><Link href="/pages/ConsultVet" className={getLinkClass("/pages/ConsultVet")}>Consult a Vet</Link></li>

              {/* Close Icon */}
              <div className="closeIcon" onClick={toggleMenu}>
              <RiCloseFill />
              </div>
            </ul>
          </div>

          {/* Right Menu */}
         
            <div className="rightMenu">
              {/* Search Input */}
              <div className="searchPageContent">
                <div className="searchPageInput">
                  <span className="searchIcon" onClick={handleIconClick}>
                    {isSearchOpen ? <FaTimes className="clearIcon" /> : <IoMdSearch />}
                  </span>

                  <div className={`dropdownContainer ${isSearchOpen ? "showDropdown" : "hideDropdown"}`}>
                    <form onSubmit={handleSearchSubmit} className="searchForm">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search products..."
                      />
                      <button type="submit" className="searchButton"><FaSearch /></button>
                    </form>

                  </div>
                </div>
              </div>
            </div>

             {isAuthenticated ? (
              <div className="rightMenu">
              {/* Cart and Profile links */}
              <Link href="/pages/Cart"><CiShoppingCart /></Link>
              <Link href="/pages/Profile">
                <span className="helloText"><img src="/image/profile.png" alt="Profile" /></span>
              </Link>

              <button className="logout-btn" onClick={handleLogout}>Logout</button>
              <button className="logout-btn-icon" onClick={handleLogout}><IoLogOutOutline /></button>
             
            </div>
          ) : (
            <div className="rightMenu">
              <Link href="/pages/Login" className={getLinkClass("/pages/Login")}>
                <span className="login-btn">Login</span>
              </Link>
            </div>
          )}
        </nav>
      </div>

     

    </div>
  );
};

export default Navbar;
