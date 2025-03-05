"use client";

import React, { useEffect, useState } from "react";
import './PetAdd.scss';
import axios from "axios";
import { useSelector } from "react-redux";
import { MdDeleteForever } from 'react-icons/md';
import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "@/app/services/useAxiosInstance";

function PetAdd() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  console.log(id);
  const router = useRouter();

  const [subCategories, setSubCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const userId = useSelector((state) => state.auth.user.userId);

  const [productImageList, setProductImageList] = useState([]);
  const [productImageLists, setProductImageLists] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [positions, setPositions] = useState([]);


  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/resource/pet/getOne/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch pet data: ${response.status}`);
        }
        const data = await response.json();
        setFormData(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching pet data:", err);
      }
    };

    fetchData();
  }, [id]);




  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/position/getAll`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPositions(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchPositions();
  }, []);


  const navigateToAddPets = () => {
    router.push('/pages/Profile/AddPets');
  };


  const defaultFormData = {
    id: 0,
    productId: 0,
    productName: '',
    productImageUrl: '',
    productPrice: 0,
    stockQuantity: 0,
    activeStatus: true,
    returnWithin: 0,
    productCreatedDate: new Date().toISOString(),
    productUpdatedDate: new Date().toISOString(),
    discount: 0,
    minStockLevel: 0,
    videoUrl: '',
    barCode: '',
    breed: '',
    month: null,
    year: null,
    gender: '',
    color: '',
    weight: 0,
    isTransportAvailable: true,
    isVeterinaryVerified: true,
    veterinaryCertificationUrl: null,
    isInsured: true,
    insuredCertificationUrl: null,
    about: '',
    healthInfo: '',
    careInstructions: '',
    specialRequirements: '',
    subCategoryId: 0,
    productStatusId: 2,
    userId: userId,
    categoryId: 1,
  };

  const [formData, setFormData] = useState(defaultFormData);



  useEffect(() => {
    fetchSubCategories();
  }, []);


  const fetchSubCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/public/subCategory/getAllSubCategory/${1}`);
      const data = await response.json();
      setSubCategories(data);
      console.log('setSubCategories:', data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleAdd = async () => {
    const formErrors = {};
    if (!imageFile) formErrors.image = "Image is required.";
    if (!selectedPosition) formErrors.selectedPosition = "Position is required.";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const newImage = {
          file: imageFile,
          position: selectedPosition
        };
        setProductImageList([...productImageList, newImage]);
        setImageFile(null);
        setSelectedPosition('');


      } catch (error) {
        console.error("Error adding image:", error);
        alert("Failed to add image.");
      }
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = productImageList.filter((_, idx) => idx !== index);
    setProductImageList(updatedImages);
  };
  console.log(productImageList);


  const handleProductImageUpload = async (productId) => {
    console.log(productId, productImageList);
    try {
      const uploadPromises = productImageList.map(async (imageData) => {
        const formData = new FormData();
        formData.append("file", imageData.file);
        const positionId = parseInt(imageData.position);
        console.log(positionId, productId, imageData.file);

        await axios.post(
          `${API_URL}/api/public/productImages/upload?productId=${productId}&positionId=${positionId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      });

      await Promise.all(uploadPromises);

      alert("Images uploaded successfully!");

    } catch (error) {
      console.error("Error during upload process:", error);
      alert("Failed to upload images.");
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/public/productImages/getAll?productId=${formData.productId}&positionId=0`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const fetchedImages = data.map((image) => ({
        ...image,
        selected: false,
      }));

      setProductImageLists(fetchedImages);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  useEffect(() => {
    if (formData.productId) {
      fetchImages();
    }
  }, [formData.productId]);


  const handleDeleteImage = async (productId, positionId) => {
    try {
      await axios.delete(`${API_URL}/api/public/productImages/delete/${productId}?positionId=${positionId}`);

      fetchImages(productId);

      alert("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image.");
    }
  };


  const validateForm = () => {
    const formErrors = {};

    if (!formData.subCategoryId) formErrors.subCategoryId = 'Sub Category is required';
    if (!(formData.productName || '').trim()) formErrors.productName = 'Product Name is required';

    if (!formData.productPrice) {
      formErrors.productPrice = "Price is required.";
    } else if (isNaN(formData.productPrice) || formData.productPrice <= 0 || formData.productPrice > 1000000) {
      formErrors.productPrice = "Price must be a number between 0 and 1,000,000.";
    }

    if (!formData.stockQuantity) {
      formErrors.stockQuantity = "Stock Quantity is required.";
    } else if (isNaN(formData.stockQuantity) || formData.stockQuantity < 0) {
      formErrors.stockQuantity = "Stock Quantity must be a whole number greater than or equal to 0.";
    }

    if (!formData.minStockLevel) {
      formErrors.minStockLevel = "Minimum Stock Level is required.";
    }

    if (!formData.discount && formData.discount !== 0) {
      formErrors.discount = "Discount is required.";
    } else if (isNaN(formData.discount) || formData.discount < 0 || formData.discount > 100) {
      formErrors.discount = "Discount must be a number between 0 and 100.";
    }


    if (!formData.returnWithin) {
      formErrors.returnWithin = "Return Within Level is required.";
    }

    if (!formData.videoUrl) {
      formErrors.videoUrl = "Video Url is required.";
    }

    if (!formData.barCode) {
      formErrors.barCode = "barCode is required.";
    }

    if (!formData.breed) {
      formErrors.breed = "Breed is required.";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.breed)) {
      formErrors.breed = "Breed must be between 2 and 50 alphabetic characters.";
    }

    if (!formData.gender) {
      formErrors.gender = "Gender is required.";
    } else if (!["Male", "Female"].includes(formData.gender)) {
      formErrors.gender = "Invalid gender selected.";
    }

    if (!formData.weight) {
      formErrors.weight = "Weight is required.";
    } else if (isNaN(formData.weight) || formData.weight <= 0 || formData.weight > 1000) {
      formErrors.weight = "Weight must be a number between 0 and 1000.";
    }

    if (!formData.color) {
      formErrors.color = "Color is required.";
    } else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.color)) {
      formErrors.color = "Color must be between 2 and 30 alphabetic characters.";
    }

    if (!formData.year) {
      formErrors.year = "Year is required.";
    }

    if (!formData.month) {
      formErrors.month = "Age is required.";
    }

    if (!formData.healthInfo || !formData.healthInfo.trim()) {
      formErrors.healthInfo = "Health Info is required.";
    } else if (formData.healthInfo.length > 200) {
      formErrors.healthInfo = "Health Info must not exceed 200 characters.";
    }


    if (!formData.specialRequirements || !formData.specialRequirements.trim()) {
      formErrors.specialRequirements = "Special Requirements are required.";
    } else if (formData.specialRequirements.length > 300) {
      formErrors.specialRequirements = "Special Requirements must not exceed 300 characters.";
    }


    if (!formData.careInstructions) {
      formErrors.careInstructions = "Care Instructions are required.";
    } else if (formData.careInstructions.length > 500) {
      formErrors.careInstructions = "Care Instructions must not exceed 500 characters.";
    }

    if (!formData.about) {
      formErrors.about = "About is required.";
    } else if (formData.about.length > 1000) {
      formErrors.about = "About must not exceed 1000 characters.";
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm() || {};
    if (Object.keys(errors).length > 0) {
      console.error("Validation errors:", errors);
      return;
    }

    const dataToSend = {
      id: formData.id === 0 ? undefined : parseInt(formData.id), // Use undefined if id is 0, otherwise parseInt
      productId: parseInt(formData.productId),
      productName: formData.productName,
      productImageUrl: formData.productImageUrl,
      productPrice: parseFloat(formData.productPrice),
      activeStatus: formData.activeStatus,
      returnWithin: formData.returnWithin,
      productCreatedDate: formData.productCreatedDate,
      productUpdatedDate: new Date().toISOString(),
      categoryId: parseInt(formData.categoryId),
      userId: formData.userId,
      subCategoryId: parseInt(formData.subCategoryId),
      productStatusId: parseInt(formData.productStatusId),
      videoUrl: formData.videoUrl,
      barCode: parseInt(formData.barCode),
      breed: formData.breed,
      year: parseInt(formData.year),
      month: parseInt(formData.month),
      gender: formData.gender,
      color: formData.color,
      weight: formData.weight,
      about: formData.about,
      healthInfo: formData.healthInfo,
      careInstructions: formData.careInstructions,
      specialRequirements: formData.specialRequirements,
      minStockLevel: parseInt(formData.minStockLevel),
      stockQuantity: parseInt(formData.stockQuantity),
      discount: formData.discount,
      isTransportAvailable: formData.isTransportAvailable,
      isVeterinaryVerified: formData.isVeterinaryVerified,
      veterinaryCertificationUrl: formData.veterinaryCertificationUrl,
      isInsured: formData.isInsured,
      insuredCertificationUrl: formData.insuredCertificationUrl,
    };

    console.log("Submitting payload:", JSON.stringify(dataToSend, null, 2));

    try {
      const url = formData.id === 0
        ? `${API_URL}/api/public/resource/pet/add`
        : `${API_URL}/api/public/resource/pet/update/${id}`;

      const method = formData.id === 0 ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      console.log("API Response Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Operation successful:", responseData);

      const newProductId = responseData?.productId || formData.productId;
      if (newProductId) {
        try {
          await handleProductImageUpload(newProductId);
          console.log("Product image upload successful");
        } catch (error) {
          console.error("Error during image upload:", error);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error.message || error.response?.data);
    }
  };



  return (
    <div className="Pet-add">
      <div className="Pet-add-container">
        <div className="Pet-add-contents">
          <div className="Pet-add-head">
            <h2>Add Pets:</h2>
          </div>
          <div className="user-data-1">
            <div className="form-2">
              <div className="form1">
                <label>Name:</label>
                <input
                  name="productName"
                  className="user-profile-content-input"
                  value={formData.productName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form1">
                <label>Category:</label>
                <select
                  className="user-profile-content-input"
                  name="categoryId"
                  value={formData.categoryId || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select a Category</option>
                  <option value="1">Pets</option>
                  <option value="7">Farm Animals</option>
                </select>
              </div>

              <div className="form1">
                <label>SubCategory:</label>
                <select
                  className="user-profile-content-input"
                  name="subCategoryId"
                  value={formData.subCategoryId || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select a subcategory</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form1">
                <label>Breed :</label>
                <input
                  name="breed"
                  value={formData.breed || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                />
                {errors.breed && <p className="error">{errors.breed}</p>}
              </div>
              <div className="form1">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="error">{errors.gender}</p>}
              </div>

              <div className="form1">
                <label>Weight:</label>
                <input
                  name="weight"
                  value={formData.weight || ""}
                  onChange={handleInputChange}
                  className={`content-input ${errors.weight ? 'error' : ''}`}
                />
                {errors.weight && <p className="error">{errors.weight}</p>}
              </div>
              <div className="form1">
                <label>Color:</label>
                <input
                  name="color"
                  value={formData.color || ""}
                  onChange={handleInputChange}
                  className={`content-input ${errors.color ? 'error' : ''}`}
                />
                {errors.color && <p className="error">{errors.color}</p>}
              </div>

              <div className="form1">
                <label>Year:</label>
                <select
                  name="year"
                  value={formData.year || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                >
                  <option value="">Select Years</option>
                  {Array.from({ length: 100 }).map((_, year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                  {errors.year && <p className="error">{errors.year}</p>}
                </select>
              </div>

              <div className="form1">
                <label>Month:</label>
                <select
                  name="month"
                  value={formData.month || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                >
                  <option value="">Select Months</option>
                  {Array.from({ length: 12 }).map((_, month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                  {errors.month && <p className="error">{errors.month}</p>}
                </select>
              </div>

              <div className="form1">
                <label>Health Info:</label>
                <input
                  name="healthInfo"
                  value={formData.healthInfo || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                />
                {errors.healthInfo && <p className="error">{errors.healthInfo}</p>}
              </div>


              <div className="form1">
                <label>Stock Quantity:</label>
                <input
                  name="stockQuantity"
                  value={formData.stockQuantity || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                />
                {errors.stockQuantity && <p className="error">{errors.stockQuantity}</p>}
              </div>

              <div className="form1">
                <label>MinStock Level:</label>
                <input
                  name="minStockLevel"
                  value={formData.minStockLevel || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                />
                {errors.minStockLevel && <p className="error">{errors.minStockLevel}</p>}
              </div>


              <div className="form1">
                <label>Price Details:</label>
                <input
                  name="productPrice"
                  type='number'
                  value={formData.productPrice || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                />
                {errors.productPrice && <p className="error">{errors.productPrice}</p>}
              </div>
              <div className="form1">
                <label>Discount:</label>
                <input
                  name="discount"
                  value={formData.discount || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                />
                {errors.discount && <p className="error">{errors.discount}</p>}
              </div>


              <div className="form1">
                <label>Special Requirements:</label>
                <input
                  name="specialRequirements"
                  value={formData.specialRequirements || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                />
                {errors.specialRequirements && <p className="error">{errors.specialRequirements}</p>}
              </div>

              <div className="form1">
                <label>Return Within:</label>
                <input
                  name="returnWithin"
                  value={formData.returnWithin || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                />
                {errors.returnWithin && <p className="error">{errors.returnWithin}</p>}
              </div>

              <div className="form1">
                <label>Video Url:</label>
                <input
                  name="videoUrl"
                  value={formData.videoUrl || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                />
                {errors.videoUrl && <p className="error">{errors.videoUrl}</p>}
              </div>
              <div className="form1">
                <label>Care Instructions:</label>
                <textarea
                  name="careInstructions"
                  rows={2}
                  value={formData.careInstructions || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                />
                {errors.careInstructions && <p className="error">{errors.careInstructions}</p>}
              </div>
              <div className="form1">
                <label>About:</label>
                <textarea
                  name="about"
                  rows={2}
                  value={formData.about || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                />
                {errors.about && <p className="error">{errors.about}</p>}
              </div>
              <div className="form1">
                <label>BarCode:</label>
                <input
                  name="barCode"
                  value={formData.barCode || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                />
                {errors.barCode && <p className="error">{errors.barCode}</p>}
              </div>
            </div>
          </div>
          <div className="user-data-1">
            <div className="form-2">
              <div className="form1">
                <label>Select Image</label>
                <div className="image-upload">
                  <input
                    type="file"
                    className="content-input-img"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
                <div className="input-box w-100 image-preview-container">
                  {imageFile && (
                    <div className="image-preview">
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        style={{ width: "150px", height: "100px", marginTop: "10px" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="form1">
                <label>
                  Position:<span className="error">*</span>
                </label>
                <select
                  id="positions"
                  value={selectedPosition || ""}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="content-input"
                >
                  <option value="">-- Select --</option>
                  {positions && productImageLists
                    ? positions
                      .filter(position => !productImageLists.some(image => image.positionId === position.id))
                      .map((position) => (
                        <option key={position.id} value={position.id}>
                          {position.name}
                        </option>
                      ))
                    : <option value="">Loading positions...</option>
                  }
                </select>

              </div>
              {productImageList.length > 0 ? (
                <div className="product-image-list">
                  <h3>Recent Add Images:</h3>
                  <div className="image-list">
                    {productImageList.map((image, index) => (
                      <div key={index} className="image-item">
                        <img
                          src={URL.createObjectURL(image.file)}
                          alt={`Position ${image.position}`}
                          style={{ width: "150px", height: "100px", marginTop: "10px" }}
                        />
                        <MdDeleteForever
                          className="delete-icon"
                          style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
                          onClick={() => handleRemoveImage(index)}
                        />
                        <p>
                          Position:{" "}
                          {positions.find(
                            (pos) => pos.id === parseInt(image.position)
                          )?.name || "Unknown"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {productImageLists.length > 0 ? (
                <div className="product-image-list-1">
                  <h3>Old Images:</h3>
                  <div className="image-list">
                    {productImageLists.map((image, index) => (
                      <div key={index} className="image-item">
                        <img
                          src={image.imageUrl}
                          alt={`Position ${image.positionId}`}
                          style={{ width: "150px", height: "100px", marginTop: "10px" }}
                        />
                        <MdDeleteForever
                          className="delete-icon"
                          style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
                          onClick={() => handleDeleteImage(image.productId, image.positionId)}
                        />
                        <p>Position: {positions.find(pos => pos.id === parseInt(image.positionId))?.name || 'Unknown'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="edit-head">
              <div className="edit-btn">
                <span className="update-btn" onClick={handleAdd}>
                  Add
                </span>
              </div>
            </div>

            <div className="btn-container">
              <div className="alert-msg">
                <p className="error">*</p> is mandatory.
              </div>
              <div className='content-btn'>
                <button type="button" className="cancel-btn" onClick={navigateToAddPets}>
                  Cancel
                </button>
                <button type="button" className="update-btn" onClick={handleSubmit}>
                  {formData.id ? 'Update' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetAdd;
