import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../AdminDashBord/SideBar/Sidebar";

const URL = "http://localhost:5000/drive";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function DriverDetails() {
  //fetch data
  const [driv, setDriver] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setDriver(data.driv));
  }, []);

  /*Delete Function */
  const history = useNavigate();
  const deleteHandler = async (_id) => {
    // Define _id as a parameter
    const confirmed = window.confirm(
      "Are you sure you want to delete this Driver Details?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`); // Correct URL construction
        window.alert("deleted successfully!");
        history("/driverdetails");
        window.location.reload(); // Reload the page
      } catch (error) {
        // Handle deletion error if needed
        console.error("Error deleting details:", error);
      }
    }
  };

  /*Search Function */
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filtered = data.driv.filter((driv) =>
        Object.values(driv).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setDriver(filtered);
      setNoResults(filtered.length === 0);
    });
  };

  const handleStatusChange = async (driverId, newStatus) => {
    try {
      const response = await axios.put(`${URL}/${driverId}`, {
        status: newStatus
      });
      
      if (response.data.success) {
        // Update the local state
        setDriver(prevDrivers => 
          prevDrivers.map(driver => 
            driver._id === driverId 
              ? { ...driver, status: newStatus }
              : driver
          )
        );
        alert("Driver status updated successfully!");
      } else {
        throw new Error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating driver status:", error);
      alert("Failed to update driver status. Please try again.");
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="children_div_admin">
        <div className="dash_button_set">
          <button
            className="btn_dash_admin"
            onClick={() => (window.location.href = "/adddriver")}
          >
            Add New Driver
          </button>

          <tr>
            <td className="">
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                name="search"
                className="serch_inpt"
                placeholder="Search Here..."
              ></input>
            </td>

            <td>
              <button onClick={handleSearch} className="btn_dash_admin">
                Search
              </button>
            </td>
          </tr>
        </div>

        <div className="tbl_con_admin">
          <h1 className="topic_inventory">
            Driver Account
            <span className="sub_topic_inventory"> Details</span>{" "}
          </h1>
          <table className="table_details_admin">
            <thead>
              <tr className="admin_tbl_tr">
                <th className="admin_tbl_th">name</th>
                <th className="admin_tbl_th">phone</th>
                <th className="admin_tbl_th">address</th>
                <th className="admin_tbl_th">gmail</th>
                <th className="admin_tbl_th">status</th>
                <th className="admin_tbl_th">action</th>
              </tr>
            </thead>
            {noResults ? (
              <div>
                <br></br>
                <h1 className="con_topic">
                  No <span className="clo_us"> Found</span>{" "}
                </h1>
              </div>
            ) : (
              <tbody>
                {driv.map((item, index) => (
                  <tr className="admin_tbl_tr" key={index}>
                    <td className="admin_tbl_td">{item.name}</td>
                    <td className="admin_tbl_td">{item.phone}</td>
                    <td className="admin_tbl_td">{item.address}</td>
                    <td className="admin_tbl_td">{item.gmail}</td>
                    <td className="admin_tbl_td">
                      <select 
                        value={item.status || 'available'} 
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="away">Away</option>
                      </select>
                    </td>
                    <td className="admin_tbl_td">
                      <Link
                        to={`/updateedriver/${item._id}`}
                        className="btn_dash_admin"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => deleteHandler(item._id)}
                        className="btn_dash_admin_dlt"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default DriverDetails;
