import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import Sidebar from "../../../AdminDashBord/SideBar/Sidebar";

function UpdateVehical() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/vehical/${id}`);
        setInputs(response.data.vehi);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:5000/vehical/${id}`, {
        name: String(inputs.name),
        phone: String(inputs.phone),
        address: String(inputs.address),
        gmail: String(inputs.gmail),
        numberplate: String(inputs.numberplate),
      })
      .then((res) => res.data);
  };
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);

    sendRequest().then(() => {
      window.alert("Details Update successfully!");
      history("/vehicaldetails");
    });
  };
  return (
    <div>
      <Sidebar />
      <div className="children_div_admin">
        <h1 className="topic_mash_mart">
          Update Vehical
          <span className="sub_topic_mash_mart"> Details</span>{" "}
        </h1>
        <div className="item_full_box">
          <form className="item_form_admin" onSubmit={handleSubmit}>
            <label className="form_box_item_lable">vehical name</label>
            <br></br>
            <input
              className="form_box_item_input"
              type="text"
              value={inputs.name}
              onChange={handleChange}
              name="name"
              required
            />
            <br></br>
            <label className="form_box_item_lable">owener phone</label>
            <br></br>
            <input
              className="form_box_item_input"
              type="text"
              pattern="[0-9]{10}"
              value={inputs.phone}
              onChange={handleChange}
              name="phone"
              required
            />
            <br></br>
            <label className="form_box_item_lable">owener gmail</label>
            <br></br>
            <input
              className="form_box_item_input"
              type="email"
              value={inputs.gmail}
              onChange={handleChange}
              name="gmail"
              required
            />
            <br></br>
            <label className="form_box_item_lable">owener address</label>
            <br></br>
            <input
              className="form_box_item_input"
              type="text"
              value={inputs.address}
              onChange={handleChange}
              name="address"
              required
            />
            <br></br>
            <label className="form_box_item_lable">number plate</label>
            <br></br>
            <input
              className="form_box_item_input"
              type="text"
              value={inputs.numberplate}
              onChange={handleChange}
              name="numberplate"
              pattern="[0-9]{4}"
              maxLength="4"
              title="Please enter exactly 4 digits"
              required
            />
            <br></br>
            <button type="submit" className="admin_form_cneter_btn">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateVehical;
