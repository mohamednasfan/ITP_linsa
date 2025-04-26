import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../AdminDashBord/SideBar/Sidebar";

const AddProduct = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    image: "",
    location: "",
    price: "",
    code: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/products/", inputs);
      setLoading(false);
      alert("Product added successfully.");
      navigate("/admin-allproducts");
    } catch (error) {
      console.error("Error submitting product:", error);
      setError("Error submitting product. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading_spinner">
        <div className="spinner"></div>
        <p className="loading_text">Adding product...</p>
      </div>
    );
  }

  return (
    <div>
      <Sidebar />
      <div className="children_div_admin">
        <h1 className="topic_mash_mart">
          Add New<span className="sub_topic_mash_mart"> Product</span>
        </h1>
        
        <div className="item_full_box">
          <form className="item_form_admin" onSubmit={handleSubmit}>
            <h2 className="form_title">Product Information</h2>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="name"
                id="name"
                value={inputs.name}
                onChange={handleChange}
                required
                placeholder="Product Name"
              />
              <label className="form_box_item_lable" htmlFor="name">Product Name</label>
            </div>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="image"
                id="image"
                value={inputs.image}
                onChange={handleChange}
                required
                placeholder="Image URL"
              />
              <label className="form_box_item_lable" htmlFor="image">Image URL</label>
            </div>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="location"
                id="location"
                value={inputs.location}
                onChange={handleChange}
                required
                placeholder="Location"
              />
              <label className="form_box_item_lable" htmlFor="location">Location</label>
            </div>
            
            <div className="form_row">
              <div className="form_group">
                <input
                  className="form_box_item_input"
                  type="number"
                  name="price"
                  id="price"
                  min="1"
                  value={inputs.price}
                  onChange={handleChange}
                  required
                  placeholder="Price"
                />
                <label className="form_box_item_lable" htmlFor="price">Price</label>
              </div>
              
              <div className="form_group">
                <input
                  className="form_box_item_input"
                  type="text"
                  name="code"
                  id="code"
                  value={inputs.code}
                  onChange={handleChange}
                  required
                  placeholder="Product Code"
                />
                <label className="form_box_item_lable" htmlFor="code">Product Code</label>
              </div>
            </div>
            
            {error && <div className="product-error-message">{error}</div>}
            
            <button type="submit" className="admin_form_cneter_btn">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
