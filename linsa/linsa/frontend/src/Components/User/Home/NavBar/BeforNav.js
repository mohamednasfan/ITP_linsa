import React from "react";
import Logo from "../img/logo.webp";
import "./nav.css";

function BeforNav() {
  const notcompleate = () => {
    alert("This Page Under Construction");
  };

  return (
    <div>
      <div className="nav_con_user horizontal_nav">
        <div>
          <img src={Logo} alt="logo_nav" className="nav_logo_user" />
        </div>
        <div className="nav_item_main horizontal_items">
          <h3 className="nav_item">Home</h3>
          <h3 className="nav_item" onClick={notcompleate}>
            About
          </h3>
          <h3 className="nav_item" onClick={notcompleate}>
            Contact Us
          </h3>
          <button
            className="nav_btn_log"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </button>
          <button
            className="nav_btn_regi"
            onClick={() => (window.location.href = "/userregister")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default BeforNav;
