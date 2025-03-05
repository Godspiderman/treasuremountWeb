"use client";

import React, { useEffect, useState } from "react";
import './PetAdd.scss';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { MdDeleteForever } from 'react-icons/md';
import { useRouter, useSearchParams } from "next/navigation";
import { startLoading, stopLoading } from "@/app/redux/slices/loadingSlice";
import { API_URL } from "@/app/services/useAxiosInstance";

function PetAdd({ id , onNavigate }) {
  
  const dispatch = useDispatch();
  // const searchParams = useSearchParams();
  // const id = searchParams.get("id");
  console.log(id);
  const router = useRouter();
  const isAddPet = id === null || id <= 0;

  const [subCategories, setSubCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const authState = useSelector((state) => state.auth);
  const userId = authState?.user?.userId;

  const [productImageList, setProductImageList] = useState([]);
  const [productImageLists, setProductImageLists] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [positions, setPositions] = useState([]);

  const handleGoBack = () => {
    setFormData({});
    onNavigate('add-pets'); 
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      dispatch(startLoading());
      try {
        const response = await fetch(`${API_URL}/api/public/resource/pet/getOne/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch pet data: ${response.status}`);
        }
        const data = await response.json();
        setFormData(data);
        console.log(data);
        dispatch(stopLoading());
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



  const defaultFormData = {
    id: 0,
    productId: 0,
    productName: '',
    productImageUrl: '',
    productPrice: null,
    stockQuantity: null,
    activeStatus: true,
    returnWithin: 0,
    productCreatedDate: new Date().toISOString(),
    productUpdatedDate: new Date().toISOString(),
    discount: null,
    minStockLevel: null,
    videoUrl: '',
    barCode: '',
    breed: '',
    month: null,
    year: null,
    gender: '',
    color: '',
    weight: null,
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
    productStatusId: 1,
    userId: userId,
    categoryId: 0,
  };

  const [formData, setFormData] = useState(defaultFormData);



useEffect(() => {
  if (formData.categoryId) {
    fetchSubCategories(formData.categoryId);
  }
}, [formData.categoryId]);


  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/public/subCategory/getAllSubCategory/${categoryId}`
      );
      const data = await response.json();
      setSubCategories(data);
      console.log("setSubCategories:", data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Update the form data
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  
    if (value && errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
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

    } catch (error) {
      console.error("Error during upload process:", error);
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
    } yh
  };


  const validateForm = () => {
    const formErrors = {};

    if (!formData.subCategoryId) formErrors.subCategoryId = "Sub Category is required";
    if (!(formData.productName || "").trim()) formErrors.productName = "Product Name is required";

    if (!formData.productPrice) {
      formErrors.productPrice = "Price is required.";
    } else if (isNaN(formData.productPrice) || formData.productPrice <= 0 || formData.productPrice > 1000000) {
      formErrors.productPrice = "Price must be a number between 0 and 1,000,000.";
    }

    if (!formData.stockQuantity) {
      formErrors.stockQuantity = "Stock Quantity is required.";
    } else if (isNaN(formData.stockQuantity) || formData.stockQuantity < 0) {
      formErrors.stockQuantity = "Stock Quantity must be a number greater than or equal to 0.";
    }

    if (!formData.minStockLevel) {
      formErrors.minStockLevel = "Minimum Stock Level is required.";
    } else if (isNaN(formData.minStockLevel) || formData.minStockLevel < 0) {
      formErrors.minStockLevel = "Minimum Stock Level must be a number greater than or equal to 0.";
    }

    if (!formData.discount && formData.discount !== 0) {
      formErrors.discount = "Discount is required.";
    } else if (isNaN(formData.discount) || formData.discount < 0 || formData.discount > 100) {
      formErrors.discount = "Discount must be a number between 0 and 100.";
    }

    if (!formData.returnWithin) {
      formErrors.returnWithin = "Return Within Level is required.";
    } else if (isNaN(formData.returnWithin) || formData.returnWithin <= 0) {
      formErrors.returnWithin = "Return Within must be a positive number.";
    }

    if (!formData.videoUrl) {
      formErrors.videoUrl = "Video Url is required.";
    }
    else {
      try {
        new URL(formData.videoUrl); 
      } catch (_) {
        formErrors.videoUrl = "Invalid video URL format.";
      }
    }

    if (!formData.barCode) {
      formErrors.barCode = "Code is required.";
    } else if (isNaN(formData.barCode || formData.barCode <= 0)) {
      formErrors.barCode = "Code must be a positive number.";
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

    if (!formData.discount && formData.discount !== 0) {
      formErrors.discount = "Discount is required.";
    } else if (isNaN(formData.discount) || formData.discount < 0 || formData.discount > 100) {
      formErrors.discount = "Discount must be a number between 0 and 100.";
    }

    if (!formData.month) {
      formErrors.month = "Age (Month) is required.";
    }

    if (!formData.healthInfo || !formData.healthInfo.trim()) {
      formErrors.healthInfo = "Health Info is required.";
    } else if (formData.healthInfo.length > 100) {
      formErrors.healthInfo = "Health Info must not exceed 100 characters.";
    }

    if (!formData.specialRequirements || !formData.specialRequirements.trim()) {
      formErrors.specialRequirements = "Special Requirements are required.";
    } else if (formData.specialRequirements.length > 100) {
      formErrors.specialRequirements = "Special Requirements must not exceed 100 characters.";
    }

    if (!formData.careInstructions) {
      formErrors.careInstructions = "Care Instructions are required.";
    } else if (formData.careInstructions.length > 500) {
      formErrors.careInstructions = "Care Instructions must not exceed 500 characters.";
    }

    if (!formData.about) {
      formErrors.about = "About is required.";
    } else if (formData.about.length > 500) {
      formErrors.about = "About must not exceed 500 characters.";
    }

    setErrors(formErrors);
    return formErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      return;
    }

    dispatch(startLoading());
    const dataToSend = {
      id: formData.id === 0 ? undefined : parseInt(formData.id),
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

    try {
      const url =
        formData.id === 0
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("Operation successful:", responseData);

      if (responseData.productId) {
        await handleProductImageUpload(responseData.productId);
        console.log("Product image upload successful");
      }

      setFormData({});
      dispatch(stopLoading());
      handleGoBack();
    } catch (error) {
      console.error("Error submitting form:", error.message || error.response?.data);
      dispatch(stopLoading());
    }
  };


  return (
    <div className="Pet-add">
      <div className="Pet-add-container box-shadow">
        <div className="Pet-add-contents">
          <div className="Pet-add-head">
              <h2>{isAddPet ? "Add Pet" : "Edit Pet"}</h2>
          </div>
          <div className="user-data-1">
            <div className="form-2">
              <div className="form1">
                <label>Name <span className="error">*</span></label>
                <input
                  name="productName"
                  className={`user-profile-content-input ${errors.productName ? 'errors' : ''}`}
                  value={formData.productName || ""}
                  maxLength={100}
                  onChange={handleInputChange}
                />
                {errors.productName && <span className="errors">{errors.productName}</span>}
              </div>

              <div className="form1">
                <label>Category <span className="error">*</span></label>
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
                <label>SubCategory <span className="error">*</span></label>
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
                {errors.subCategoryId && <span className="errors">{errors.subCategoryId}</span>}
              </div>
              <div className="form1">
                <label>Breed <span className="error">*</span></label>
                <input
                  name="breed"
                  value={formData.breed || ""}
                  onChange={handleInputChange}
                  maxLength={50}
                  className="user-profile-content-input"
                />
                {errors.breed && <span className="errors">{errors.breed}</span>}
              </div>
              <div className="form1">
                <label>Gender <span className="error">*</span></label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange}
                  className="user-profile-content-input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="errors">{errors.gender}</span>}
              </div>

              <div className="form1">
                <label>Weight <span className="error">*</span></label>
                <input
                  name="weight"
                  value={formData.weight || ""}
                  onChange={handleInputChange}
                  maxLength={3}
                  className={`content-input ${errors.weight ? 'error' : ''}`}
                />
                {errors.weight && <span className="errors">{errors.weight}</span>}
              </div>
              <div className="form1">
                <label>Color <span className="error">*</span></label>
                <input
                  name="color"
                  value={formData.color || ""}
                  onChange={handleInputChange}
                  maxLength={50}
                  className={`content-input ${errors.color ? 'error' : ''}`}
                />
                {errors.color && <span className="errors">{errors.color}</span>}
              </div>

              <div className="form1">
                <label>Year <span className="error">*</span></label>
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
                </select>

                {errors.year && <span className="errors">{errors.year}</span>}
              </div>

              <div className="form1">
                <label>Month <span className="error">*</span></label>
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
                </select>
                {errors.month && <p className="errors">{errors.month}</p>}
              </div>

              <div className="form1">
                <label>Health Info <span className="error">*</span></label>
                <input
                  name="healthInfo"
                  value={formData.healthInfo || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                  className="user-profile-content-input"
                />
                {errors.healthInfo && <p className="errors">{errors.healthInfo}</p>}
              </div>


              <div className="form1">
                <label>Stock Quantity <span className="error">*</span></label>
                <input
                  name="stockQuantity"
                  value={formData.stockQuantity || ""}
                  onChange={handleInputChange}
                  maxLength={3}
                  className="user-profile-content-input"
                />
                {errors.stockQuantity && <p className="errors">{errors.stockQuantity}</p>}
              </div>

              <div className="form1">
                <label>MinStock Level <span className="error">*</span></label>
                <input
                  name="minStockLevel"
                  value={formData.minStockLevel || ""}
                  onChange={handleInputChange}
                  maxLength={3}
                  className="user-profile-content-input"
                />
                {errors.minStockLevel && <p className="errors">{errors.minStockLevel}</p>}
              </div>


              <div className="form1">
                <label>Price Details <span className="error">*</span></label>
                <input
                  name="productPrice"
                  type='number'
                  value={formData.productPrice || ""}
                  onChange={handleInputChange}
                  maxLength={50}
                  className="user-profile-content-input"
                />
                {errors.productPrice && <p className="errors">{errors.productPrice}</p>}
              </div>
              <div className="form1">
                <label>Discount Percentage:</label>
                <input
                  name="discount"
                  value={formData.discount || ""}
                  onChange={handleInputChange}
                  maxLength={3}
                  className="user-profile-content-input"
                />
                {errors.discount && <p className="errors">{errors.discount}</p>}
              </div>


              <div className="form1">
                <label>Special Requirements <span className="error">*</span></label>
                <input
                  name="specialRequirements"
                  value={formData.specialRequirements || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                  className="user-profile-content-input"
                />
                {errors.specialRequirements && <p className="errors">{errors.specialRequirements}</p>}
              </div>

              <div className="form1">
                <label>Return Within (Days) <span className="error">*</span></label>
                <input
                  name="returnWithin"
                  value={formData.returnWithin || ""}
                  onChange={handleInputChange}
                  maxLength={3}
                  className="user-profile-content-input"
                />
                {errors.returnWithin && <p className="errors">{errors.returnWithin}</p>}
              </div>

              <div className="form1">
                <label>Video Url:</label>
                <input
                  name="videoUrl"
                  value={formData.videoUrl || ""}
                  onChange={handleInputChange}
                  maxLength={300}
                  className="user-profile-content-input"
                />
                {errors.videoUrl && <p className="errors">{errors.videoUrl}</p>}
              </div>
              <div className="form1">
                <label>Code:</label>
                <input
                  name="barCode"
                  value={formData.barCode || ""}
                  onChange={handleInputChange}
                  maxLength={50}
                  className="user-profile-content-input"
                />
                {errors.barCode && <p className="errors">{errors.barCode}</p>}
              </div>
              <div className="form1">
                <label>Care Instructions <span className="error">*</span></label>
                <textarea
                  name="careInstructions"
                  rows={2}
                  value={formData.careInstructions || ""}
                  onChange={handleInputChange}
                  maxLength={500}
                  className="user-profile-content-input"
                />
                {errors.careInstructions && <p className="errors">{errors.careInstructions}</p>}
              </div>
              <div className="form1">
                <label>About <span className="error">*</span></label>
                <textarea
                  name="about"
                  rows={2}
                  value={formData.about || ""}
                  onChange={handleInputChange}
                  maxLength={500}
                  className="user-profile-content-input"
                />
                {errors.about && <p className="errors">{errors.about}</p>}
              </div>
            </div>
          </div>
          <div className="user-data-1">
            <div className="form-2">
              <div className="form1">
                <label>Select Image <span className="error">*</span></label>
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
                <button type="button" className="cancel-btn" onClick={handleGoBack}>
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
