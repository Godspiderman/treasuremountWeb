"use client";

import { useState, useEffect } from 'react';
import './ProductDetail.scss';
import { API_URL } from '@/app/services/useAxiosInstance';


const ProductDetail = () => {
    const [product, setProduct] = useState(null); // For product details
    const [images, setImages] = useState([]); // For product images
    const [mainImage, setMainImage] = useState(''); // For main image
    const [quantity, setQuantity] = useState(1);
    
    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productResponse = await fetch(`${API_URL}/api/public/resource/pet/getOne/18`);
                const productData = await productResponse.json();
                setProduct(productData);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        const fetchImages = async () => {
            try {
                const imagesResponse = await fetch(`${API_URL}/api/public/productImages/getByProductId/18`);
                const imagesData = await imagesResponse.json();
                setImages(imagesData);
                if (imagesData.length > 0) {
                    setMainImage(imagesData[0].imageUrls); // Set the first image as default
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchProduct();
        fetchImages();
    }, []);

    // Handle click on thumbnail to change main image
    const handleImageClick = (imageUrl) => {
        setMainImage(imageUrl);
    };

    // Handle quantity increment/decrement
    const handleQuantityChange = (type) => {
        if (type === 'increment') {
            setQuantity((prev) => prev + 1);
        } else if (type === 'decrement' && quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    // Handle "Add to Cart" button
    const handleAddToCart = () => {
        console.log('Added to Cart:', {
            productId: product?.id,
            quantity,
        });
        alert(`Added ${quantity} item(s) to your cart.`);
    };

    // Handle "Buy Now" button
    const handleBuyNow = () => {
        console.log('Buy Now:', {
            productId: product?.id,
            quantity,
        });
        alert(`Proceeding to checkout with ${quantity} item(s).`);
        // Add logic to navigate to the checkout page or payment flow
    };
    return (
        <>
            <div className="product-detail">
                <div className="product-detail-container">

                    <div className="product-detail-content1">
                        <div className="product-images">
                            <div className="product-main-image">
                                <img src={mainImage} alt="Main Product" />
                            </div>
                            <div className="image-thumbnails">
                                {images.map((img) => (
                                    <div
                                        key={img.id}
                                        className="thumbnail"
                                        onClick={() => handleImageClick(img.imageUrls)}
                                    >
                                        <img src={img.imageUrls} alt={`Thumbnail ${img.id}`} />
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>


                    {/* Product Details Section */}
                    <div className="product-detail-content2">
                        <div className="product-header">
                            <h1>{product?.productName}</h1>
                            <h2>Breed: {product?.breed}</h2>
                        </div>
                        <div className="product-meta">
                            <h3>Gender: {product?.gender}</h3>
                            <h3>Age: {product?.ageMonths} months</h3>
                            <h3>Color: {product?.color}</h3>
                            <h3>Weight: {product?.weight} kg</h3>
                        </div>
                        <div className="rating">
                            <span>4.0</span> <span>20 Reviews</span>
                        </div>
                        <div className="product-price">
                            <h2 className="original-price">
                                ₹ {product?.productPrice}
                            </h2>
                            {product?.discount > 0 && (
                                <>
                                    <h2 className="discounted-price">
                                        ₹ {(product?.productPrice - (product?.productPrice * product?.discount) / 100).toFixed(2)}
                                    </h2>
                                    <h4>Discount: {product?.discount}%</h4>
                                </>
                            )}
                        </div>


                        <div className="product-quantity">
                            <h3>Quantity:</h3>
                            <div className="quantity-controls">
                                <button onClick={() => handleQuantityChange('decrement')} disabled={quantity <= 1}>
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button onClick={() => handleQuantityChange('increment')}>+</button>
                            </div>
                        </div>
                        <div className="product-buttons">
                            <button className="add-to-cart" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                            <button className="buy-now" onClick={handleBuyNow}>
                                Buy Now
                            </button>
                        </div>
                    </div>


                    <div className="product-detail-content3">
                        <div className="product-description">
                            <h3>About:</h3>
                            <p>{product?.about || 'No description available.'}</p>
                            <h3>Health Info:</h3>
                            <p>{product?.healthInfo || 'Not specified.'}</p>
                            <h3>Care Instructions:</h3>
                            <p>{product?.careInstructions || 'Not specified.'}</p>
                            <h3>Special Requirements:</h3>
                            <p>{product?.specialRequirements || 'None.'}</p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ProductDetail;
