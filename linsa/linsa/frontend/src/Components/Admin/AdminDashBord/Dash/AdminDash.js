import React from "react";
import "./admindash.css";
import Sidebar from "../SideBar/Sidebar";
import Adminimg from "./img/nashfan2.webp";
import'../../Admin.css'
function AdminDash() {
  return (
    <div>
      <Sidebar />
      <div className="admin-container">
        <div className="welcomebox_admin fullscreen">
          <div className="welcome_sub_box_admin fullscreen-box">
            <div className="admin-content-wrapper fullscreen-wrapper">
              <img src={Adminimg} alt="adminimg" className="welcomeimg fullscreen-image" />
              <h1 className="admin-welcome-text">Welcome Back Admin</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDash;
