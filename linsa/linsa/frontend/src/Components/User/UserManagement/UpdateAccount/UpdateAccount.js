import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import AfterNav from "../../Home/NavBar/AfterNav";
function UpdateAccount() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${id}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:5000/user/${id}`, user);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendRequest().then(() => {
      window.alert("Updated successfully!");
      window.location.href = "/userprofile";
    });
  };

  return (
    <div>
      <AfterNav />
      <div className="children_div_user">
        <h1 className="topic_mash_mart">
          Update<span className="sub_topic_mash_mart"> Your Account</span>
        </h1>
        
        <div className="item_full_box">
          <form className="item_form_admin" onSubmit={handleSubmit}>
            <h2 className="form_title">User Information</h2>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="name"
                id="name"
                value={user.name}
                onChange={handleInputChange}
                required
                placeholder="Full Name"
              />
              <label className="form_box_item_lable" htmlFor="name">Full Name</label>
            </div>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="email"
                name="email"
                id="email"
                value={user.email}
                onChange={handleInputChange}
                required
                placeholder="Email"
              />
              <label className="form_box_item_lable" htmlFor="email">Email</label>
            </div>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="address"
                id="address"
                value={user.address}
                onChange={handleInputChange}
                required
                placeholder="Address"
              />
              <label className="form_box_item_lable" htmlFor="address">Address</label>
            </div>
            
            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="phone"
                id="phone"
                pattern="[0-9]{10}"
                value={user.phone}
                onChange={handleInputChange}
                required
                placeholder="Phone Number"
              />
              <label className="form_box_item_lable" htmlFor="phone">Phone Number</label>
            </div>
            
            <button type="submit" className="admin_form_cneter_btn">
              Update Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateAccount;
