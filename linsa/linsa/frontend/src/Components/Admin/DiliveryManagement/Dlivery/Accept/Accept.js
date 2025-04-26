import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import Sidebar from "../../../AdminDashBord/SideBar/Sidebar";

function Accept() {
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/deliveri/${id}`);
        setInputs(response.data.deliveries);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch delivery details.");
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:5000/deliveri/${id}`, {
        name: String(inputs.name),
        gmail: String(inputs.gmail),
        phone: String(inputs.phone),
        locatin: String(inputs.locatin),
        status: String(inputs.status),
      });
    } catch (error) {
      console.error("Error updating delivery:", error);
      setError("Failed to update delivery status.");
    }
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await sendRequest();
    setLoading(false);
    alert("Status updated successfully!");
    navigate("/delivrydata");
  };

  if (loading) {
    return (
      <div className="loading_spinner">
        <div className="spinner"></div>
        <p className="loading_text">Updating delivery status...</p>
      </div>
    );
  }

  return (
    <div>
      <Sidebar />
      <div className="children_div_admin">
        <h1 className="topic_mash_mart">
          Delivery<span className="sub_topic_mash_mart"> Accept Form</span>
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
                readOnly
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
                readOnly
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
                value={inputs.phone}
                readOnly
                placeholder="Phone Number"
              />
              <label className="form_box_item_lable" htmlFor="phone">Phone Number</label>
            </div>

            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="locatin"
                id="locatin"
                value={inputs.locatin}
                readOnly
                placeholder="Location"
              />
              <label className="form_box_item_lable" htmlFor="locatin">Location</label>
            </div>

            <div className="form_group">
              <select
                className="form_box_item_input"
                name="status"
                id="status"
                value={inputs.status}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="accept">Accept</option>
                <option value="on_the_way">On the way</option>
                <option value="compleate">Complete</option>
              </select>
              <label className="form_box_item_lable" htmlFor="status">Status</label>
            </div>

            {error && <div className="error_message">{error}</div>}

            <button type="submit" className="admin_form_cneter_btn">
              Update Status
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Accept;
