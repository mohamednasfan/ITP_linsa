import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../AdminDashBord/SideBar/Sidebar";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/products/${id}`
        );
        setProduct(response.data.product);
        setLoading(false);
      } catch (error) {
        setError("Error fetching product details.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/products/${id}`, product);
      alert("Product updated successfully.");
      navigate("/admin-allproducts");
    } catch (error) {
      setError("Error updating product.");
    }
  };

  if (loading) {
    return (
      <div className="loading_spinner">
        <div className="spinner"></div>
        <p className="loading_text">Loading product data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="children_div_admin">
        <div className="product-error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar />
      <div className="children_div_admin">
        <h1 className="topic_mash_mart">
          Update<span className="sub_topic_mash_mart"> Product</span>
        </h1>
        
        <div className="item_full_box">
          <form className="item_form_admin" onSubmit={handleSubmit}>
            <h2 className="form_title">Edit Product Details</h2>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                id="name"
                value={product.name || ""}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                placeholder="Product Name"
                required
              />
              <label className="form_box_item_lable" htmlFor="name">Product Name</label>
            </div>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                id="image"
                value={product.image || ""}
                onChange={(e) =>
                  setProduct({ ...product, image: e.target.value })
                }
                placeholder="Image URL"
                required
              />
              <label className="form_box_item_lable" htmlFor="image">Image URL</label>
            </div>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                id="location"
                value={product.location || ""}
                onChange={(e) =>
                  setProduct({ ...product, location: e.target.value })
                }
                placeholder="Location"
                required
              />
              <label className="form_box_item_lable" htmlFor="location">Location</label>
            </div>
            
            <div className="form_row">
              <div className="form_group">
                <input
                  className="form_box_item_input"
                  type="number"
                  id="price"
                  min="1"
                  value={product.price || ""}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                  placeholder="Price"
                  required
                />
                <label className="form_box_item_lable" htmlFor="price">Price</label>
              </div>
              
              <div className="form_group">
                <input
                  className="form_box_item_input"
                  type="text"
                  id="code"
                  value={product.code || ""}
                  onChange={(e) =>
                    setProduct({ ...product, code: e.target.value })
                  }
                  placeholder="Product Code"
                  required
                />
                <label className="form_box_item_lable" htmlFor="code">Product Code</label>
              </div>
            </div>
            
            <button type="submit" className="admin_form_cneter_btn">
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
