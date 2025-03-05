"use client";

import React, { useState, useEffect, useRef } from "react"; 


import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/app/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMdSearch } from "react-icons/io";
import { RiCloseFill } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { setSearchQuery } from "@/app/redux/slices/searchSlice";
import { API_URL } from "@/app/services/useAxiosInstance";


const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) => state.auth?.cartCount || 0);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();

  const userId = useSelector((state) => state.auth?.user?.userId || null);
  const [profileImage, setProfileImage] = useState("");

  const searchQuery = useSelector((state) => state.search.searchQuery);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pages/Products`);
    }
  };

  const toggleMenu = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 854) {
      setIsMenuOpen(!isMenuOpen);

    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const handleLogout = () => {
  //   dispatch(logout());
  //   router.push("/");
  // };

  const [showModal, setShowModal] = useState(false);

const handleLogoutClick = () => {
  setShowModal(true);
};

const handleConfirmLogout = () => {
  dispatch(logout());
  router.push("/");
  setShowModal(false);
};

const handleCancelLogout = () => {
  setShowModal(false);
};


  const getLinkClass = (href) => {
    return pathname === href ? "active" : "";
  };

  const handleIconClick = () => {
    if (searchTerm) {
      router.push(`/pages/Products`);
    }
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setFilteredProducts(productsData);
    } else {
      setSearchTerm("");
      setFilteredProducts([]);
      dispatch(setSearchQuery(""));
    }
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${API_URL}/api/public/resource/profileImage/getOne/${userId}`
          );

          if (response.ok && response.headers.get("Content-Type")?.includes("application/json")) {
            const data = await response.json();

            if (data && data.imageUrl) {
              setProfileImage(data.imageUrl);
            } else {
              console.log("No image found for this user.");
              setProfileImage("/image/profile.png");
            }
          } else if (response.status === 204) {
            console.log("No profile image found.");
            setProfileImage("/image/profile.png");
          } else {
            console.log("Error fetching profile image: Invalid response.");
          }
        } catch (error) {
          console.log("Error fetching profile image:", error);
          setProfileImage("/image/profile.png");
        }
      }
    };

    fetchProfileImage();
  }, [userId]);


  const handleCategoryClick = (e, categoryId) => {
    e.preventDefault(); 
    router.push(`/pages/Products?categoryId=${categoryId}`);
    console.log(categoryId);
  };

  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleProductDropdown = (e) => {
    e.preventDefault(); 
    setIsProductDropdownOpen((prev) => !prev);
  };
 

  return (
    <div className={`navbarMain ${isSticky ? "fixed" : ""}`}>
      {/* <div className="alert-area">
        <p>Payment is pending for this development</p>
      </div> */}
      <div className="navbarContainer">
        <nav className="navbar">
          <div className="navIcons">
            <div className="menuToggle" onClick={toggleMenu}>
              {!isMenuOpen ? (
                <FaBars className="icon" />
              ) : (
                <FaTimes className="icon" />
              )}
            </div>
            <div className="logo">
              <Link href="/">
                <img src="/image/logo.png" alt="Logo" />
              </Link>
            </div>

          </div>
          <ul
            ref={menuRef}
            className={`navItems ${isMenuOpen ? "active" : ""}`}
          >
            {/* Menu Links */}
            <li onClick={closeMenu}>
              <Link href="/" className={getLinkClass("/")}>
                Home
              </Link>
            </li>
            <li onClick={closeMenu}>
              <Link
                href="/pages/Pets"
                className={getLinkClass("/pages/Pets")}
              >
                Pets
              </Link>
            </li>

            <li className="dropdown">
              <Link href="/pages/Products" className={getLinkClass("/pages/Products")}  onClick={toggleProductDropdown}>
              
                Products <MdKeyboardArrowDown />
              </Link>
              <div className={`dropdown-content ${isProductDropdownOpen ? "active" : ""}`} onClick={closeMenu} onMouseLeave={() => setIsProductDropdownOpen(false)}>
                <Link href="/pages/Products">All</Link>
                <Link href="/pages/Products" onClick={(e) => handleCategoryClick(e, 1)}>Pets</Link>
                <Link href="/pages/Products" onClick={(e) => handleCategoryClick(e, 3)}>Accessories</Link>
                <Link href="/pages/Products" onClick={(e) => handleCategoryClick(e, 4)}>Medicine</Link>
                <Link href="/pages/Products" onClick={(e) => handleCategoryClick(e, 2)}>Food</Link>
                <Link href="/pages/Products" onClick={(e) => handleCategoryClick(e, 7)}>Farm Animals</Link>
              </div>

            </li>

            <li onClick={closeMenu}>
              <Link
                href="/pages/Shop"
                className={getLinkClass("/pages/Shop")}
              >
                Shops
              </Link>
            </li>
            <li onClick={closeMenu}>
              <Link
                href="/pages/Blog"
                className={getLinkClass("/pages/Blog")}
              >
                Blog
              </Link>
            </li>
            <li onClick={closeMenu}>
              <Link
                href="/pages/ConsultVet"
                className={getLinkClass("/pages/ConsultVet")}
              >
                Consult a Vet
              </Link>
            </li>

            {/* Close Icon */}
            <div className="closeIcon" onClick={toggleMenu}>
              <RiCloseFill />
            </div>
          </ul>

          {isAuthenticated ? (
            <div className="rightMenu">
              <div className="searchPageContent">
                <div className="searchPageInput">
                  <span className="searchIcon" onClick={handleIconClick}>
                    {isSearchOpen ? (
                      <FaTimes className="clearIcon" />
                    ) : (
                      <IoMdSearch />
                    )}
                  </span>

                  <div
                    className={`dropdownContainer ${isSearchOpen ? "showDropdown" : "hideDropdown"
                      }`}
                  >
                    <form onSubmit={handleSearchSubmit} className="searchForm">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search products..."
                      />
                      <button type="submit" className="searchButton">
                        <FaSearch />
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <Link href="/pages/Cart">
                <div className="cartIconContainer">
                  <CiShoppingCart />

                  {cartCount > 0 && (
                    <span className="cartCount">{cartCount}</span>
                  )}
                </div>

              </Link>

              <Link href="/pages/Profile">
                <span className="helloText">
                  <img
                    src={profileImage || "/image/profile.png"}
                    alt="Profile"
                    className="profile-img"
                  />
                </span>
              </Link>

              <button className="logout-btn" onClick={handleLogoutClick}>
                Logout
              </button>
              <button className="logout-btn-icon" onClick={handleLogoutClick}>
                <IoLogOutOutline />
              </button>


              {showModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2>Confirm Logout</h2>
                      <button className="close-modal-button" onClick={handleCancelLogout}>
                        &times;
                      </button>
                    </div>
                    <div className="modal-body">
                      <p>Are you sure you want to log out?</p>
                    </div>
                    <div className="modal-footer">
                      <button className="cancel-button" onClick={handleCancelLogout}>
                        Cancel
                      </button>
                      <button className="confirm-button" onClick={handleConfirmLogout}>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}


            </div>
          ) : (
            <div className="rightMenu">
              <div className="searchPageContent">
                <div className="searchPageInput">
                  <span className="searchIcon" onClick={handleIconClick}>
                    {isSearchOpen ? (
                      <FaTimes className="clearIcon" />
                    ) : (
                      <IoMdSearch />
                    )}
                  </span>

                  <div
                    className={`dropdownContainer ${isSearchOpen ? "showDropdown" : "hideDropdown"
                      }`}
                  >
                    <form onSubmit={handleSearchSubmit} className="searchForm">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search products..."
                      />
                      <button type="submit" className="searchButton">
                        <FaSearch />
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <Link
                href="/pages/Login"
                className={getLinkClass("/pages/Login")}
              >
                <span className="logout-btn">Login</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
