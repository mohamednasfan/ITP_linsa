import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import Sidebar from "../../AdminDashBord/SideBar/Sidebar";

function UpdateEmploye() {
  const [inputs, setInputs] = useState({
    name: "",
    gmail: "",
    phone: "",
    address: "",
  });
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/employee/${id}`);
        setInputs(response.data.emp);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios.put(`http://localhost:5000/employee/${id}`, inputs).then((res) => res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendRequest().then(() => {
      window.alert("Account updated successfully!");
      history("/employeedetails");
    });
  };

  return (
    <div>
      <Sidebar />
      <div className="children_div_admin">
        <h1 className="topic_mash_mart">
          Update Account<span className="sub_topic_mash_mart"> Details</span>
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
            
            <button type="submit" className="admin_form_cneter_btn">
              Update Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateEmploye;
