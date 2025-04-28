import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import Sidebar from "../../../AdminDashBord/SideBar/Sidebar";

function Accept() {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone: "",
    locatin: "",
    status: ""
  });
  const history = useNavigate();
  const id = useParams().id;
  
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/deliveri/${id}`
        );
        // Make sure we're actually getting the correct data from response
        if (response.data && response.data.deliveries) {
          setInputs(response.data.deliveries);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    try {
      // Only update the status field and preserve all other fields
      await axios.put(`http://localhost:5000/deliveri/${id}`, {
        status: String(inputs.status),
        // Don't send other fields to avoid overwriting with potentially undefined values
      });
      return true;
    } catch (error) {
      console.error("Error updating status:", error);
      return false;
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
    
    // Validate that we have all required data before submitting
    if (!inputs.status) {
      window.alert("Please select a status");
      return;
    }
    
    const success = await sendRequest();
    if (success) {
      window.alert("Status updated successfully!");
      history("/delivrydata");
    } else {
      window.alert("Failed to update status. Please try again.");
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="children_div_admin">
        <h1 className="topic_mash_mart">
          Delivery
          <span className="sub_topic_mash_mart">Accept Form</span>{" "}
        </h1>

        <div className="item_full_box">
          <form className="item_form_admin" onSubmit={handleSubmit}>
            <label className="form_box_item_lable">Name</label>
            <br></br>
            <input
              className="form_box_item_input"
              type="text"
              readOnly
              value={inputs.name || ""}
              name="name"
            />
            <br></br>
            <label className="form_box_item_lable">Email</label>
            <br></br>
            <input
              className="form_box_item_input"
              type="email"
              value={inputs.email || ""}
              name="email"
              readOnly
            />
            <br></br>
            <label className="form_box_item_lable">Phone</label>
            <br></br>
            <input
              className="form_box_item_input"
              type="text"
              value={inputs.phone || ""}
              name="phone"
              readOnly
            />
            <br></br>
            <label className="form_box_item_lable">Location</label>
            <br></br>
            <input
              className="form_box_item_input"
              type="text"
              value={inputs.locatin || ""}
              name="locatin"
              readOnly
            />
            <br></br>
            <label className="form_box_item_lable">Status</label>
            <br></br>
            <select
              className="form_box_item_input"
              value={inputs.status || ""}
              onChange={handleChange}
              name="status"
              required
            >
              <option value="">Select Status</option>
              <option value="accept">Accept</option>
              <option value="In_progress">In Progress</option>
              <option value="complete">Complete</option>
            </select>

            <br></br>
            <button type="submit" className="admin_form_cneter_btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Accept;