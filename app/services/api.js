"use client";

import axios from 'axios';
console.log(process.env.NEXT_PUBLIC_API_BASE_URL);


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const multipartApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});



// Category ///


export const fetchCategories = async () => {
  try {
    const response = await api.get("/api/public/category/getAll");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data || error.message);
    throw new Error("Failed to fetch categories.");
  }
};


// SubCategory ///

export const fetchSubCategories = async () => {
  try {
    const response = await api.get("/api/public/subCategory/getAll");
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error.response?.data || error.message);
    throw new Error("Failed to fetch subcategories.");
  }
};



// User Controll ///


export const getUserById = async (id) => {
  try {
    const response = await api.get(`/api/public/user/getOne/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/api/public/user/update/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.response?.data || error.message);
    throw error;
  }
};





/// Blog Controll /// 


export const addBlog = async (blogData) => {
  try {
    const response = await api.post('/api/public/blog/add', blogData);
    return response.data;
  } catch (error) {
    console.error('Error adding blog:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await api.delete(`/api/public/blog/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blog with id ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const getAllBlogs = async () => {
  try {
    const response = await api.get('/api/public/blog/getAll');
    return response.data;
  } catch (error) {
    console.error('Error fetching all blogs:', error.response?.data || error.message);
    throw error;
  }
};

export const getBlogsByLastThreeDays = async () => {
  try {
    const response = await api.get('/api/public/blog/getByDate/LastThreeDate');
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs by last three days:', error.response?.data || error.message);
    throw error;
  }
};

export const getBlogById = async (id) => {
  try {
    const response = await api.get(`/api/public/blog/getOne/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with id ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const updateBlog = async (id, updatedData) => {
  try {
    const response = await api.put(`/api/public/blog/update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating blog with id ${id}:`, error.response?.data || error.message);
    throw error;
  }
};


//  Card Controll ///

export const getAllCartItems = async (userId) => {
  try {
    const response = await api.get(`/cart/getAll`, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error.response?.data || error.message);
    throw error;
  }
};



