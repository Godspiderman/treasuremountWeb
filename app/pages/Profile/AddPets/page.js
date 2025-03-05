"use client";

import React, { useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import './AddPet.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import { CiSquareInfo } from 'react-icons/ci';
import Pagination from '@/app/utils/Pagenation/Pagenation';
import { startLoading, stopLoading } from '@/app/redux/slices/loadingSlice';
import { API_URL } from '@/app/services/useAxiosInstance';

function AddPet({ onNavigate }) {

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
   const userId = useSelector((state) => state.auth?.user?.userId || null);
  
  const router = useRouter(); // Correct placement after component is mounted

  const fetchProducts = async () => {
    try {
      dispatch(startLoading());
      const params = new URLSearchParams({
        userId: userId,
        categoryId: 0,
        subCategoryId: 0,
        minPrice: 0,
        maxPrice: 0,
        ProductStatusId: 0,
        isAdmin: true,
      }).toString();

      const response = await fetch(`${API_URL}/api/public/product/getAll?${params}`);
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data || []);
      console.log(data);

    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );



const handleAddPet = (id) => {
    onNavigate('pet-add', id); // Navigate to pet-add and pass the pet ID
  };
  return (
    <div className='AddPet-page'>
      <div className='AddPet-container box-shadow'>
        <div className='AddPet-head p-15'>
          <h2>Pets</h2>
          <div className="btns">
            <span onClick={() => onNavigate('pet-add')} style={{ cursor: 'pointer' }}>
              <FaPlus /> Add Pets
            </span>
  
          </div>
        </div>
        <div className="table-filters">
          <div className="search-filter">
            <label htmlFor="searchName">
              <FaSearch />
            </label>
            <input
              type="text"
              id="searchName"
              placeholder="Search Products..."
              value={searchQuery || ''} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="AddPet-content">
          <div className="AddPet-content1" style={{ overflowX: "auto" }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Sub Category</th>
                  <th>Price</th>
                  <th>Product Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center">Loading...</td>
                  </tr>
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product, index) => (
                    <tr key={index}>
                      <td className='text-left'>{product.productName}</td>
                      <td className='text-left'>{product.subCategoryName}</td>
                      <td className='text-right'>₹ {product.price.toFixed(2)}</td>
                      <td className='text-center'>
                        <p className={
                          product.productStatusId === 2 ? 'status-confirmed' :
                            product.productStatusId === 1 ? 'status-pending' :
                              product.productStatusId === 3 ? 'status-rejected' :
                                product.productStatusId === 4 ? 'status-disable' :
                                  product.productStatusId === 5 ? 'status-outofstock' :
                                    product.productStatusId === 6 ? 'status-restock' :
                                      product.productStatusId === 7 ? 'status-available' :
                                        ''
                        }>
                          {product.productStatusId === 2 ? 'Approved' :
                            product.productStatusId === 1 ? 'Pending' :
                              product.productStatusId === 3 ? 'Reject' :
                                product.productStatusId === 4 ? 'Disable' :
                                  product.productStatusId === 5 ? 'Out of Stock' :
                                    product.productStatusId === 6 ? 'Restock' :
                                      product.productStatusId === 7 ? 'Available' :

                                        ''}
                        </p>
                      </td>

                      <td className="icons text-center">
                        <CiEdit
                          title="Edit"
                          onClick={() => handleAddPet(product.id)}
                        />

                        {/* <CiSquareInfo title="Approve" onClick={() => openApprovalModal(product.id)} /> */}


                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No Pets available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default AddPet;
