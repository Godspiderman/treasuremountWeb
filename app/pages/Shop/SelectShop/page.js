"use client";

import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { LuSettings2 } from "react-icons/lu";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
 const SelectShop = () => {
    const [openFilter, setOpenFilter] = useState("CATEGORIES");
  const [openSubFilter, setOpenSubFilter] = useState("dogs");
  const [price, setPrice] = useState(30); // Default price value

  const toggleFilter = (filterName) => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
  };
  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };
  const toggleSubFilter = (subFilterName) => {
    setOpenSubFilter((prev) => (prev === subFilterName ? null : subFilterName));
  };

  const [hoveredCard, setHoveredCard] = useState(null);

  const handleMouseEnter = (id) => {
    setHoveredCard(id);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };
  
  const collections = [
    {
      id: 1,
      image: "/image/selectShop-1.png",
      title: "Simply Dog",
      oldPrice:'$6000',
      nexPrice:'$5000',
      locationArea:'Pet Shop 1, Tenkasi-01',
    },
    {
      id: 2,
      image: "/image/home-23.png",
      title: "Simply Cat",
      oldPrice:'$6000',
      nexPrice:'$5000',
      locationArea:'Pet Shop 1, Tenkasi-01',
    },
    {
      id: 3,
      image: "/image/shop-7.jpg",
      title: "Simply Cat",
      oldPrice:'$6000',
      nexPrice:'$5000',
      locationArea:'Pet Shop 1, Tenkasi-01',
    },
    {
      id: 4,
      image: "/image/shop-8.png",
      title: "Simply Cat",
      oldPrice:'$6000',
      nexPrice:'$5000',
      locationArea:'Pet Shop 1, Tenkasi-01',
    },
    {
      id: 5,
      image: "/image/selectShop-2.png",
      title: "Simply Cat",
      oldPrice:'$6000',
      nexPrice:'$5000',
      locationArea:'Pet Shop 1, Tenkasi-01',
    },
    {
      id: 6,
      image: "/image/shop-6.png",
      title: "Simply Cat",
      oldPrice:'$6000',
      nexPrice:'$5000',
      locationArea:'Pet Shop 1, Tenkasi-01',
    },
    {
      id: 7,
      image: "/image/shop-7.jpg",
      title: "Simply Cat",
      oldPrice:'$6000',
      nexPrice:'$5000',
      locationArea:'Pet Shop 1, Tenkasi-01',
    },
    {
      id: 8,
      image: "/image/shop-8.png",
      title: "Simply Cat",
      oldPrice:'$6000',
      nexPrice:'$5000',
      locationArea:'Pet Shop 1, Tenkasi-01',
    },
    {
      id: 9,
      image: "/image/shop-9.jpg",
      title: "Simply Cat",
      oldPrice:'$6000',
      nexPrice:'$5000',
      locationArea:'Pet Shop 1, Tenkasi-01',
    },
    {
      id: 10,
      image: "/image/shop-10.png",
      title: "Simply Cat",
      oldPrice:'$6000',
      nexPrice:'$5000',
      locationArea:'Pet Shop 1, Tenkasi-01',
    },
    {
      id: 11,
      image: "/image/shop-11.jpg",
      title: "Simply Cat",
      oldPrice:'$6000',
      nexPrice:'$5000',
      locationArea:'Pet Shop 1, Tenkasi-01',
    },
    {
      id: 12,
      image: "/image/shop-12.jpg",
      title: "Simply Cat",
      oldPrice:'$6000',
      nexPrice:'$5000',
      locationArea:'Pet Shop 1, Tenkasi-01',
    },
  ];

  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
   return (
    <div className="shoppage">
    <div className="shoppageContainer">
      <div className="shoppageHead">
        <div className="shoppageHeadContainer">
          <h2>CutieHup Shop</h2>
          <p>Choose your perfect pet</p>
        </div>
        <div className="templatesBtn">
          <button
            className="filterToggleBtn"
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <LuSettings2 />
          </button>
        </div>
      </div>
      <div className="heroTabsContainer">
      <div className="searchInput">
          <div className="searchBox">
            <FiSearch size={20} />

            <input type="text" placeholder="Search here..." />
          </div>
        </div>
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
      <div className="shoppageContent">
        <div className="templatesContent">
          <div
            className={`templatesFilter ${showFilter ? "visible" : "hidden"}`}
          >
            {/* Trending Filters */}
            {/* <div className="filterinput">
              <FaSearch className="search-icon" />  
              <input type="text" placeholder="Search" />
            </div> */}

            <div className="templateFilterGroup">
              <label
                className="templateFilterName"
                onClick={() => toggleFilter("CATEGORIES")}
                htmlFor="CATEGORIES"
              >
                CATEGORIES{" "}
                <span>
                  {openFilter === "CATEGORIES" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </label>
              {openFilter === "CATEGORIES" && (
                <div className="templateCustomSelect">
                  <ul className="templateDropdown">
                    <li>
                      <label onClick={() => toggleSubFilter("dogs")}>
                        Dogs
                        <span>
                          {openSubFilter === "dogs" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "dogs" && (
                        <ul className="subDropdown">
                          <li>Labrador Retriever</li>
                          <li>German Shepherd</li>
                          <li>Golden Retriever</li>
                          <li>Beagle</li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <label onClick={() => toggleSubFilter("cats")}>
                        Cats
                        <span>
                          {openSubFilter === "cats" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "cats" && (
                        <ul className="subDropdown">
                          <li>Persian Cat</li>
                          <li>Siamese Cat</li>
                          <li>Maine Coon</li>
                          <li>Bengal Cat</li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <label onClick={() => toggleSubFilter("Birds")}>
                        Birds
                        <span>
                          {openSubFilter === "Birds" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "Birds" && (
                        <ul className="subDropdown">
                          <li>Persian Cat</li>
                          <li>Siamese Cat</li>
                          <li>Maine Coon</li>
                          <li>Bengal Cat</li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <label onClick={() => toggleSubFilter("Aquarium")}>
                        Aquarium
                        <span>
                          {openSubFilter === "Aquarium" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "Aquarium" && (
                        <ul className="subDropdown">
                          <li>Persian Cat</li>
                          <li>Siamese Cat</li>
                          <li>Maine Coon</li>
                          <li>Bengal Cat</li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <label onClick={() => toggleSubFilter("Farm Animals")}>
                        Farm Animals
                        <span>
                          {openSubFilter === "Farm Animals" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "Farm Animals" && (
                        <ul className="subDropdown">
                          <li>Persian Cat</li>
                          <li>Siamese Cat</li>
                          <li>Maine Coon</li>
                          <li>Bengal Cat</li>
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Price Filter */}

            <div className="templateFilterGroup">
              <label
                className="templateFilterName"
                onClick={() => toggleFilter("CATEGORIES")}
                htmlFor="CATEGORIES"
              >
                PRICE RANGE{" "}
                <span>
                  {openFilter === "CATEGORIES" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </label>
              {openFilter === "CATEGORIES" && (
                <div className="templateCustomSelect">
                  <div className="priceRangeWrapper">
                    <div className="rangeLabels">
                      <span className="startPrice">$0</span>
                      <span className="endPrice">$80</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      value={price}
                      onChange={handlePriceChange}
                      className="priceRangeSlider"
                    />
                    <div className="priceDisplay">Price: ${price}</div>
                  </div>
                </div>
              )}
            </div>

            {/* FOOD FOR PETS Filters */}
            <div className="templateFilterGroup">
              <label
                className="templateFilterName"
                onClick={() => toggleFilter("petsfood")}
                htmlFor="petsfood"
              >
                FOOD FOR PETS{" "}
                <span>
                  {openFilter === "petsfood" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </label>
              {openFilter === "petsfood" && (
                <div className="templateCustomSelect">
                  <ul className="templateDropdown">
                    <li>
                      <label onClick={() => toggleSubFilter("dogsfood")}>
                        Dogs
                        <span>
                          {openSubFilter === "dogsfood" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "dogsfood" && (
                        <ul className="subDropdown">
                          <li>Dog Food 1</li>
                          <li>Dog Food 2</li>
                          <li>Dog Food 3</li>
                          <li>Dog Food 4</li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <label onClick={() => toggleSubFilter("catsfood")}>
                        Cats
                        <span>
                          {openSubFilter === "catsfood" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "catsfood" && (
                        <ul className="subDropdown">
                          <li>Cat Food 1</li>
                          <li>Cat Food 1</li>
                          <li>Cat Food 1</li>
                          <li>Cat Food 1t</li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <label onClick={() => toggleSubFilter("Birdsfood")}>
                        Birds
                        <span>
                          {openSubFilter === "Birdsfood" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "Birdsfood" && (
                        <ul className="subDropdown">
                          <li>Birdsfood 1</li>
                          <li>Birdsfood 2</li>
                          <li>Birdsfood 3</li>
                          <li>Birdsfood 4</li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <label onClick={() => toggleSubFilter("Aquariumfood")}>
                        Aquarium
                        <span>
                          {openSubFilter === "Aquariumfood" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "Aquariumfood" && (
                        <ul className="subDropdown">
                          <li>Aquariumfood 1</li>
                          <li>Aquariumfood 2</li>
                          <li>Aquariumfood 3</li>
                          <li>Aquariumfood 4</li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <label
                        onClick={() => toggleSubFilter("Farm Animals food")}
                      >
                        Farm Animals
                        <span>
                          {openSubFilter === "Farm Animals food" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "Farm Animals food" && (
                        <ul className="subDropdown">
                          <li>Farm Animals food 1</li>
                          <li>Farm Animals food 2</li>
                          <li>Farm Animals food 3</li>
                          <li>Farm Animals food 4</li>
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* ACCESSORIES Filters */}
            <div className="templateFilterGroup">
              <label
                className="templateFilterName"
                onClick={() => toggleFilter("ACCESSORIES")}
                htmlFor="ACCESSORIES"
              >
                ACCESSORIES{" "}
                <span>
                  {openFilter === "ACCESSORIES" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </label>
              {openFilter === "ACCESSORIES" && (
                <div className="templateCustomSelect">
                  <ul className="templateDropdown">
                    <li>
                      <label onClick={() => toggleSubFilter("Bed")}>
                        Bed
                        <span>
                          {openSubFilter === "Bed" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "Bed" && (
                        <ul className="subDropdown">
                          <li>Bed 1</li>
                          <li>Bed 2</li>
                          <li>Bed 3</li>
                          <li>Bed 4</li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <label onClick={() => toggleSubFilter("Gage")}>
                        Gage
                        <span>
                          {openSubFilter === "Gage" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "Gage" && (
                        <ul className="subDropdown">
                          <li>Gage 1</li>
                          <li>Gage 1</li>
                          <li>Gage 1</li>
                          <li>Gage 1</li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <label onClick={() => toggleSubFilter("Tank")}>
                        Tank
                        <span>
                          {openSubFilter === "Tank" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "Tank" && (
                        <ul className="subDropdown">
                          <li>Tank 1</li>
                          <li>Tank 2</li>
                          <li>Tank 3</li>
                          <li>Tank 4</li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <label onClick={() => toggleSubFilter("Basket")}>
                        Basket
                        <span>
                          {openSubFilter === "Basket" ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      </label>
                      {openSubFilter === "Basket" && (
                        <ul className="subDropdown">
                          <li>Basket 1</li>
                          <li>Basket 2</li>
                          <li>Basket 3</li>
                          <li>Basket 4</li>
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="templateCards">
            <div className="templateCardsContent">
              {collections.map((item) => (
                <div
                  key={item.id}
                  className="tabCard" 
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={hoveredCard === item.id ? item.image : item.image}
                    alt={item.title}
                    className="templatecardImage"
                  />
                  <p>{item.title}</p>
                  <div className="tabPrice">
                    <p>{item.oldPrice}</p>
                    <p>{item.nexPrice}</p>
                  </div>
                  <div className="locate">
                    <p>{item.locationArea}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
   )
 }
 
 export default SelectShop;