import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import AfterNav from "../../Home/NavBar/AfterNav";
import './AddDelivery.css';

function AddDelivery() {
  const navigate = useNavigate();
  
  // Define province and district data
  const provinceDistrictMap = {
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Eastern Province": ["Ampara", "Batticaloa", "Trincomalee"],
    "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "Sabaragamuwa Province": ["Kegalle", "Ratnapura"],
    "Southern Province": ["Galle", "Hambantota", "Matara"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Western Province": ["Colombo", "Gampaha", "Kalutara"]
  };

  const allProvinces = Object.keys(provinceDistrictMap);

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone: "",
    province: "",
    district: "",
    city: "",
    streetAddress: "",
    postalCode: "",
    deliveryTimeSlot: ""
  });

  const [availableDistricts, setAvailableDistricts] = useState([]);

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post("http://localhost:5000/profile", {
          token: token,
        });
        if (response.data.status === "ok" && response.data.user) {
          const userData = response.data.user;
          setInputs(prev => ({
            ...prev,
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || ""
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Update available districts when province changes
  useEffect(() => {
    if (inputs.province) {
      setAvailableDistricts(provinceDistrictMap[inputs.province] || []);
      // Reset district when province changes
      setInputs(prev => ({...prev, district: ""}));
    } else {
      setAvailableDistricts([]);
    }
  }, [inputs.province]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    await sendRequest();
    window.alert("Submit successfully!");
    navigate("/myorder");
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:5000/deliveri", {
      name: inputs.name,
      email: inputs.email,
      phone: inputs.phone,
      province: inputs.province,
      district: inputs.district,
      city: inputs.city,
      streetAddress: inputs.streetAddress,
      postalCode: inputs.postalCode,
      deliveryTimeSlot: inputs.deliveryTimeSlot
    });
  };

  return (
    <div>
      <AfterNav />
      <div className="container with-bg" >
        <h1 className="main-title">
          Delivery <span className="title-accent">Form</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="form-container">
            {/* Left Column */}
            <div className="form-column left-column">
              <div className="form-section">
                <h2 className="section-title">Personal Information</h2>
                
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    required
                    value={inputs.name}
                    onChange={handleChange}
                    name="name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    pattern="[0-9]{10}" 
                    value={inputs.phone}
                    onChange={handleChange}
                    name="phone"
                    required
                    placeholder="E.g., 0771234567"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={inputs.email}
                    onChange={handleChange}
                    name="email"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Delivery Details</h2>
                
                <div className="form-group">
                  <label>Preferred Delivery Time Slot</label>
                  
                  <div className="time-slot-options">
                    <div className="time-slot-option">
                      <input
                        type="radio"
                        id="morning"
                        name="deliveryTimeSlot"
                        value="Morning (9 AM – 12 PM)"
                        checked={inputs.deliveryTimeSlot === "Morning (9 AM – 12 PM)"}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="morning">9 AM – 12 PM</label>
                    </div>
                    
                    <div className="time-slot-option">
                      <input
                        type="radio"
                        id="afternoon"
                        name="deliveryTimeSlot"
                        value="Afternoon (12 PM – 3 PM)"
                        checked={inputs.deliveryTimeSlot === "Afternoon (12 PM – 3 PM)"}
                        onChange={handleChange}
                      />
                      <label htmlFor="afternoon">12 PM – 3 PM</label>
                    </div>
                    
                    <div className="time-slot-option">
                      <input
                        type="radio"
                        id="evening"
                        name="deliveryTimeSlot"
                        value="Evening (3 PM – 6 PM)"
                        checked={inputs.deliveryTimeSlot === "Evening (3 PM – 6 PM)"}
                        onChange={handleChange}
                      />
                      <label htmlFor="evening">3 PM – 6 PM</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="form-column right-column">
              <div className="form-section">
                <h2 className="section-title">Delivery Address</h2>
                
                <div className="form-group">
                  <label>Province</label>
                  <select
                    name="province"
                    value={inputs.province}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a province</option>
                    {allProvinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>District</label>
                  <select
                    name="district"
                    value={inputs.district}
                    onChange={handleChange}
                    required
                    disabled={!inputs.province}
                  >
                    <option value="">Select a district</option>
                    {availableDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {!inputs.province && (
                    <p className="helper-text">Please select a province first</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={inputs.city}
                    onChange={handleChange}
                    name="city"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Street Address</label>
                  <textarea
                    value={inputs.streetAddress}
                    onChange={handleChange}
                    name="streetAddress"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    value={inputs.postalCode}
                    onChange={handleChange}
                    name="postalCode"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="submit-container">
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDelivery;