import React, { useState } from "react";
import "./sidebar.css";
import Logo from "./img/logo.webp";

const Sidebar = ({ children }) => {
  const [activePage, setActivePage] = useState(() => {
    const path = window.location.pathname;
    if (path === "/admin") return "dashboard";
    if (path === "/delivrydata") return "delivery";
    if (path === "/employeedetails") return "employee";
    if (path === "/admin-allproducts") return "product";
    if (path === "/userdetails") return "user";
    return "";
  });

  const navigate = (path, page) => {
    setActivePage(page);
    window.location.href = path;
  };

  return (
    <div>
      <div className="container_nav">
        <div className="sidebar">
          <div className="nav_header">
            <img src={Logo} alt="logo" className="nav_logo" />
          </div>
          
          <div className="nav_items_container">
            <div className="nav_item_main">
              <div 
                className={`nav_item ${activePage === "dashboard" ? "active" : ""}`}
                onClick={() => navigate("/admin", "dashboard")}
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </div>
              
              <div 
                className={`nav_item ${activePage === "delivery" ? "active" : ""}`}
                onClick={() => navigate("/delivrydata", "delivery")}
              >
                <i className="fas fa-truck"></i>
                <span>Delivery</span>
              </div>
              
              <div 
                className={`nav_item ${activePage === "employee" ? "active" : ""}`}
                onClick={() => navigate("/employeedetails", "employee")}
              >
                <i className="fas fa-users"></i>
                <span>Employee</span>
              </div>
              
              <div 
                className={`nav_item ${activePage === "product" ? "active" : ""}`}
                onClick={() => navigate("/admin-allproducts", "product")}
              >
                <i className="fas fa-box"></i>
                <span>Product</span>
              </div>
              
              <div 
                className={`nav_item ${activePage === "user" ? "active" : ""}`}
                onClick={() => navigate("/userdetails", "user")}
              >
                <i className="fas fa-user"></i>
                <span>User</span>
              </div>
            </div>
          </div>
          
          <div className="sidebar_footer">
            <button className="logout_btn">
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
            <p>Linsa Admin v1.0</p>
          </div>
        </div>
      </div>
      <div className="adminsmalnav">
        <h3>Admin Controller Panel</h3>
      </div>
    </div>
  );
};

export default Sidebar;
