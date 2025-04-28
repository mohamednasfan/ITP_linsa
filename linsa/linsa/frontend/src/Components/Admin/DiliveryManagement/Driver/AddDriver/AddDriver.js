import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Sidebar from "../../../AdminDashBord/SideBar/Sidebar";

function AddDriver() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    gmail: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/drive", inputs);
      setLoading(false);
      alert("Driver Account Created successfully!");
      navigate("/driverdetails");
    } catch (error) {
      console.error("Error submitting driver:", error);
      setError("Error submitting driver. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading_spinner">
        <div className="spinner"></div>
        <p className="loading_text">Creating driver account...</p>
      </div>
    );
  }

  return (
    <div>
      <Sidebar />
      <div className="children_div_admin">
        <h1 className="topic_mash_mart">
          Create Account For<span className="sub_topic_mash_mart"> Driver</span>
        </h1>
        
        <div className="item_full_box">
          <form className="item_form_admin" onSubmit={handleSubmit}>
            <h2 className="form_title">Driver Information</h2>
            
            <div className="form_group">
              <label className="form_box_item_lable" htmlFor="name">Driver Name</label>
              <input
                className="form_box_item_input"
                type="text"
                name="name"
                id="name"
                value={inputs.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form_group">
              <label className="form_box_item_lable" htmlFor="gmail">Email</label>
              <input
                className="form_box_item_input"
                type="email"
                name="gmail"
                id="gmail"
                value={inputs.gmail}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form_group">
              <label className="form_box_item_lable" htmlFor="phone">Phone Number</label>
              <input
                className="form_box_item_input"
                type="text"
                name="phone"
                id="phone"
                pattern="[0-9]{10}"
                value={inputs.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form_group">
              <label className="form_box_item_lable" htmlFor="address">Address</label>
              <input
                className="form_box_item_input"
                type="text"
                name="address"
                id="address"
                value={inputs.address}
                onChange={handleChange}
                required
              />
            </div>
            
            {error && <div className="driver-error-message">{error}</div>}
            
            <button type="submit" className="admin_form_cneter_btn">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDriver;
