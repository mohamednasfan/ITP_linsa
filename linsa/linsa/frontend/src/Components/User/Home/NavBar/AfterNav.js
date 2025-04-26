import React from "react";
import Logo from "../img/logo.webp";
import "./nav.css";
import { FaShoppingCart } from "react-icons/fa";

function AfterNav() {
  return (
    <div>
      <div className="nav_con_user horizontal_nav">
        <div>
          <img src={Logo} alt="logo_nav" className="nav_logo_user" />
        </div>
        <div className="nav_item_main horizontal_items">
          <h3
            className="nav_item"
            onClick={() => (window.location.href = "/afetrhome")}
          >
            Home
          </h3>
          <h3
            className="nav_item"
            onClick={() => (window.location.href = "/viewall")}
          >
            Product
          </h3>
          <h3
            className="nav_item"
            onClick={() => (window.location.href = "/ratedetails")}
          >
            Feedback
          </h3>
          <FaShoppingCart
            className="cart_icon"
            onClick={() => (window.location.href = "/view-cart")}
          />
          <button
            className="nav_btn_log"
            onClick={() => (window.location.href = "/userprofile")}
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default AfterNav;
