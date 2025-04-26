import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AfterNav from "../../Home/NavBar/AfterNav";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useNavigate();

  useEffect(() => {
    async function fetchUserDetails() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post("http://localhost:5000/profile", {
          token: token,
        });
        if (response.data.status === "ok") {
          setUser(response.data.user);
        } else {
          console.error("Error retrieving user details:", response.data.data);
        }
      } catch (error) {
        console.error("Error retrieving user details:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, []);

  const deleteHandler = async () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (userConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/user/${user._id}`);
        window.alert("Account deleted successfully!");
        history("/");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <div>
      <AfterNav />
      <div className="children_div_admin">
        <h1 className="topic_mash_mart">
          Welcome Back, {user ? user.name : "User"}
        </h1>
        <div className="tbl_con_admin">
          {loading ? (
            <p>Loading user details...</p>
          ) : user ? (
            <div>
              <h3 className="profile_item">Name: {user.name}</h3>
              <h3 className="profile_item">Email: {user.email}</h3>
              <h3 className="profile_item">Address: {user.address}</h3>
              <h3 className="profile_item">Phone: {user.phone}</h3>
              <div className="btn_con">
                <Link
                  className="btn_dash_admin"
                  to={`/updateaccount/${user._id}`}
                >
                  Update
                </Link>
                <button
                  onClick={deleteHandler}
                  className="btn_dash_admin_dlt"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p>User data not found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
