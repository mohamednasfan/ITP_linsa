import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import AfterNav from "../../Home/NavBar/AfterNav";

function AddDilivery() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    gmail: "",
    phone: "",
    locatin: "",
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
      await axios.post("http://localhost:5000/deliveri", inputs);
      setLoading(false);
      alert("Delivery details submitted successfully!");
      navigate("/myorder");
    } catch (error) {
      console.error("Error submitting delivery details:", error);
      setError("Error submitting delivery details. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading_spinner">
        <div className="spinner"></div>
        <p className="loading_text">Submitting delivery details...</p>
      </div>
    );
  }

  return (
    <div>
      <AfterNav />
      <div className="">
        <h1 className="topic_mash_mart">
          Delivery<span className="sub_topic_mash_mart"> Form</span>
        </h1>
        <div className="item_full_box">
          <form className="item_form_admin" onSubmit={handleSubmit}>
            <h2 className="form_title">Delivery Information</h2>

            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="name"
                id="name"
                value={inputs.name}
                onChange={handleChange}
                required
                placeholder="Name"
              />
              <label className="form_box_item_lable" htmlFor="name">Name</label>
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
              <textarea
                className="form_box_item_input"
                type="text"
                name="locatin"
                id="locatin"
                value={inputs.locatin}
                onChange={handleChange}
                required
                placeholder="Location"
              />
              <label className="form_box_item_lable" htmlFor="locatin">Location</label>
            </div>

            {error && <div className="delivery-error-message">{error}</div>}

            <button type="submit" className="admin_form_cneter_btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDilivery;
