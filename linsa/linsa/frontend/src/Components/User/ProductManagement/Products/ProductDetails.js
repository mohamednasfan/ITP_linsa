import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AfterNav from "../../Home/NavBar/AfterNav";
import "./Stock.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/products/${id}`
        );
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) {
      console.error("Product details are undefined.");
      return;
    }
    setCartMessage("Item added to cart.");
    navigate("/add-cart", { state: { product } });
  };

  if (!product) {
    return <div className="loading">Loading...</div>;
  }

  const { name, image, location, price, code } = product;

  return (
    <div>
      <AfterNav />
      <div className="product-details-container advanced-layout">
        <h1 className="product-details-title">
          Product <span>Details</span>
        </h1>
        <div className="product-card advanced-card large-card">
          <div className="product-image-container">
            <img src={image} alt={name} className="product-image" />
          </div>
          <div className="product-info">
            <h2 className="product-name">{name}</h2>
            <p className="product-detail">
              <strong>Location:</strong> {location}
            </p>
            <p className="product-detail">
              <strong>Price:</strong> ${price}
            </p>
            <p className="product-detail">
              <strong>Code:</strong> {code}
            </p>
            <div className="product-actions">
              <button className="btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button
                className="btn-secondary"
                onClick={() => (window.location.href = "/addrate")}
              >
                Add Feedback
              </button>
            </div>
            {cartMessage && <div className="cart-message">{cartMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
