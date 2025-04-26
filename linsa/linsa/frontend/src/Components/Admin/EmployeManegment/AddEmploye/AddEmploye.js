import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Sidebar from "../../AdminDashBord/SideBar/Sidebar";

function AddEmploye() {
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
      await axios.post("http://localhost:5000/employee", inputs);
      setLoading(false);
      alert("Employee Account Created successfully!");
      navigate("/employeedetails");
    } catch (error) {
      console.error("Error submitting employee:", error);
      setError("Error submitting employee. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading_spinner">
        <div className="spinner"></div>
        <p className="loading_text">Creating employee account...</p>
      </div>
    );
  }

  return (
    <div>
      <Sidebar />
      <div className="children_div_admin">
        <h1 className="topic_mash_mart">
          Create Account For<span className="sub_topic_mash_mart"> Employee</span>
        </h1>
        
        <div className="item_full_box">
          <form className="item_form_admin" onSubmit={handleSubmit}>
            <h2 className="form_title">Employee Information</h2>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="name"
                id="name"
                value={inputs.name}
                onChange={handleChange}
                required
                placeholder="Employee Name"
              />
              <label className="form_box_item_lable" htmlFor="name">Employee Name</label>
            </div>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="email"
                name="gmail"
                id="gmail"
                value={inputs.gmail}
                onChange={handleChange}
                required
                placeholder="Email"
              />
              <label className="form_box_item_lable" htmlFor="gmail">Email</label>
            </div>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="phone"
                id="phone"
                pattern="[0-9]{10}"
                value={inputs.phone}
                onChange={handleChange}
                required
                placeholder="Phone Number"
              />
              <label className="form_box_item_lable" htmlFor="phone">Phone Number</label>
            </div>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="address"
                id="address"
                value={inputs.address}
                onChange={handleChange}
                required
                placeholder="Address"
              />
              <label className="form_box_item_lable" htmlFor="address">Address</label>
            </div>
            
            {error && <div className="employee-error-message">{error}</div>}
            
            <button type="submit" className="admin_form_cneter_btn">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEmploye;
